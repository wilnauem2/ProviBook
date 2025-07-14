<template>
  <div class="relative">
    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
      <svg class="h-5 w-5 text-gray-400 transition-colors duration-200" 
           xmlns="http://www.w3.org/2000/svg" 
           viewBox="0 0 20 20" 
           fill="currentColor" 
           :class="{ 'text-blue-500': isFocused }"
           aria-hidden="true">
        <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
      </svg>
    </div>
    <input
      type="text"
      class="block w-full pl-12 pr-10 py-3 rounded-xl border-0 bg-white shadow-sm ring-1 ring-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 text-gray-900 sm:text-sm"
      :class="{ 'ring-blue-500 ring-2': isFocused }"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      @focus="isFocused = true"
      @blur="isFocused = false"
      placeholder="Versicherer suchen..."
      aria-label="Versicherer suchen"
    />
    <transition
      enter-active-class="transition-opacity duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <button
        v-if="modelValue"
        @click="clearSearch"
        class="absolute inset-y-0 right-0 pr-4 flex items-center focus:outline-none"
        aria-label="Suche zurücksetzen"
      >
        <div class="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200">
          <svg class="h-4 w-4 text-gray-500" 
               xmlns="http://www.w3.org/2000/svg" 
               viewBox="0 0 20 20" 
               fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
      </button>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'SearchBar',
  data() {
    return {
      isFocused: false
    };
  },
  props: {
    modelValue: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue'],
  methods: {
    clearSearch() {
      this.$emit('update:modelValue', '');
      // Focus the input after clearing
      this.$nextTick(() => {
        this.$el.querySelector('input').focus();
      });
    }
  }
}
</script>

<style scoped>
.search-container {
  margin-bottom: 1rem;
}
</style>
