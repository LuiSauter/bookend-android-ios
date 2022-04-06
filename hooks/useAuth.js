import { useNavigation } from '@react-navigation/native'
import { useContext, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'

export const useAuth = () => {
  const { googleAuth, handleGoogleAuthentication, signInWithGoogle, signOut, loading, message } =
    useContext(AuthContext)

  const navigation = useNavigation()

  useEffect(() => {
    let monted = true
    if (monted) {
      message === 'signup' && navigation.navigate('UpdateScreen')
    }
    return () => {
      monted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message])

  return {
    googleAuth,
    handleGoogleAuthentication,
    signInWithGoogle,
    signOut,
    loading,
    message,
  }
}
