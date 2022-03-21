import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useTheme } from 'react-native-paper'
import TabNavigator from './navigation/TabNavigator'
import SettingScreen from './screens/setting/SettingScreen'
import DetailScreen from './screens/DetailScreen'
import UserScreen from './screens/UserScreen'
import NameUser from './components/NameUser'

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
      <Stack.Screen
        name='DetailScreen'
        component={DetailScreen}
        options={() => ({
          title: 'Book',
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTitleStyle: { color: colors.text },
          headerTintColor: colors.text,
        })}
      />
      <Stack.Screen
        name='UserScreen'
        component={UserScreen}
        options={({ route }) => ({
          title: '',
          headerStyle: { backgroundColor: `rgb(${route.params.dominantColor})` },
          headerTintColor: 'white',
          headerTitle: props => (
            <NameUser
              {...props}
              name={route.params.name}
              verified={false}
              fontSize={17}
              color='white'
            />
          ),
        })}
      />
    </Stack.Navigator>
  )
}

export default App
