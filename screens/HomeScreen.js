import React from 'react'
import { StyleSheet, StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from 'react-native-paper'
import AllPost from '../components/Post/AllPost'
// import { useToggle } from '../hooks/useToggle'

const HomeScreen = ({ scrollTop, scrollToTop }) => {
  const { dark, colors } = useTheme()
  // const [isAuth, setAuth] = useState(false)
  // const { googleAuth } = useAuth()
  // const { status, name } = googleAuth
  // const { showModal, toggleModal } = useToggle()
  // const { promptAsync, request, signOut } = Auth()

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
