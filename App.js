import React from 'react'
import { View, Text } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { IconButton, TouchableRipple, useTheme } from 'react-native-paper'
import TabNavigator from './navigation/TabNavigator'
import SettingScreen from './screens/setting/SettingScreen'

const Stack = createNativeStackNavigator()

const App = () => {
  const { colors } = useTheme()
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='TabNavigator'
        component={TabNavigator}
        options={{ headerShown: false, title: 'Inicio' }}
      />
      <Stack.Screen
        name='SettingScreen'
        component={SettingScreen}
        options={() => ({
          title: 'Ajustes',
          headerStyle: { backgroundColor: colors.primary },
          headerTitleStyle: { color: colors.text },
          headerTintColor: colors.text,
        })}
      />
    </Stack.Navigator>
  )
}

export default App
