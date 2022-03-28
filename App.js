import React from 'react'
import { AuthProvider } from './context/AuthContext'
import StackNavigator from './navigation/StackNavigator'

const App = () => {
  return (
    <AuthProvider>
      <StackNavigator />
    </AuthProvider>
  )
}

export default App
