import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import Welcome from './pages/Welcome'
import './index.css'
import { createHashRouter, RouterProvider } from 'react-router-dom'

const router = createHashRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: '/welcome',
    element: <Welcome />
  }
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
