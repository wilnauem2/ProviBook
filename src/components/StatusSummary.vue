<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
    <div 
      v-for="(count, status) in statusCounts" 
      :key="status"
      class="flex items-center p-3 bg-white rounded-lg shadow"
      :class="getStatusBgColor(status)"
    >
      <div class="flex-shrink-0 w-3 h-3 rounded-full mr-2" :class="getStatusColor(status)"></div>
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
        warning: 'bg-yellow-500',
        critical: 'bg-red-500',
        unknown: 'bg-gray-400'
      }
      return colors[status] || 'bg-gray-400'
    },
    getStatusBgColor(status) {
      const colors = {
        on_time: 'bg-green-50',
        warning: 'bg-yellow-50',
        critical: 'bg-red-50',
        unknown: 'bg-gray-50'
      }
      return colors[status] || 'bg-gray-50'
    },
    getStatusText(status) {
      const texts = {
        on_time: 'Im Plan',
        warning: 'Warnung',
        critical: 'Kritisch',
        unknown: 'Unbekannt'
      }
      return texts[status] || status
    }
  }
}
</script>
