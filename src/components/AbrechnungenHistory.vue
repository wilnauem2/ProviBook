<template>
  <div class="abrechnungen-history">
    <h2 class="text-xl font-semibold mb-4">Vergangene Abrechnungen</h2>
    
    <div class="mb-4 flex justify-between items-center">
      <div class="relative">
        <select 
          v-model="sortField" 
          class="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="date">Nach Datum sortieren</option>
          <option value="insurer">Nach Versicherung sortieren</option>
        </select>
      </div>
      
      <div class="flex items-center">
        <button 
          @click="sortAscending = !sortAscending"
          class="p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
          :title="sortAscending ? 'Aufsteigend' : 'Absteigend'"
        >
          <svg 
            class="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            :class="{ 'transform rotate-180': !sortAscending }"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        </button>
      </div>
    </div>
    
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th 
              scope="col" 
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              @click="setSort('date')"
            >
              <div class="flex items-center">
                Datum
                <SortIndicator :active="sortField === 'date'" :ascending="sortAscending" />
              </div>
            </th>
            <th 
              scope="col" 
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              @click="setSort('insurer')"
            >
              <div class="flex items-center">
                Versicherung
                <SortIndicator :active="sortField === 'insurer'" :ascending="sortAscending" />
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(abrechnung, index) in sortedAbrechnungen" :key="index" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ formatDate(abrechnung.date) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ abrechnung.insurer }}
            </td>
          </tr>
          <tr v-if="abrechnungen.length === 0">
            <td colspan="2" class="px-6 py-4 text-center text-sm text-gray-500">
              Keine vergangenen Abrechnungen gefunden.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

const props = defineProps({
  abrechnungen: {
    type: Array,
    required: true,
    default: () => []
  }
});

const sortField = ref('date');
const sortAscending = ref(false);

// Debug: Log props when they change
onMounted(() => {
  console.log('AbrechnungenHistory mounted with props:', JSON.parse(JSON.stringify(props)))
  console.log('AbrechnungenHistory - Raw abrechnungen:', JSON.parse(JSON.stringify(props.abrechnungen)));
  
  // Log each item in the array
  if (Array.isArray(props.abrechnungen)) {
    console.log(`Found ${props.abrechnungen.length} abrechnungen:`);
    props.abrechnungen.forEach((item, index) => {
      console.log(`  [${index}]:`, JSON.parse(JSON.stringify(item)));
    });
  }
})

// Watch for changes to the abrechnungen prop
watch(() => props.abrechnungen, (newVal) => {
  console.log('Abrechnungen prop changed:', JSON.parse(JSON.stringify(newVal)));
  
  if (Array.isArray(newVal)) {
    console.log(`New abrechnungen array has ${newVal.length} items`);
    newVal.forEach((item, index) => {
      console.log(`  [${index}]:`, JSON.parse(JSON.stringify(item)));
    });
  }
}, { deep: true });

const sortedAbrechnungen = computed(() => {
  console.log('--- sortedAbrechnungen computed ---');
  console.log('Input abrechnungen:', JSON.parse(JSON.stringify(props.abrechnungen)));
  
  if (!props.abrechnungen || !Array.isArray(props.abrechnungen)) {
    console.error('Invalid abrechnungen prop:', props.abrechnungen);
    return [];
  }
  
  if (props.abrechnungen.length === 0) {
    console.log('No abrechnungen to sort');
    return [];
  }
  
  console.log(`Sorting ${props.abrechnungen.length} abrechnungen by ${sortField.value} ${sortAscending.value ? 'ascending' : 'descending'}`);
  
  // Create a copy of the array to avoid mutating the original
  const sorted = [...props.abrechnungen];
  
  const result = sorted.sort((a, b) => {
    let comparison = 0;
    
    if (sortField.value === 'date') {
      // Log the items being compared
      console.log('\nComparing items for date sorting:');
      console.log('  Item A:', JSON.parse(JSON.stringify(a)));
      console.log('  Item B:', JSON.parse(JSON.stringify(b)));
      
      // Get timestamps for comparison
      const timeA = a.timestamp || (a.date ? new Date(a.date).getTime() : 0);
      const timeB = b.timestamp || (b.date ? new Date(b.date).getTime() : 0);
      
      console.log(`  Timestamps: ${timeA} (${new Date(timeA).toISOString()}) vs ${timeB} (${new Date(timeB).toISOString()})`);
      
      comparison = timeA - timeB;
      console.log(`  Comparison result: ${comparison}`);
    } else {
      const insurerA = a.insurer || '';
      const insurerB = b.insurer || '';
      comparison = insurerA.localeCompare(insurerB);
      console.log(`Comparing insurers: "${insurerA}" vs "${insurerB}" => ${comparison}`);
    }
    
    // If ascending, return the comparison as is, otherwise reverse it
    return sortAscending.value ? comparison : -comparison;
  });
  
  console.log('Sorted result:', JSON.parse(JSON.stringify(result)));
  return result;
});

const setSort = (field) => {
  console.log(`Sorting by ${field}, current field: ${sortField.value}, ascending: ${sortAscending.value}`);
  if (sortField.value === field) {
    sortAscending.value = !sortAscending.value;
  } else {
    sortField.value = field;
    sortAscending.value = false;
  }
  console.log(`New sort: field=${sortField.value}, ascending=${sortAscending.value}`);
}

const formatDate = (dateString) => {
  console.log(`Formatting date: ${dateString}`);
  
  if (!dateString) {
    console.log('  No date string provided');
    return '';
  }
  
  // If it's already a formatted string, return as is
  if (typeof dateString === 'string' && dateString.includes(',')) {
    console.log('  Already formatted:', dateString);
    return dateString;
  }
  
  let date;
  
  // Handle different date formats
  if (typeof dateString === 'number') {
    // It's a timestamp
    date = new Date(dateString);
    console.log(`  Parsed from timestamp ${dateString}:`, date);
  } else if (typeof dateString === 'object' && dateString !== null) {
    // It's a date object or similar
    date = new Date(dateString);
    console.log('  Parsed from object:', date);
  } else if (typeof dateString === 'string') {
    // Try to parse the string
    // Handle German date format: DD.MM.YYYY, HH:MM
    const match = dateString.match(/(\d{2})\.(\d{2})\.(\d{4}), (\d{2}):(\d{2})/);
    if (match) {
      const [_, day, month, year, hours, minutes] = match.map(Number);
      date = new Date(year, month - 1, day, hours, minutes);
      console.log('  Parsed from German format:', date);
    } else {
      // Try ISO format
      date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.error('  Could not parse date string:', dateString);
        return 'Ungültiges Datum';
      }
      console.log('  Parsed from string:', date);
    }
  } else {
    console.error('  Unsupported date format:', dateString);
    return 'Ungültiges Format';
  }
  
  // Format the date as DD.MM.YYYY, HH:MM
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  const formatted = `${day}.${month}.${year}, ${hours}:${minutes}`;
  console.log('  Formatted as:', formatted);
  
  return formatted;
};

</script>

<style scoped>
.sort-arrow {
  transition: transform 0.2s ease-in-out;
}
.sort-arrow.asc {
  transform: rotate(180deg);
}
</style>
