# Stop any running npm processes
get-process | Where-Object { $_.ProcessName -eq 'node' } | Stop-Process -Force

# Remove node_modules and package-lock.json
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue node_modules
Remove-Item -Force -ErrorAction SilentlyContinue package-lock.json
Remove-Item -Force -ErrorAction SilentlyContinue pnpm-lock.yaml
Remove-Item -Force -ErrorAction SilentlyContinue yarn.lock

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
npm install

# Install Vite and related dependencies
npm install --save-dev vite @vitejs/plugin-vue

# Install core-js explicitly
npm install core-js@3

# Install the PDF libraries
npm install jspdf@2.5.1 jspdf-autotable@3.8.2
