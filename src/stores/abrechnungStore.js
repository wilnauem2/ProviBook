import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
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
        if (!['production', 'test'].includes(newMode) || newMode === dataMode.value) {
            return;
        }
        logEnvironmentState(`Switching from ${dataMode.value} to ${newMode}`, newMode);
        dataMode.value = newMode;
        await fetchAbrechnungen({ forceRefresh: true });
        logEnvironmentState(`Switch to ${newMode} complete.`, newMode);
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

            const invoicesSubcollection = currentMode === 'production' ? 'invoice-history' : 'invoice-history-test';
            const insurersCollectionRef = collection(db, collections.value.insurers);

            const insurersSnapshot = await getDocs(insurersCollectionRef);
            const insurerMap = new Map();
            insurersSnapshot.forEach(doc => insurerMap.set(doc.id, doc.data()));

            console.log('Checking imported Firestore functions:', { orderBy, limit, startAfter });
            const pageSize = 15;
            let queryConstraints = [orderBy('date', 'desc'), limit(pageSize)];
            if (lastDocument.value) {
                queryConstraints.push(startAfter(lastDocument.value));
            }
            const q = query(collectionGroup(db, invoicesSubcollection), ...queryConstraints);

            const invoicesSnapshot = await getDocs(q);
            lastDocument.value = invoicesSnapshot.docs[invoicesSnapshot.docs.length - 1];

            const getAbrechnungsweg = (bezugsweg) => {
                if (!bezugsweg) return null;

                let weg = Array.isArray(bezugsweg) ? bezugsweg.join(', ') : String(bezugsweg);

                if (weg.toLowerCase().trim() === 'email') {
                    return 'E-Mail';
                }
                return weg;
            };

            const pageInvoices = invoicesSnapshot.docs.map(doc => {
                const invoice = { id: doc.id, ...doc.data(), path: doc.ref.path };
                const pathParts = invoice.path.split('/');
                const insurerId = pathParts.length > 1 ? pathParts[pathParts.length - 3] : null;
                const insurerData = insurerId ? insurerMap.get(insurerId) : null;

                return {
                    ...invoice,
                    insurerId,
                    insurerName: insurerData?.name || 'Unbekannt',
                    dokumentenart: insurerData?.dokumentenart || 'Unbekannt',
                    abrechnungsweg: getAbrechnungsweg(insurerData?.bezugsweg),
                };
            });

            let processedPage = pageInvoices;
            if (filters.searchQuery) {
                const lowerCaseQuery = filters.searchQuery.toLowerCase();
                processedPage = processedPage.filter(i => 
                    i.insurerName.toLowerCase().includes(lowerCaseQuery) ||
                    (i.reference && i.reference.toLowerCase().includes(lowerCaseQuery))
                );
            }
            if (filters.sortField) {
                processedPage.sort((a, b) => {
                    const field = filters.sortField;
                    const ascending = filters.sortAscending;
                    let valA = a[field];
                    let valB = b[field];
                    if (valA < valB) return ascending ? -1 : 1;
                    if (valA > valB) return ascending ? 1 : -1;
                    return 0;
                });
            }

            abrechnungen.value.push(...processedPage);
            currentPage.value += 1;

            if (invoicesSnapshot.docs.length < pageSize) {
                totalDocuments.value = abrechnungen.value.length;
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
        dataMode,
        abrechnungen,
        isLoading,
        error,
        lastDocument,
        totalDocuments,
        currentPage,
        collections,
        hasMorePages,
        switchEnvironmentAndFetchData,
        fetchAbrechnungen,
    };
});
