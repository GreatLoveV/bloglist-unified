import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import { Container } from '@mui/material'
import App from './App'
import { NotificationContextProvider } from './contexts/NotificationContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <NotificationContextProvider>
    <Container>
      <Router>
        <App />
      </Router>
    </Container>
  </NotificationContextProvider>,
)
