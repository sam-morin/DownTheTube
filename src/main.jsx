import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import { MantineProvider } from '@mantine/core'

TimeAgo.addDefaultLocale(en)

createRoot(document.getElementById('root')).render(
  <MantineProvider>
    <App />
  </MantineProvider>,
)
