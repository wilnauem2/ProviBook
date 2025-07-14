<template>
  <div class="grid grid-cols-1 gap-3 w-full">
    <div 
      v-for="(count, status) in statusCounts" 
      :key="status"
      class="relative overflow-hidden rounded-xl p-4 transition-all duration-200 hover:shadow-md w-full cursor-pointer"
      :class="getStatusCardClass(status)"
      @click="incrementCounter(status)"
    >
      <div class="flex items-center">
        <div class="flex-shrink-0 w-4 h-4 rounded-full mr-3" 
             :class="getStatusColor(status, 'bg')"></div>
        <div class="flex-1">
          <div class="text-sm font-medium" :class="getStatusTextColor(status)">
            {{ getStatusText(status) }}
          </div>
          <div class="text-2xl font-bold leading-tight mt-1" :class="getStatusTextColor(status, true)">
            {{ count }}
          </div>
          <div v-if="clickCounts[status] > 0" class="text-xs mt-1" :class="getStatusTextColor(status)">
            Clicks: {{ clickCounts[status] }}
          </div>
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
  data() {
    return {
      clickCounts: {
        on_time: 0,
        yellow: 0,
        warning: 0,
        red: 0,
        critical: 0,
        total: 0,
        unknown: 0
      }
    };
  },
  emits: ['status-clicked'],
  
  methods: {
    incrementCounter(status) {
      // Increment the click counter for this status
      this.clickCounts[status]++;
      
      // Emit an event that can be captured by parent components
      this.$emit('status-clicked', { status, count: this.clickCounts[status] });
      
      // Log the click for debugging
      console.log(`${status} button clicked ${this.clickCounts[status]} times`);
    },
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
        warning: { // Added mapping for warning status
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
        critical: { // Added mapping for critical status
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
      const baseClass = 'bg-opacity-10 hover:bg-opacity-15 border';
      const hoverClass = 'hover:shadow-lg transform hover:-translate-y-1 transition-transform';
      const borderColors = {
        yellow: 'border-yellow-200',
        warning: 'border-yellow-200', // Added mapping for warning status
        red: 'border-red-200',
        critical: 'border-red-200', // Added mapping for critical status
        total: 'border-blue-200',
        on_time: 'border-green-200',
        unknown: 'border-gray-200'
      };
      return `${this.getStatusColor(status, 'bg')} ${baseClass} ${hoverClass} ${borderColors[status] || ''}`;
    },
    getStatusTextColor(status, isBold = false) {
      const textColor = this.getStatusColor(status, 'text');
      return isBold ? `font-bold ${textColor}` : textColor;
    },
    getStatusText(status) {
      const texts = {
        on_time: 'Im Plan',
        yellow: 'Warnung',
        warning: 'Warnung', // Added mapping for warning status
        red: 'Kritisch',
        critical: 'Kritisch', // Added mapping for critical status
        total: 'Gesamt',
        unknown: 'Unbekannt'
      }
      return texts[status] || status
    }
  }
}
</script>
