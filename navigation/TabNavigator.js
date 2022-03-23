import React, { useEffect } from 'react'
import { StyleSheet, Pressable, View, Image } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { IconButton, TouchableRipple, useTheme } from 'react-native-paper'
import { useLazyQuery } from '@apollo/client'

import userDefault from '../assets/img/default-user.png'
import { useAuth } from '../hooks/useAuth'
import { FIND_USER } from '../user/graphql-queries'
import BookScreen from '../screens/BookScreen'
import SearchScreen from '../screens/SearchScreen'
import HomeScreen from '../screens/HomeScreen'
import { useToggle } from '../hooks/useToggle'

const Tab = createBottomTabNavigator()

const TabNavigator = () => {
  const { colors } = useTheme()
  const { googleAuth } = useAuth()
  const [getUser, { data }] = useLazyQuery(FIND_USER)
  const { showModal, toggleModal } = useToggle()

  useEffect(() => {
    let cleanup = true
    if (cleanup) {
      googleAuth.status === 'authenticated' && getUser({ variables: { email: googleAuth.email } })
    }
    return () => {
      cleanup = false
    }
  }, [getUser, googleAuth.email, googleAuth.status])

  return (
    <>
      <Tab.Navigator
        screenOptions={({ navigation }) => ({
          tabBarActiveTintColor: colors.text,
          tabBarInactiveTintColor: colors.text,
          tabBarStyle: {
            backgroundColor: colors.primary,
            borderColor: `${colors.border}22`,
            borderTopWidth: 1,
          },
          headerShown: true,
          tabBarShowLabel: false,
          headerStyle: {
            backgroundColor: colors.primary,
            borderColor: `${colors.border}22`,
            borderBottomWidth: 1,
          },
          headerTitleStyle: { color: colors.text },
          headerTintColor: colors.text,
          tabBarButton: props => (
            <Pressable
              {...props}
              android_ripple={{
                color: colors.colorUnderlay,
                borderless: true,
                radius: 80,
              }}
              style={({ pressed }) => [
                { backgroundColor: pressed ? 'transparent' : 'transparent', flex: 1 },
              ]}
            />
          ),
          headerLeft: () => (
            <View style={{ marginLeft: 4 }}>
              <IconButton
                icon='md-settings-outline'
                color={colors.text}
                borderless={true}
                size={24}
                rippleColor={colors.border}
                style={{ paddingTop: 1 }}
                onPress={() => navigation.navigate('SettingScreen')}
              />
            </View>
          ),
          headerRight: () => (
            <TouchableRipple
              rippleColor={colors.colorUnderlay}
              style={styles.logoContainer}
              borderless={true}
              onPress={toggleModal}
            >
              {googleAuth.status === 'unauthenticated' ? (
                <Image
                  style={[styles.bookendLogo, { backgroundColor: colors.textWhite }]}
                  source={userDefault}
                />
              ) : (
                <Image
                  style={styles.bookendLogo}
                  source={{ uri: data?.findUser ? data?.findUser.me.photo : googleAuth.image }}
                />
              )}
            </TouchableRipple>
          ),
        })}
        activeColor={colors.colorThirdBlue}
        tabBarActiveTintColor={colors.colorThirdBlue}
        tabBarInactiveTintColor={colors.text}
        barStyle={{ backgroundColor: colors.primary }}
      >
        <Tab.Screen
          name='HomeScreen'
          // component={HomeScreen}
          options={() => ({
            title: 'Inicio',
            tabBarIcon: ({ color, focused }) => (
              <IconButton icon={focused ? 'ios-home' : 'home-outline'} color={color} size={22} />
            ),
          })}
        >
          {props => <HomeScreen {...props} handleModal={toggleModal} showModal={showModal} />}
        </Tab.Screen>
        <Tab.Screen
          name='BookScreen'
          component={BookScreen}
          options={{
            title: 'Books',
            tabBarIcon: ({ color, focused }) => (
              <IconButton icon={focused ? 'book' : 'book-outline'} color={color} size={20} />
            ),
          }}
        />
        <Tab.Screen
          name='SearchScreen'
          component={SearchScreen}
          options={{
            title: 'Search',
            // headerTitle: () => (
            //   <Search onChangeText={handleChangeWord} value={word} placeholder='buscar en bookend' />
            // ),
            headerTitleAlign: 'center',
            tabBarIcon: ({ color, focused }) => (
              <IconButton icon={focused ? 'search' : 'search-outline'} color={color} size={20} />
            ),
          }}
        />
      </Tab.Navigator>
    </>
  )
}

export default TabNavigator

const styles = StyleSheet.create({
  bookendLogo: {
    width: 33,
    height: 33,
    borderRadius: 50,
  },
  logoContainer: {
    borderRadius: 50,
    marginRight: 20,
  },
  button: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textLabel: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
})
