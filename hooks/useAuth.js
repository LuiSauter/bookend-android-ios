// import { useContext } from 'react'
// import { AuthContext } from '../context/authContext'

export const INITIAL_STATE = {
  email: '',
  name: '',
  image: '',
  status: 'unauthenticated',
  token: '',
}

export const useAuth = () => {
  // const { googleAuth, handleGoogleAuthentication } = useContext(AuthContext)
  const handleGoogleAuthentication = () => console.log('xd')
  return { googleAuth: INITIAL_STATE, handleGoogleAuthentication }
}
