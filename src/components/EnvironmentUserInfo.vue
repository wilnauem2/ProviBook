<template>
  <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
    <div class="flex items-center space-x-2">
      <span class="text-sm font-medium text-gray-700">Umgebung:</span>
      <div class="inline-flex rounded-md shadow-sm" role="group">
        <button
          v-for="env in environments"
          :key="env.id"
          @click="$emit('update:currentEnvironment', env.id)"
          :class="[
            'px-3 py-1 text-sm font-medium',
            currentEnvironment === env.id
              ? 'bg-blue-100 text-blue-700 border border-blue-300'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
            env.id === 'production' ? 'rounded-l-md' : '',
            env.id === 'test' ? 'border-l-0' : '',
            env.id === 'development' ? 'rounded-r-md border-l-0' : ''
          ]"
        >
          {{ env.label }}
        </button>
      </div>
    </div>
    
    <div class="flex items-center space-x-4">
      <span class="text-sm text-gray-600">
        Eingeloggt als: <span class="font-medium">{{ username }}</span>
      </span>
      <button
        @click="$emit('logout')"
        class="text-sm text-red-600 hover:text-red-800"
      >
        Ausloggen
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EnvironmentUserInfo',
  props: {
    currentEnvironment: {
      type: String,
      required: true,
      validator: (value) => ['production', 'test', 'development'].includes(value)
    },
    username: {
      type: String,
      required: true
    }
  },
  emits: ['update:currentEnvironment', 'logout'],
  data() {
    return {
      environments: [
        { id: 'production', label: 'Produktion' },
        { id: 'test', label: 'Test' },
        { id: 'development', label: 'Entwicklung' }
      ]
    }
  }
}
</script>
