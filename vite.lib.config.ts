import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import dts from 'vite-plugin-dts'

const name = process.env.npm_lifecycle_event?.split(':')[1] || ''
const external = {
  utils: [],
  hooks: [/.*\/utils/],
  router: [/.*\/utils/, /.*\/hooks/],
  components: ['dayjs', /.*\/utils/, /.*\/hooks/]
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    dts({
      include: `lib/${name}`,
      entryRoot: `lib/${name}`,
      rollupTypes: true,
      beforeWriteFile: (filePath, content) => {
        let newContent = content
        let match = content.match(/import { default as (default_\d+) } from 'react'/)
        if (match) {
          newContent = newContent.replace(new RegExp(match[1], 'g'), 'React')
        }
        match = newContent.match(/import { default as (default_\d+) } from 'dayjs'/)
        if (match) {
          newContent = newContent.replace(new RegExp(match[1], 'g'), 'dayjs')
        }
        return { filePath, content: newContent }
      }
    })
  ],
  build: {
    lib: {
      entry: `lib/${name}`,
      fileName: 'index',
      cssFileName: 'styles',
      formats: ['es']
    },
    outDir: `dist/lib/${name}`,
    copyPublicDir: false,
    rollupOptions: {
      external: [/react\/?.*/, /react-dom\/?.*/, ...external[name]]
    }
  }
})
