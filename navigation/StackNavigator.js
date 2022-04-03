import React from 'react'
import { useTheme } from 'react-native-paper'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import TabNavigator from '../navigation/TabNavigator'
import SettingScreen from '../screens/setting/SettingScreen'
import DetailScreen from '../screens/DetailScreen'
import UserScreen from '../screens/UserScreen'
import NameUser from '../components/NameUser'
import DisplayScreen from '../screens/setting/DisplayScreen'
import PdfScreen from '../screens/PdfScreen'
import UpdateScreen from '../screens/UpdateScreen'
import YourAccountScreen from '../screens/setting/YourAccountScreen'

const Stack = createNativeStackNavigator()

const StackNavigator = () => {
  const { colors } = useTheme()

  return (
    <Stack.Navigator>
      <Stack.Screen
        name='TabNavigator'
        component={TabNavigator}
        options={{ headerShown: false, title: 'Inicio' }}
      />
      <Stack.Screen
        name='UpdateScreen'
        component={UpdateScreen}
        options={{
          title: 'Actualizar perfil',
          headerStyle: { backgroundColor: colors.primary },
          headerTitleStyle: { color: colors.text },
          headerTintColor: colors.text,
        }}
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
        name='DisplayScreen'
        component={DisplayScreen}
        options={() => ({
          title: 'Pantalla y idiomas',
          headerStyle: { backgroundColor: colors.primary },
          headerTitleStyle: { color: colors.text },
          headerTintColor: colors.text,
        })}
      />
      <Stack.Screen
        name='YourAccountScreen'
        component={YourAccountScreen}
        options={() => ({
          title: 'Tu cuenta',
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
      <Stack.Screen
        name='PdfScreen'
        component={PdfScreen}
        options={() => ({
          title: '',
          headerTitleStyle: { color: colors.text },
          headerTintColor: colors.textGray,
          headerShown: true,
          headerTransparent: true,
        })}
      />
    </Stack.Navigator>
  )
}

export default StackNavigator
