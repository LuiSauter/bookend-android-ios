import React, { createContext, useEffect, useState, useCallback, useMemo } from 'react'
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin'
import auth from '@react-native-firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { storageAuth } from '../config/contants'
import { useMutation } from '@apollo/client'
import { LOGINQL } from '../login/graphql-mutations'
import { ALL_USERS } from '../user/graphql-queries'

export const INITIAL_STATE = {
  email: '',
  name: '',
  image: '',
  status: 'unauthenticated',
  user: '',
}

export const AuthContext = createContext({})

let authObjectStorage
const getAuthData = async () => {
  const jsonValue = await AsyncStorage.getItem(storageAuth)
  return jsonValue === null ? INITIAL_STATE : JSON.parse(jsonValue)
}
getAuthData().then(res => (authObjectStorage = res))

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(false)
  const [googleAuth, setGoogleAuth] = useState(authObjectStorage)
  const [getLogin, { data }] = useMutation(LOGINQL, {
    refetchQueries: [{ query: ALL_USERS }],
  })

  const handleGoogleAuthentication = useCallback(async ({ email, name, image, status, user }) => {
    const newAuthGoogle = { email, name, image, status, user }
    const jsonValue = JSON.stringify(newAuthGoogle)
    setGoogleAuth(newAuthGoogle)
    await AsyncStorage.setItem(storageAuth, jsonValue)
  }, [])

  const onAuthStateChanged = useCallback(
    getUser => {
      if (getUser) {
        getLogin({
          variables: {
            email: getUser?.email,
            name: getUser?.displayName,
            image: getUser?.photoURL,
          },
        })
        handleGoogleAuthentication({
          email: getUser?.email,
          name: getUser?.displayName,
          image: getUser?.photoURL,
          status: 'authenticated',
          user: '',
        })
      } else {
        handleGoogleAuthentication(INITIAL_STATE)
      }
    },
    [getLogin, handleGoogleAuthentication],
  )

  useEffect(() => {
    let cleanup = true
    if (cleanup) {
      auth().onAuthStateChanged(onAuthStateChanged)
    }
    return () => {
      cleanup = false
    }
  }, [onAuthStateChanged])

  useEffect(() => {
    let cleanup = true
    if (cleanup) {
      googleAuth.user !== '' &&
        getLogin({
          variables: {
            email: googleAuth.email,
            name: googleAuth.name,
            image: googleAuth.image,
          },
        })
    }
    return () => {
      cleanup = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getLogin, googleAuth.user])

  GoogleSignin.configure({
    webClientId: '452390249090-gcagg4eluj9v421ld7p3n2kth026c561.apps.googleusercontent.com',
    scopes: [
      'https://www.googleapis.com/auth/user.gender.read',
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/user.addresses.read',
    ],
  })

  const signInWithGoogle = useCallback(async () => {
    try {
      setLoading(true)
      await GoogleSignin.hasPlayServices()
      const { idToken } = await GoogleSignin.signIn()
      const googleCredential = auth.GoogleAuthProvider.credential(idToken)
      // const currentUser = await GoogleSignin.getCurrentUser()
      return auth().signInWithCredential(googleCredential)
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        console.log(error, error.code, ' Luis, user cancelled the login flow')
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
        console.error(error, error.code, ' Luis, operation (e.g. sign in) is in progress already')
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        console.error(error, error.code, ' Luis, play services not available or outdated')
      } else {
        // some other error happened
        console.error(error + ' Luis parece que hubo un error. (some other error happened)')
      }
    } finally {
      setLoading(false)
    }
  }, [])

  const signOut = useCallback(async () => {
    try {
      setLoading(true)
      await GoogleSignin.signOut()
      await auth().signOut()
      handleGoogleAuthentication(INITIAL_STATE)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [handleGoogleAuthentication])

  const memoedValue = useMemo(() => {
    return {
      googleAuth,
      handleGoogleAuthentication,
      signInWithGoogle,
      signOut,
      loading,
      message: data?.signin ? data?.signin.message : null,
    }
  }, [googleAuth, handleGoogleAuthentication, signInWithGoogle, signOut, loading, data?.signin])

  return <AuthContext.Provider value={memoedValue}>{children}</AuthContext.Provider>
}
