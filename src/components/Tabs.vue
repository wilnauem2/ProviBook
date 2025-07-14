<template>
  <div class="tabs-container">
    <nav class="flex space-x-4 border-b border-gray-200">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="switchTab(tab.id)"
        :class="[
          'px-4 py-2 text-sm font-medium rounded-t-lg',
          activeTab === tab.id
            ? 'bg-white text-blue-600 border-t border-l border-r border-gray-200 -mb-px'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
        ]"
      >
        {{ tab.label }}
      </button>
    </nav>
  </div>
</template>

<script setup>
defineProps({
  activeTab: {
    type: String,
    required: true
  },
  tabs: {
    type: Array,
    default: () => [
      { id: 'main', label: 'Übersicht' },
      { id: 'settings', label: 'Einstellungen' }
    ]
  }
});

const emit = defineEmits(['update:activeTab']);

const switchTab = (tabId) => {
  console.log('Tab component: switching to', tabId);
  emit('update:activeTab', tabId);
};
</script>

<style scoped>
.tabs-container {
  margin-bottom: 1rem;
}
</style>
