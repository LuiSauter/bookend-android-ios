import React from 'react'
import { StyleSheet, StatusBar, View, Text, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { IconButton, Modal, Portal, TouchableRipple, useTheme } from 'react-native-paper'
import AllPost from '../components/Post/AllPost'
import { useToggle } from '../hooks/useToggle'
import { useAuth } from '../hooks/useAuth'

const HomeScreen = ({ scrollTop, scrollToTop }) => {
  const { dark, colors } = useTheme()
  const { toggleModal, showModal } = useToggle()
  const { googleAuth, signInWithGoogle, signOut, loading } = useAuth()
  const { status, name } = googleAuth

  const containerStyle = {
    backgroundColor: colors.primary,
    padding: 30,
    borderRadius: 20,
    marginHorizontal: '5%',
  }

  const background = {
    backgroundColor: status === 'unauthenticated' ? colors.colorThirdBlue : colors.colorFourthRed,
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
      <AllPost scrollTop={scrollTop} scrollToTop={scrollToTop} />
      <Portal>
        <Modal visible={showModal} onDismiss={toggleModal} contentContainerStyle={containerStyle}>
          <Text style={{ fontSize: 20, color: colors.text, textAlign: 'center' }}>
            {status === 'unauthenticated' ? 'Iniciar sesion' : `Welcome, ${name}`}
          </Text>
          <TouchableRipple
            onPress={() => {
              status === 'unauthenticated' ? signInWithGoogle() : signOut()
            }}
            rippleColor={colors.colorUnderlay}
            borderless={true}
            style={styles.Touchable}
          >
            <View style={[styles.button, background]}>
              {loading ? (
                <ActivityIndicator
                  style={styles.loading}
                  animating={true}
                  color={colors.white}
                  size='small'
                />
              ) : (
                <IconButton
                  icon={status === 'unauthenticated' ? 'logo-google' : 'log-out-outline'}
                  style={{ transform: [{ scale: 1.2 }] }}
                  color={colors.white}
                />
              )}
              <Text style={styles.textLabel}>
                {status === 'unauthenticated' ? 'Con google' : 'Cerrar sesión'}
              </Text>
            </View>
          </TouchableRipple>
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
  Touchable: {
    borderRadius: 24,
    marginTop: 18,
  },
  loading: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
    transform: [{ scale: 1.3 }],
  },
})
