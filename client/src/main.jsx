import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import { Container } from '@mui/material'
import App from './App'
import { NotificationContextProvider } from './contexts/NotificationContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <NotificationContextProvider>
      <Container>
        <Router>
          <App />
        </Router>
      </Container>
    </NotificationContextProvider>
  </QueryClientProvider>,
)
