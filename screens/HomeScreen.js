import { StyleSheet, StatusBar, View, Text, ActivityIndicator, Image } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { IconButton, Modal, Portal, TouchableRipple, useTheme } from 'react-native-paper'
import { useLazyQuery } from '@apollo/client'

import AllPost from '../components/Post/AllPost'
import { useToggle } from '../hooks/useToggle'
import { useAuth } from '../hooks/useAuth'
import { FIND_USER } from '../user/graphql-queries'
import { useNavigation } from '@react-navigation/native'
import { GET_DOMINANT_COLOR } from '../post/graphql-queries'
import Loading from '../components/Loading'

const HomeScreen = ({ scrollTop, scrollToTop }) => {
  const { dark, colors } = useTheme()
  const { toggleModal, showModal } = useToggle()
  const { googleAuth, signInWithGoogle, signOut, loading } = useAuth()
  const { status, name, image, email } = googleAuth
  const navigation = useNavigation()

  const [getUser, { data, loading: loadingUser }] = useLazyQuery(FIND_USER)
  const [getColor, { data: userDominantColor }] = useLazyQuery(GET_DOMINANT_COLOR)

  const containerStyle = {
    backgroundColor: colors.primary,
    padding: 30,
    borderRadius: 20,
    marginHorizontal: '5%',
  }

  const background = {
    backgroundColor:
      status === 'unauthenticated' || loadingUser ? colors.colorThirdBlue : colors.colorFourthRed,
  }

  useEffect(() => {
    let mounted = true
    if (mounted && status === 'authenticated') {
      getUser({ variables: { email: email } })
      getColor({ variables: { image: image } })
    }
    return () => {
      mounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, getUser])

  const navigateToProfile = () => {
    navigation.navigate('UserScreen', {
      name: data?.findUser.me.name,
      username: data?.findUser.me.username,
      verified: data?.findUser.me.verified,
      photo: data?.findUser.me.photo,
      dominantColor: userDominantColor?.getColors ? userDominantColor?.getColors : '21,32,43',
      description: data?.findUser.description,
      user: data?.findUser.me.user,
      location: data?.findUser.location,
      followers: data?.findUser.followers,
      following: data?.findUser.following,
      email: data?.findUser.me.email,
      website: data?.findUser.website,
      liked: data?.findUser.liked,
    })
    toggleModal()
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
          {status === 'authenticated' ? (
            loadingUser ? (
              <Loading label='cargando...' />
            ) : (
              <TouchableRipple
                rippleColor={colors.colorUnderlay}
                borderless={true}
                onPress={navigateToProfile}
                style={styles.buttonUser}
              >
                <View style={styles.viewUser}>
                  <Image
                    source={{ uri: image }}
                    resizeMode='cover'
                    style={{ width: 42, height: 42, borderRadius: 50, marginRight: 14 }}
                  />
                  <View style={{ justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                    <Text style={{ fontSize: 20, color: colors.text, textAlign: 'center' }}>
                      {name}
                    </Text>
                    <Text
                      style={{
                        fontSize: 17,
                        color: colors.textGray,
                        textAlign: 'center',
                      }}
                    >
                      Ver perfil
                    </Text>
                  </View>
                </View>
              </TouchableRipple>
            )
          ) : (
            <Text style={{ fontSize: 20, color: colors.text, textAlign: 'center' }}>
              Iniciar sesion
            </Text>
          )}
          <TouchableRipple
            onPress={() => {
              status === 'unauthenticated' ? signInWithGoogle() : signOut()
            }}
            rippleColor={colors.colorUnderlay}
            borderless={true}
            style={styles.Touchable}
          >
            <View style={[styles.button, background]}>
              {loading || loadingUser ? (
                <ActivityIndicator
                  style={styles.loading}
                  animating={true}
                  color={colors.white}
                  size='small'
                />
              ) : (
                <IconButton
                  icon={
                    status === 'unauthenticated' || loadingUser ? 'logo-google' : 'log-out-outline'
                  }
                  style={{ transform: [{ scale: 1.2 }] }}
                  color={colors.white}
                />
              )}
              <Text style={styles.textLabel}>
                {status === 'unauthenticated' || loadingUser ? 'Con google' : 'Cerrar sesión'}
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
  viewUser: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonUser: {
    paddingVertical: 10,
    borderRadius: 12,
  },
})
