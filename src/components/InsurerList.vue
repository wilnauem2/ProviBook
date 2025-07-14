<template>
  <div class="h-full flex flex-col">
    <h2 class="text-lg font-semibold mb-4 text-gray-800">
      Versicherer ({{ insurers.length }})
    </h2>
   
    <div class="flex-1 overflow-y-auto w-full p-0">
      <div class="insurer-grid">
        <div
          v-for="insurer in insurers"
          :key="insurer.name"
          :class="[
            'p-3 rounded-lg cursor-pointer transition-all duration-200 border',
            selectedInsurer?.name === insurer.name
              ? 'bg-blue-100 border-blue-300 shadow-md'
              : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
          ]"
          @click="selectInsurer(insurer)"
        >
          <div class="flex items-center justify-between">
            <div class="flex-1 min-w-0">
              <h3 class="font-medium text-gray-900 truncate text-sm">
                {{ insurer.name }}
              </h3>
             
              <!-- Zusätzliche Informationen -->
              <div class="mt-1 space-y-1">
                <div v-if="insurer.turnus" class="text-xs text-gray-600">
                  {{ insurer.turnus }}
                </div>
               
                <div v-if="insurer.last_invoice" class="text-xs flex items-center">
                  <svg v-if="isOverdue(insurer)" class="w-3 h-3 mr-1 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                  </svg>
                  <svg v-else class="w-3 h-3 mr-1 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  {{ formatLastInvoice(insurer.last_invoice) }}
                </div>
              </div>
            </div>
           
            <!-- Status-Indikator -->
            <div class="ml-2 flex-shrink-0">
              <div v-if="isOverdue(insurer)" class="w-3 h-3 bg-red-500 rounded-full"></div>
              <div v-else class="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
      <!-- Debug Bar: Shows grid and tile width (Vue-friendly) -->

    </div>
  </div>
</template>

<script setup>

import { calculateDaysOverdue, isOverdue } from '../utils/dateUtils'

// Format last invoice date to show only the date part
const formatLastInvoice = (dateValue) => {
  try {
    // If value is null or undefined, return empty string
    if (dateValue == null) return ''
    
    // Handle the case where dateValue is a Proxy object with a raw property
    if (dateValue.raw) {
      const date = new Date(dateValue.raw)
      if (!isNaN(date.getTime())) {
        return formatDateWithRelative(date)
      }
    }
    
    // Handle the case where dateValue is an object with display and timestamp
    if (typeof dateValue === 'object') {
      // Try to get the display property if it exists
      if (dateValue.display && typeof dateValue.display === 'string') {
        return dateValue.display.split(',')[0].trim()
      }
      
      // Try to get the timestamp if it exists
      if (dateValue.timestamp) {
        const date = new Date(Number(dateValue.timestamp))
        if (!isNaN(date.getTime())) {
          return formatDateWithRelative(date)
        }
      }
      
      // If we have a toISOString method, use that
      if (typeof dateValue.toISOString === 'function') {
        const date = new Date(dateValue.toISOString())
        if (!isNaN(date.getTime())) {
          return formatDateWithRelative(date)
        }
      }
    }
    
    // Handle the case where dateValue is a string
    if (typeof dateValue === 'string') {
      // If it's already in the format DD.MM.YYYY, return it as is
      if (/^\d{1,2}\.\d{1,2}\.\d{4}$/.test(dateValue.trim())) {
        return dateValue.trim()
      }
      
      // Try to parse it as a date string
      const date = new Date(dateValue)
      if (!isNaN(date.getTime())) {
        return formatDateWithRelative(date)
      }
      
      // If it's in format 'DD.MM.YYYY, HH:mm', extract just the date part
      const dateMatch = dateValue.match(/^(\d{1,2}\.\d{1,2}\.\d{4})/)
      if (dateMatch && dateMatch[1]) {
        return dateMatch[1]
      }
      
      return dateValue.split(',')[0].trim()
    }
    
    // Last resort: try to convert to string and parse
    try {
      const str = String(dateValue)
      if (str !== '[object Object]') {
        const datePart = str.split(',')[0].trim()
        if (datePart) return datePart
      }
    } catch (e) {
      console.error('Error converting dateValue to string:', e)
    }
    
    // If we get here, we couldn't format the date
    return ''
  } catch (e) {
    console.error('Error in formatLastInvoice:', e)
    return ''
  }
}

// Helper function to format a date with relative text (heute, gestern, etc.)
const formatDateWithRelative = (date) => {
  try {
    if (!(date instanceof Date) || isNaN(date.getTime())) return ''
    
    const now = new Date()
    now.setHours(0, 0, 0, 0) // Reset time part for accurate day comparison
    
    // Create a date object with time set to 00:00:00 for comparison
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    
    const diffTime = Math.abs(now - dateOnly)
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    // Format the date in German format (DD.MM.YYYY)
    const formattedDate = dateOnly.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
    
    if (diffDays === 0) {
      return `heute (${formattedDate})`
    } else if (diffDays === 1) {
      return `gestern (${formattedDate})`
    } else if (diffDays < 7) {
      return `vor ${diffDays} Tagen (${formattedDate})`
    } else {
      return formattedDate
    }
  } catch (e) {
    console.error('Error in formatDateWithRelative:', e)
    return ''
  }
}

const props = defineProps({
  insurers: {
    type: Array,
    required: true,
    default: () => []
  },
  selectedInsurer: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['insurer-selected'])

const selectInsurer = (insurer) => {
  emit('insurer-selected', insurer)
}
</script>