import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

// El service worker intercepta las peticiones 
export const worker = setupWorker(...handlers)
