<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
    <div 
      v-for="(count, status) in statusCounts" 
      :key="status"
      class="relative overflow-hidden rounded-xl p-5 transition-all duration-200 hover:shadow-md"
      :class="getStatusCardClass(status)"
    >
      <!-- Decorative element -->
      <div class="absolute top-0 right-0 w-16 h-16 -mr-5 -mt-5 rounded-full opacity-20" 
           :class="getStatusColor(status, 'bg')"></div>
      
      <div class="relative z-10">
        <div class="flex items-center mb-2">
          <div class="flex-shrink-0 w-3 h-3 rounded-full mr-2" 
               :class="getStatusColor(status, 'bg')"></div>
          <span class="text-xs font-medium uppercase tracking-wider" 
                :class="getStatusTextColor(status)">
            {{ getStatusText(status) }}
          </span>
        </div>
        <div class="text-2xl font-bold" :class="getStatusTextColor(status, true)">
          {{ count }}
        </div>
        <div class="mt-1 text-xs opacity-75" :class="getStatusTextColor(status)">
          Versicherer
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatusSummary',
  props: {
    statusCounts: {
      type: Object,
      required: true,
      default: () => ({
        on_time: 0,
        warning: 0,
        critical: 0,
        unknown: 0
      })
    }
  },
  methods: {
    getStatusColor(status, type = 'text') {
      const colors = {
        on_time: {
          text: 'text-green-600',
          bg: 'bg-green-500',
          light: 'bg-green-50',
          dark: 'bg-green-600',
          border: 'border-green-200'
        },
        yellow: {
          text: 'text-yellow-600',
          bg: 'bg-yellow-500',
          light: 'bg-yellow-50',
          dark: 'bg-yellow-600',
          border: 'border-yellow-200'
        },
        red: {
          text: 'text-red-600',
          bg: 'bg-red-500',
          light: 'bg-red-50',
          dark: 'bg-red-600',
          border: 'border-red-200'
        },
        total: {
          text: 'text-blue-600',
          bg: 'bg-blue-500',
          light: 'bg-blue-50',
          dark: 'bg-blue-600',
          border: 'border-blue-200'
        },
        unknown: {
          text: 'text-gray-600',
          bg: 'bg-gray-400',
          light: 'bg-gray-50',
          dark: 'bg-gray-600',
          border: 'border-gray-200'
        }
      }
      const colorSet = colors[status] || colors.unknown
      return colorSet[type] || colorSet.text
    },
    getStatusCardClass(status) {
      const base = 'bg-white border shadow-sm hover:-translate-y-0.5';
      const statusClass = this.getStatusColor(status, 'light') + ' ' + this.getStatusColor(status, 'border');
      return `${base} ${statusClass}`;
    },
    getStatusTextColor(status, isBold = false) {
      const textColor = this.getStatusColor(status, 'text');
      return isBold ? `font-bold ${textColor}` : textColor;
    },
    getStatusText(status) {
      const texts = {
        on_time: 'Im Plan',
        yellow: 'Warnung',
        red: 'Kritisch',
        total: 'Gesamt',
        unknown: 'Unbekannt'
      }
      return texts[status] || status
    }
  }
}
</script>
