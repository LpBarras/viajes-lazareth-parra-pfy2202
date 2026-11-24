import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// En desarrollo usamos la raíz local y al compilar usamos la carpeta de GitHub Pages.
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'serve' ? '/' : '/viajes-lazareth-parra-pfy2202/',
}))
