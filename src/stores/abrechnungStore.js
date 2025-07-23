import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { collection, collectionGroup, getDocs, query, addDoc, serverTimestamp, getDoc } from 'firebase/firestore';
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
        return abrechnungen.value.length < totalDocuments.value;
    });

    // Actions
    const switchEnvironmentAndFetchData = async (newMode) => {
        if (!['production', 'test'].includes(newMode) || newMode === dataMode.value) {
            return;
        }

        logEnvironmentState(`Switching from ${dataMode.value} to ${newMode}`, newMode);
        const previousMode = dataMode.value;
        dataMode.value = newMode;

        // Critical: Clear all state and cache for the new environment
        abrechnungen.value = [];
        dataCache[newMode] = null;
        lastDocument.value = null;
        currentPage.value = 0;
        totalDocuments.value = 0;

        try {
            await fetchAbrechnungen({ forceRefresh: true });
            logEnvironmentState(`Switch to ${newMode} complete.`, newMode);
        } catch (err) {
            console.error(`Failed to fetch data for ${newMode}, reverting.`, err);
            dataMode.value = previousMode; // Revert on error
            logEnvironmentState(`Reverted to ${previousMode}.`, previousMode);
        }
    };

    const fetchAbrechnungen = async (options = {}) => {
        const { page = 1, pageSize = 15, forceRefresh = false, filters = {} } = options;
        const currentMode = dataMode.value;

        if (isLoading.value) return;
        isLoading.value = true;
        error.value = null;

        if (forceRefresh) {
            logEnvironmentState('Force refreshing data.', currentMode);
            abrechnungen.value = [];
            dataCache[currentMode] = null;
            lastDocument.value = null;
            currentPage.value = 0;
        }

        if (page === 1 && !forceRefresh && dataCache[currentMode]) {
            logEnvironmentState('Using cached data.', currentMode);
            abrechnungen.value = dataCache[currentMode];
            isLoading.value = false;
            return;
        }

        try {
            const invoicesSubcollection = currentMode === 'production' ? 'invoice-history' : 'invoice-history-test';
            const insurersCollectionRef = collection(db, collections.value.insurers);

            const [insurersSnapshot, invoicesSnapshot] = await Promise.all([
                getDocs(insurersCollectionRef),
                getDocs(query(collectionGroup(db, invoicesSubcollection)))
            ]);

            const insurerMap = new Map();
            insurersSnapshot.forEach(doc => {
                insurerMap.set(doc.id, doc.data().name || 'Unbekannt');
            });

            const allInvoices = invoicesSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                path: doc.ref.path,
            }));

            let processedInvoices = allInvoices.map(invoice => {
                const pathParts = invoice.path.split('/');
                const insurerId = pathParts[pathParts.indexOf(invoicesSubcollection) - 1];
                const insurerName = insurerMap.get(insurerId) || 'Unbekannt';

                if (insurerName === 'Unbekannt') {
                    console.warn(`[Orphan Invoice] ID: ${invoice.id} refs orphan Insurer ID: ${insurerId} in collection '${collections.value.insurers}'.`);
                }
                return { ...invoice, insurerId, insurerName };
            });

            // Apply filters and sorting in memory
            if (filters.documentType) {
                processedInvoices = processedInvoices.filter(i => i.documentType === filters.documentType);
            }
            if (filters.status) {
                processedInvoices = processedInvoices.filter(i => i.status === filters.status);
            }
            processedInvoices.sort((a, b) => new Date(b.date) - new Date(a.date));

            totalDocuments.value = processedInvoices.length;
            const startIndex = (page - 1) * pageSize;
            const pageInvoices = processedInvoices.slice(startIndex, startIndex + pageSize);

            if (page === 1) {
                abrechnungen.value = pageInvoices;
                dataCache[currentMode] = [...pageInvoices]; // Cache the first page
            } else {
                abrechnungen.value.push(...pageInvoices);
            }
            currentPage.value = page;

        } catch (err) {
            console.error('Error in fetchAbrechnungen:', err);
            error.value = err.message;
        } finally {
            isLoading.value = false;
        }
    };

    const fetchMoreAbrechnungen = () => {
        if (hasMorePages.value) {
            fetchAbrechnungen({ page: currentPage.value + 1 });
        }
    };

    const resetPagination = () => {
        abrechnungen.value = [];
        lastDocument.value = null;
        currentPage.value = 0;
        totalDocuments.value = 0;
        dataCache[dataMode.value] = null; // Clear cache for the current environment
        logEnvironmentState('Pagination has been reset.', dataMode.value);
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
        fetchMoreAbrechnungen,
        resetPagination,
    };
});
