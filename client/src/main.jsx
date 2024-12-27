import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store/store.js'
import { Toaster } from './components/ui/toaster.jsx'
import { ThemeProvider } from './components/ThemeProvider.jsx'


createRoot(document.getElementById('root')).render(
  <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
    <BrowserRouter>
      <Provider store={store} >
        <App />
        <Toaster />
      </Provider>
    </BrowserRouter>,
  </ThemeProvider>
)
