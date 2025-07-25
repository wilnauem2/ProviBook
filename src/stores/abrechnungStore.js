import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { collection, collectionGroup, getDocs, query, addDoc, serverTimestamp, getDoc, orderBy, limit, startAfter } from 'firebase/firestore';
import { db } from '../firebase';

// Using separate caches for each environment to prevent data leakage
const dataCache = {
    production: null,
    test: null
};

const logEnvironmentState = (message, mode) => {
    console.log(`🔍 ENV DEBUG: ${message} | Mode: ${mode}`);
};

export const useAbrechnungStore = defineStore('abrechnung', () => {
    // State
    const abrechnungen = ref([]);
    const isLoading = ref(false);
    const error = ref(null);
    const dataMode = ref('production'); // 'production' or 'test'
    const lastDocument = ref(null); // For pagination
    const totalDocuments = ref(0);
    const currentPage = ref(0);
    
    // Debug: Log when abrechnungen changes
    watch(abrechnungen, (newVal) => {
      console.log('abrechnungen updated:', {
        count: newVal.length,
        firstItem: newVal[0],
        allItems: newVal
      });
    }, { deep: true });

    // Getters
    const collections = computed(() => {
        const isProd = dataMode.value === 'production';
        return {
            insurers: isProd ? 'insurers' : 'insurers_test',
        };
    });

    const hasMorePages = computed(() => {
        // If totalDocuments is not yet known precisely, we assume there are more pages if the last fetch returned a full page.
        return abrechnungen.value.length < totalDocuments.value || totalDocuments.value === 0;
    });

    // Actions
    const switchEnvironmentAndFetchData = async (newMode) => {
        if (!['production', 'test'].includes(newMode)) {
            console.error(`Invalid mode: ${newMode}. Must be 'production' or 'test'`);
            return;
        }
        
        if (newMode === dataMode.value) {
            console.log(`Already in ${newMode} mode, skipping switch.`);
            return;
        }
        
        logEnvironmentState(`Switching from ${dataMode.value} to ${newMode}`, newMode);
        
        // Update the data mode
        const previousMode = dataMode.value;
        dataMode.value = newMode;
        
        try {
            // Clear existing data
            resetPagination();
            
            // Fetch fresh data for the new mode
            await fetchAbrechnungen({ forceRefresh: true });
            logEnvironmentState(`Switch to ${newMode} complete.`, newMode);
        } catch (error) {
            // Revert on error
            console.error('Error switching environment:', error);
            dataMode.value = previousMode;
            throw error;
        }
    };
    
    // Reset pagination and fetch first page
    const resetPagination = () => {
        lastDocument.value = null;
        currentPage.value = 0;
        totalDocuments.value = 0;
        abrechnungen.value = [];
    };
    
    // Load more data for pagination
    const loadMoreAbrechnungen = async (filters = {}) => {
        if (isLoading.value || !hasMorePages.value) return;
        console.log('Loading more Abrechnungen...');
        await fetchAbrechnungen({ filters });
    };

    const fetchAbrechnungen = async (options = {}) => {
        const { forceRefresh = false, filters = {} } = options;
        const currentMode = dataMode.value;

        if (isLoading.value) return;
        if (!forceRefresh && !hasMorePages.value && lastDocument.value) return;

        isLoading.value = true;
        error.value = null;

        try {
            if (forceRefresh) {
                abrechnungen.value = [];
                lastDocument.value = null;
                currentPage.value = 0;
                totalDocuments.value = 0;
            }

            console.log(`[${new Date().toISOString()}] Fetching Abrechnungen for environment: ${currentMode}`);
            
            const invoicesSubcollection = currentMode === 'production' ? 'invoice-history' : 'invoice-history-test';
            const insurersCollectionRef = collection(db, collections.value.insurers);

            console.log(`Fetching insurers from collection: ${collections.value.insurers}`);
            const insurersSnapshot = await getDocs(insurersCollectionRef);
            const insurerMap = new Map();
            insurersSnapshot.forEach(doc => {
                console.log(`Found insurer: ${doc.id}`, doc.data());
                insurerMap.set(doc.id, doc.data());
            });

            const pageSize = 15;
            let queryConstraints = [orderBy('date', 'desc'), limit(pageSize)];
            
            if (lastDocument.value) {
                console.log('Using lastDocument for pagination');
                queryConstraints.push(startAfter(lastDocument.value));
            }
            
            console.log(`Querying collection group: ${invoicesSubcollection} with constraints:`, queryConstraints);
            const q = query(collectionGroup(db, invoicesSubcollection), ...queryConstraints);

            const invoicesSnapshot = await getDocs(q);
            console.log(`Found ${invoicesSnapshot.docs.length} invoices`);
            
            if (invoicesSnapshot.docs.length > 0) {
                lastDocument.value = invoicesSnapshot.docs[invoicesSnapshot.docs.length - 1];
            } else {
                console.log('No more documents to fetch');
                lastDocument.value = null;
            }

            const getAbrechnungsweg = (bezugsweg) => {
                if (!bezugsweg) return null;

                let weg = Array.isArray(bezugsweg) ? bezugsweg.join(', ') : String(bezugsweg);

                if (weg.toLowerCase().trim() === 'email') {
                    return 'E-Mail';
                }
                return weg;
            };

            console.log('Processing invoice documents...');
            const pageInvoices = [];
            
            for (const doc of invoicesSnapshot.docs) {
                try {
                    const invoiceData = doc.data();
                    console.log(`Processing invoice ${doc.id}:`, invoiceData);
                    
                    const invoice = { 
                        id: doc.id, 
                        ...invoiceData, 
                        path: doc.ref.path,
                        // Ensure date is properly formatted
                        date: invoiceData.date?.toDate ? invoiceData.date.toDate() : new Date(invoiceData.date || 0)
                    };
                    
                    const pathParts = invoice.path.split('/');
                    const insurerId = pathParts.length > 1 ? pathParts[pathParts.length - 3] : null;
                    const insurerData = insurerId ? insurerMap.get(insurerId) : null;

                    // Document type normalization - treats all insurers equally
                    const normalizeDocTypes = (docType) => {
                        try {
                            // If no document type is provided, use the insurer's dokumentenart or default to PDF
                            if (!docType) {
                                return insurerData?.dokumentenart?.length > 0 
                                    ? [...new Set(insurerData.dokumentenart.map(t => t.toUpperCase()))]
                                    : ['PDF'];
                            }
                            
                            let result = [];
                            
                            // Handle array input
                            if (Array.isArray(docType)) {
                                result = docType.flatMap(item => {
                                    if (!item) return [];
                                    // If item is an object, extract its values
                                    if (typeof item === 'object') {
                                        return Object.values(item)
                                            .map(v => String(v).toUpperCase())
                                            .filter(Boolean);
                                    }
                                    // Handle string values
                                    return String(item).toUpperCase().split(',').map(t => t.trim());
                                });
                            } 
                            // Handle string input (comma-separated or single value)
                            else if (typeof docType === 'string') {
                                result = docType.toUpperCase().split(',').map(t => t.trim());
                            }
                            // Handle object input
                            else if (typeof docType === 'object') {
                                result = Object.values(docType)
                                    .map(v => String(v).toUpperCase())
                                    .filter(Boolean);
                            }
                            
                            // Clean and deduplicate results
                            result = [...new Set(
                                result
                                    .flat()
                                    .filter(Boolean)
                                    .map(t => t.trim())
                            )];
                            
                            // If no valid types found, use insurer's dokumentenart or default to PDF
                            if (result.length === 0) {
                                return insurerData?.dokumentenart?.length > 0 
                                    ? [...new Set(insurerData.dokumentenart.map(t => t.toUpperCase()))]
                                    : ['PDF'];
                            }
                            
                            return result;
                            
                        } catch (error) {
                            console.error('Error normalizing document type:', error, 'Input was:', docType);
                            // Fall back to insurer's dokumentenart or default to PDF
                            return insurerData?.dokumentenart?.length > 0 
                                ? [...new Set(insurerData.dokumentenart.map(t => t.toUpperCase()))]
                                : ['PDF'];
                        }
                    };

                    // Get the normalized document types
                    const normalizedDocTypes = normalizeDocTypes(insurerData?.dokumentenart || invoice.documentType || 'Unbekannt');
                    console.log('Normalized document types for invoice:', {
                        id: invoice.id,
                        original: invoice.documentType,
                        normalized: normalizedDocTypes
                    });

                    const processedInvoice = {
                        id: invoice.id,
                        date: invoice.date,
                        reference: invoice.reference || 'Keine Referenz',
                        // Ensure we're using the normalized document types
                        documentType: normalizedDocTypes,
                        status: invoice.status || 'Unbekannt',
                        insurer: insurerData?.name || 'Unbekannter Versicherer',
                        insurerId: insurerId, // Add insurerId for debugging
                        note: invoice.note || null,
                        bezugsweg: getAbrechnungsweg(insurerData?.bezugsweg) || 'Unbekannt',
                        path: invoice.path,
                        // Add raw data for debugging
                        _debug: {
                            rawDocumentType: invoice.documentType,
                            hasDokumentenart: !!insurerData?.dokumentenart,
                            dokumentenart: insurerData?.dokumentenart || []
                        }
                    };
                    
                    // Enhanced logging for Test-Versicherer 9
                    if (insurerData?.name === 'Test-Versicherer 9') {
                        console.log('=== DEBUG: Final Processed Invoice ===');
                        console.log('Insurer:', insurerData.name);
                        console.log('Insurer ID:', insurerId);
                        console.log('Raw documentType:', invoice.documentType);
                        console.log('Normalized document types:', normalizedDocTypes);
                        console.log('Insurer data:', insurerData);
                        console.log('Processed invoice:', JSON.parse(JSON.stringify(processedInvoice)));
                    }
                    
                    pageInvoices.push(processedInvoice);
                } catch (err) {
                    console.error(`Error processing invoice ${doc.id}:`, err);
                }
            }

            // Process and sort the current page
            let processedPage = [...pageInvoices]; // Create a new array to avoid mutating the original
            
            // Apply search filter if provided
            if (filters.searchQuery) {
                const lowerCaseQuery = filters.searchQuery.toLowerCase();
                processedPage = processedPage.filter(i => 
                    (i.insurer && i.insurer.toLowerCase().includes(lowerCaseQuery)) ||
                    (i.reference && i.reference.toLowerCase().includes(lowerCaseQuery))
                );
            }

            // Apply sorting if requested
            if (filters.sortField) {
                processedPage.sort((a, b) => {
                    const field = filters.sortField;
                    const ascending = filters.sortAscending;
                    let valA = a[field];
                    let valB = b[field];
                    
                    // Handle dates
                    if (valA instanceof Date) valA = valA.getTime();
                    if (valB instanceof Date) valB = valB.getTime();
                    
                    // Handle undefined/null values
                    if (valA == null) return ascending ? -1 : 1;
                    if (valB == null) return ascending ? 1 : -1;
                    
                    // Compare values
                    if (valA < valB) return ascending ? -1 : 1;
                    if (valA > valB) return ascending ? 1 : -1;
                    return 0;
                });
            }

            console.log(`Adding ${processedPage.length} processed invoices to store`);
            
            // Update the reactive array in a way that triggers Vue's reactivity
            if (forceRefresh) {
                abrechnungen.value = processedPage;
            } else {
                // Create a new array to ensure reactivity
                abrechnungen.value = [...abrechnungen.value, ...processedPage];
            }
            
            currentPage.value += 1;

            // Update total documents if we've reached the end
            if (invoicesSnapshot.docs.length < pageSize) {
                totalDocuments.value = abrechnungen.value.length;
                console.log(`Reached end of collection. Total documents: ${totalDocuments.value}`);
            }

        } catch (err) {
            console.error('Error in fetchAbrechnungen:', err);
            error.value = err.message;
        } finally {
            isLoading.value = false;
        }
    };

    // Return all functions and state
    return {
        // State
        dataMode,
        abrechnungen,
        isLoading,
        error,
        hasMorePages,
        currentPage,
        totalDocuments,
        
        // Getters
        collections,
        
        // Actions
        fetchAbrechnungen,
        switchEnvironmentAndFetchData,
        resetPagination,
        loadMoreAbrechnungen
    };
});
