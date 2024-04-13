import ReactDOM from 'react-dom/client'
import { App } from './App'
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'

// import { StrictMode } from 'react'


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <BrowserRouter>
    {/* <StrictMode> */}
      <App />
    {/* </StrictMode> */}
    </BrowserRouter>
 
)
