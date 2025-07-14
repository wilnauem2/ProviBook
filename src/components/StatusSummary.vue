<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
    <div 
      v-for="(count, status) in statusCounts" 
      :key="status"
      class="flex items-center p-3 rounded-lg shadow transition-colors duration-150"
      :class="getStatusClass(status)"
    >
      <div class="flex-shrink-0 w-3 h-3 rounded-full mr-2 border"
        :class="getStatusColor(status)"></div>
      <div class="text-sm">
        <div class="font-medium">{{ count }}</div>
        <div class="text-xs text-gray-500">{{ getStatusText(status) }}</div>
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
    getStatusColor(status) {
      const colors = {
        on_time: 'bg-green-500',
        yellow: 'bg-yellow-500',
        red: 'bg-red-500',
        total: 'bg-blue-500',
        unknown: 'bg-gray-400'
      }
      return colors[status] || 'bg-gray-400'
    },
    getStatusBgColor(status) {
      const colors = {
        on_time: 'bg-green-50',
        yellow: 'bg-yellow-50',
        red: 'bg-red-50',
        total: 'bg-blue-50',
        unknown: 'bg-gray-50'
      }
      return colors[status] || 'bg-gray-50'
    },
    getStatusClass(status) {
      if (status === 'yellow') return 'bg-yellow-100 text-yellow-800 border border-yellow-300 font-semibold';
      if (status === 'red') return 'bg-red-100 text-red-800 border border-red-300 font-semibold';
      if (status === 'total') return 'bg-blue-100 text-blue-800 border border-blue-300 font-semibold';
      if (status === 'on_time') return 'bg-green-100 text-green-800 border border-green-300 font-semibold';
      if (status === 'unknown') return 'bg-gray-100 text-gray-800 border border-gray-300';
      return '';
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
