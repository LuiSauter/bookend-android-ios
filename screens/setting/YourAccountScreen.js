import { StyleSheet, Text, View, StatusBar, Alert } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TouchableRipple, useTheme } from 'react-native-paper'
import { useAuth } from '../../hooks/useAuth'
import { useMutation } from '@apollo/client'
import { DELETE_USER } from '../../user/graphql-mutation'
import { useNavigation } from '@react-navigation/native'
import { ALL_USERS } from '../../user/graphql-queries'

const YourAccountScreen = () => {
  const { colors, dark } = useTheme()
  const { googleAuth, signOut } = useAuth()
  const { status, user } = googleAuth
  const [deleteUser] = useMutation(DELETE_USER, {
    // refetchQueries: [{ query: FIND_USER, variables: { email: googleAuth.email } }],
    refetchQueries: [{ query: ALL_USERS }],
  })
  const navigation = useNavigation()

  const handleDelete = () => {
    if (status === 'authenticated') {
      deleteUser({ variables: { user: user } })
      signOut()
      navigation.navigate('TabNavigator')
    }
  }

  const buttonAlert = () =>
    Alert.alert('¿Estas seguro?', 'Su perfil se borrara permanentemente', [
      { text: 'Cancelar', onPress: () => console.log('Has cancelado esta opción') },
      { text: 'Ok', onPress: () => handleDelete() },
    ])

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar
        animated={true}
        showHideTransition={'slide'}
        barStyle={dark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.colorPrimary}
      />
      {status === 'authenticated' && (
        <View style={styles.item}>
          <TouchableRipple
            onPress={buttonAlert}
            rippleColor={colors.colorUnderlay}
            borderless={true}
            style={{
              flex: 1,
              paddingHorizontal: 16,
              paddingVertical: 8,
            }}
          >
            <Text style={[styles.text, { color: colors.colorFourthRed, opacity: 0.7 }]}>
              Borrar mi cuenta
            </Text>
          </TouchableRipple>
        </View>
      )}
    </SafeAreaView>
  )
}

export default YourAccountScreen

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    fontSize: 17,
  },
})
