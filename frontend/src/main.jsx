import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { AssignmentProvider } from './context/AssignmentContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AssignmentProvider>
          <App />
        </AssignmentProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
