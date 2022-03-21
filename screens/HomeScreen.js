import React, { useState } from 'react'
import { StyleSheet, StatusBar, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { IconButton, Modal, Portal, TouchableRipple, useTheme } from 'react-native-paper'
import AllPost from '../components/Post/AllPost'
// import { useToggle } from '../hooks/useToggle'

const HomeScreen = () => {
  const { dark, colors } = useTheme()
  const [isAuth, setAuth] = useState(false)
  // const { googleAuth } = useAuth()
  // const { status, name } = googleAuth
  // const { showModal, handleModal } = useToggle()
  // const { promptAsync, request, signOut } = Auth()

  const containerStyle = { backgroundColor: colors.primary, padding: 30 }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.primary }]}
      edges={['top', 'left', 'right']}
    >
      <StatusBar
        animated={true}
        showHideTransition={'fade'}
        barStyle={dark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.primary}
      />
      <AllPost />
    </SafeAreaView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
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
