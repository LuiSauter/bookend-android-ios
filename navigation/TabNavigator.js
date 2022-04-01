import React, { useEffect, useState } from 'react'
import { StyleSheet, Pressable, View, Image, Text, TouchableOpacity } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { IconButton, TouchableRipple, useTheme } from 'react-native-paper'
import { useLazyQuery } from '@apollo/client'

import userDefault from '../assets/img/default-user.png'
import { useAuth } from '../hooks/useAuth'
import { FIND_USER } from '../user/graphql-queries'
import BookScreen from '../screens/BookScreen'
import SearchScreen from '../screens/SearchScreen'
import HomeScreen from '../screens/HomeScreen'
import Search from '../components/Search/Search'
import { useToggle } from '../hooks/useToggle'

const INITIAL_STATE = { home: false, books: false }

const Tab = createBottomTabNavigator()

const TabNavigator = () => {
  const { colors } = useTheme()
  const { handleChangeWord, word, toggleModal } = useToggle()
  const { googleAuth, handleGoogleAuthentication } = useAuth()
  const [getUser, { data }] = useLazyQuery(FIND_USER)
  const [scrollTop, setScrollTop] = useState(INITIAL_STATE)
  const { status, email, name, image, user } = googleAuth

  useEffect(() => {
    let cleanup = true
    if (cleanup) {
      status === 'authenticated' && getUser({ variables: { email: email } })
    }
    return () => {
      cleanup = false
    }
  }, [getUser, email, status])

  useEffect(() => {
    let cleanup = true
    if (cleanup) {
      status === 'authenticated' &&
        data?.findUser &&
        handleGoogleAuthentication({
          email: email,
          name: data?.findUser ? data?.findUser.me.name : name,
          image: data?.findUser ? data?.findUser.me.photo : image,
          status: status,
          user: data?.findUser ? data?.findUser.me.user : user,
        })
    }
    return () => {
      cleanup = false
    }
  }, [data?.findUser, email, handleGoogleAuthentication, image, name, status, user])

  const scrollToTopHome = () => setScrollTop(prev => ({ ...prev, home: !prev.home }))
  const scrollToTopBooks = () => setScrollTop(prev => ({ ...prev, books: !prev.books }))

  return (
    <Tab.Navigator
      screenOptions={({ navigation }) => ({
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.text,
        tabBarStyle: {
          backgroundColor: colors.primary,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        },
        headerShown: true,
        tabBarShowLabel: false,
        headerStyle: {
          backgroundColor: colors.primary,
          borderBottomColor: colors.border,
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
        headerRight: props => (
          <TouchableRipple
            rippleColor={colors.colorUnderlay}
            style={styles.logoContainer}
            borderless={true}
            onPress={() => toggleModal()}
            {...props}
          >
            {status === 'unauthenticated' ? (
              <Image
                style={[styles.bookendLogo, { backgroundColor: colors.textWhite }]}
                source={userDefault}
              />
            ) : (
              <Image
                style={styles.bookendLogo}
                source={{ uri: data?.findUser ? data?.findUser.me.photo : image }}
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
        options={() => ({
          title: 'Inicio',
          headerTitle: ({ tintColor }) => (
            <TouchableOpacity activeOpacity={0.9} onPress={scrollToTopHome}>
              <Text style={{ fontSize: 20, color: tintColor }}>Inicio</Text>
            </TouchableOpacity>
          ),
          tabBarIcon: ({ color, focused }) => (
            <IconButton icon={focused ? 'ios-home' : 'home-outline'} color={color} />
          ),
        })}
      >
        {props => (
          <HomeScreen {...props} scrollTop={scrollTop.home} scrollToTop={scrollToTopHome} />
        )}
      </Tab.Screen>
      <Tab.Screen
        name='BookScreen'
        options={{
          title: 'Books',
          headerTitle: ({ tintColor }) => (
            <TouchableOpacity activeOpacity={0.9} onPress={scrollToTopBooks}>
              <Text style={{ fontSize: 20, color: tintColor }}>Books</Text>
            </TouchableOpacity>
          ),
          tabBarIcon: ({ color, focused }) => (
            <IconButton icon={focused ? 'book' : 'book-outline'} color={color} />
          ),
        }}
      >
        {props => (
          <BookScreen {...props} scrollTop={scrollTop.books} scrollToTop={scrollToTopBooks} />
        )}
      </Tab.Screen>
      <Tab.Screen
        name='SearchScreen'
        component={SearchScreen}
        options={{
          title: 'Search',
          headerTitle: () => (
            <Search onChangeText={handleChangeWord} value={word} placeholder='buscar en bookend' />
          ),
          headerTitleAlign: 'center',
          tabBarIcon: ({ color, focused }) => (
            <IconButton icon={focused ? 'search' : 'search-outline'} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
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
})
