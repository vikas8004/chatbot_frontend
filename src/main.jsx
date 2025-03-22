import { Provider } from '@/components/ui/provider'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider as ReactReduxProvider } from 'react-redux'
import App from './App'
import { store } from './redux/store/store'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider>
      <ReactReduxProvider store={store}>
        <App />
      </ReactReduxProvider>
    </Provider>
  </React.StrictMode>
)
