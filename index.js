/**
 * @format
 */

import { AppRegistry, Appearance, LogBox } from 'react-native'
import React, { useState, useCallback, useMemo } from 'react'
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
// import 'react-native-gesture-handler'

import App from './App'
import { name as appName } from './app.json'
import { DarkContext } from './context/DarkContext'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { colors, colorsLight } from './config/colors'
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import Ionicons from 'react-native-vector-icons/Ionicons'
LogBox.ignoreLogs(['EventEmitter.removeListener'])
// import { ToggleStateProvider } from './context/ToggleContext'

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
    border: colors.border,
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

export default function Main() {
  const colorScheme = Appearance.getColorScheme()
  const [isThemeDark, setIsThemeDark] = useState(colorScheme === 'dark')

  const toggleTheme = useCallback(() => setIsThemeDark(!isThemeDark), [isThemeDark])

  const preferences = useMemo(() => ({ toggleTheme, isThemeDark }), [toggleTheme, isThemeDark])

  return (
    <ApolloProvider client={client}>
      <DarkContext.Provider value={preferences}>
        <PaperProvider
          theme={isThemeDark ? dark : light}
          settings={{ icon: props => <Ionicons {...props} /> }}
        >
          {/* <ToggleStateProvider> */}
          <SafeAreaProvider>
            <NavigationContainer theme={isThemeDark ? dark : light}>
              <App />
            </NavigationContainer>
          </SafeAreaProvider>
          {/* </ToggleStateProvider> */}
        </PaperProvider>
      </DarkContext.Provider>
    </ApolloProvider>
  )
}

AppRegistry.registerComponent(appName, () => Main)
