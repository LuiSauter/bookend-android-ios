import React from 'react'
import { StyleSheet, StatusBar } from 'react-native'
import { useTheme } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import AllPostRanking from '../components/Post/AllPostRanking'

const BookScreen = () => {
  const { colors, dark } = useTheme()
  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.primary }]}
      edges={['top', 'left', 'right', 'bottom']}
    >
      <StatusBar
        animated={true}
        showHideTransition={'fade'}
        barStyle={dark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.primary}
      />
      {/* <AllPostRanking /> */}
    </SafeAreaView>
  )
}

export default BookScreen

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
})
