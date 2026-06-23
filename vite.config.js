import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // 🔥 Set base path to your exact GitHub repository name wrapped in slashes
  base: 'https://github.com/kelpfen/my-portfolio', 
  plugins: [react()],
  server: {
    proxy: {
      '/api-football': {
        target: 'https://api.football-data.org/v4',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-football/, ''),
      },
    },
  },
})