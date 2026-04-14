import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import { Container } from '@mui/material'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Container>
    <Router>
      <App />
    </Router>
  </Container>,
)
