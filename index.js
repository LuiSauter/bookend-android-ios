import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { AppRegistry, Appearance, LogBox } from 'react-native'
import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native'
import {
  DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme,
  Provider as PaperProvider,
} from 'react-native-paper'

import { SafeAreaProvider } from 'react-native-safe-area-context'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import AsyncStorage from '@react-native-async-storage/async-storage'

import App from './App'
import { name as appName } from './app.json'
import { ToggleContext } from './context/ToggleContext'
import { colors, colorsLight } from './config/colors'
import { AuthProvider } from './context/AuthContext'
import { storageTheme } from './config/contants'
LogBox.ignoreLogs(['EventEmitter.removeListener'])

const light = {
  ...PaperDefaultTheme,
  ...NavigationDefaultTheme,
  colors: {
    ...PaperDefaultTheme.colors,
    ...NavigationDefaultTheme.colors,
    background: colorsLight.colorPrimary,
    primary: colorsLight.colorPrimary,
    secondary: colorsLight.colorSecondary,
    textGray: colorsLight.TextGray,
    colorThirdBlue: colorsLight.colorThirdBlue,
    colorThirdPurple: colorsLight.colorThirdPurple,
    colorThirdYellow: colorsLight.colorThirdYellow,
    colorUnderlay: colorsLight.colorUnderlay,
    colorFourthRed: colorsLight.colorFourthRed,
    colorLikeRed: colorsLight.colorLikeRed,
    white: '#fff',
    text: colorsLight.text,
    border: colorsLight.border,
  },
}
const dark = {
  ...PaperDarkTheme,
  ...NavigationDarkTheme,
  colors: {
    ...PaperDarkTheme.colors,
    ...NavigationDarkTheme.colors,
    background: colors.colorPrimary,
    primary: colors.colorPrimary,
    secondary: colors.colorSecondary,
    textGray: colors.TextGray,
    colorThirdBlue: colors.colorThirdBlue,
    colorThirdPurple: colors.colorThirdPurple,
    colorThirdYellow: colors.colorThirdYellow,
    colorFourthRed: colors.colorFourthRed,
    colorUnderlay: colors.colorUnderlay,
    colorLikeRed: colors.colorLikeRed,
    white: '#fff',
    text: colors.textWhite,
    border: colors.border,
  },
}

const cache = new InMemoryCache({
  typePolicies: {
    Profile: {
      fields: {
        me: {
          merge(existing, incoming, { mergeObjects }) {
            return mergeObjects(existing, incoming)
          },
        },
      },
    },
  },
})

const client = new ApolloClient({
  uri: 'https://bookendd.vercel.app/api/graphql',
  cache,
})

const storageDark = async () => {
  try {
    return await AsyncStorage.setItem(storageTheme, 'dark')
  } catch (error) {
    console.error(error, 'Luis parece que hubo un error, storageDark')
  }
}

const storageLight = async () => {
  try {
    return await AsyncStorage.setItem(storageTheme, 'light')
  } catch (error) {
    console.error(error, 'Luis parece que hubo un error, storageLight')
  }
}

const getThemeStorage = async () => {
  try {
    const value = await AsyncStorage.getItem(storageTheme)
    return value === null ? 'dark' : value
  } catch (error) {
    console.error(error)
  }
}

export default function Main() {
  const colorScheme = Appearance.getColorScheme()
  const [isThemeDark, setIsThemeDark] = useState(colorScheme === 'dark')

  const [showModal, setShow] = useState(false)
  const [word, setWord] = useState('')

  useEffect(() => {
    let cleanup = true
    if (cleanup) {
      getThemeStorage().then(res => setIsThemeDark(res === 'dark'))
    }
    return () => {
      cleanup = false
    }
  }, [])

  useEffect(() => {
    let cleanup = true
    if (cleanup) {
      isThemeDark ? storageDark() : storageLight()
    }
    return () => {
      cleanup = false
    }
  }, [isThemeDark])

  const toggleTheme = useCallback(async () => setIsThemeDark(!isThemeDark), [isThemeDark])
  const toggleModal = useCallback(() => setShow(!showModal), [showModal])
  const handleChangeWord = useCallback(text => setWord(text), [])

  const preferences = useMemo(() => {
    return { toggleTheme, isThemeDark, toggleModal, showModal, handleChangeWord, word }
  }, [toggleTheme, isThemeDark, toggleModal, showModal, handleChangeWord, word])

  return (
    <ApolloProvider client={client}>
      <ToggleContext.Provider value={preferences}>
        <PaperProvider
          theme={isThemeDark ? dark : light}
          settings={{ icon: props => <Ionicons {...props} /> }}
        >
          <SafeAreaProvider>
            <AuthProvider>
              <NavigationContainer theme={isThemeDark ? dark : light}>
                <App />
              </NavigationContainer>
            </AuthProvider>
          </SafeAreaProvider>
        </PaperProvider>
      </ToggleContext.Provider>
    </ApolloProvider>
  )
}

AppRegistry.registerComponent(appName, () => Main)
