import React, { useState } from 'react'
import { StyleSheet, StatusBar, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { IconButton, Modal, Portal, TouchableRipple, useTheme } from 'react-native-paper'
import AllPost from '../components/Post/AllPost'
import { useToggle } from '../hooks/useToggle'

const HomeScreen = () => {
  const { dark, colors } = useTheme()
  const [isAuth, setAuth] = useState(false)
  // const { googleAuth } = useAuth()
  // const { status, name } = googleAuth
  const { showModal, toggleModal } = useToggle()
  // const { promptAsync, request, signOut } = Auth()

  const containerStyle = {
    backgroundColor: colors.primary,
    padding: 30,
    borderRadius: 20,
    // width: '90%',
    marginHorizontal: '5%',
  }

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
      <Portal>
        <Modal visible={showModal} onDismiss={toggleModal} contentContainerStyle={containerStyle}>
          <Text style={{ fontSize: 18 }}>Example Modal. Click outside this area to dismiss.</Text>
          {!isAuth ? (
            <TouchableRipple
              onPress={toggleModal}
              rippleColor={colors.colorUnderlay}
              borderless={true}
              style={styles.Touchable}
            >
              <View style={[styles.button, { backgroundColor: colors.colorThirdBlue }]}>
                <IconButton icon='logo-google' style={{ transform: [{ scale: 1.1 }] }} />
                <Text style={styles.textLabel}>Iniciar sesión</Text>
              </View>
            </TouchableRipple>
          ) : (
            <TouchableRipple
              onPress={toggleModal}
              rippleColor={colors.colorUnderlay}
              borderless={true}
              style={styles.Touchable}
            >
              <View style={[styles.button, { backgroundColor: colors.colorFourthRed }]}>
                <IconButton icon='log-out-outline' style={{ transform: [{ scale: 1.2 }] }} />
                <Text style={styles.textLabel}>Cerrar sesión</Text>
              </View>
            </TouchableRipple>
          )}
          <TouchableRipple
            onPress={toggleModal}
            rippleColor={colors.colorUnderlay}
            borderless={true}
            style={styles.Touchable}
          >
            <View style={[styles.button, { backgroundColor: colors.textGray }]}>
              <Text style={[styles.textLabel, { paddingVertical: 10 }]}>Cancelar</Text>
            </View>
          </TouchableRipple>
        </Modal>
      </Portal>
    </SafeAreaView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  Touchable: {
    borderRadius: 24,
    marginTop: 18,
  },
  button: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textLabel: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
})
