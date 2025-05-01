import React from "react"
import ReactDOM from "react-dom/client"
import AppRoutes from './routes.jsx'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from "@react-oauth/google"


const root = ReactDOM.createRoot(document.getElementById('root'))

const CLIENT_ID = "54198896210-kbmqsi8sfq65ebn8bc1krjsjaam4bi3k.apps.googleusercontent.com"

root.render(
 <React.StrictMode>
  <GoogleOAuthProvider clientId={CLIENT_ID}>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </GoogleOAuthProvider>
 </React.StrictMode>
)
