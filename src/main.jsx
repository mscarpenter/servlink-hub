import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { GlobalContentProvider } from './contexts/GlobalContentContext.jsx'
import { LanguageProvider } from './contexts/LanguageContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <GlobalContentProvider>
        <App />
      </GlobalContentProvider>
    </LanguageProvider>
  </React.StrictMode>,
)
