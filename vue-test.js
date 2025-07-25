// Simple test script to check Vue exports
import * as Vue from 'vue';

console.log('Vue version:', Vue.version);
console.log('Available exports:', Object.keys(Vue));

// Try to access the computed function
if (Vue.computed) {
  console.log('computed is available');
} else {
  console.log('computed is NOT available');
}
