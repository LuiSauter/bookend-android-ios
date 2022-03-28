import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export const useAuth = () => {
  const { googleAuth, handleGoogleAuthentication, signInWithGoogle, signOut, loading } =
    useContext(AuthContext)

  return {
    googleAuth,
    handleGoogleAuthentication,
    signInWithGoogle,
    signOut,
    loading,
  }
}
