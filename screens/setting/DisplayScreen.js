import { useTheme } from '@react-navigation/native'
import React from 'react'
import { SafeAreaView, StatusBar, StyleSheet, Text, View, Switch } from 'react-native'
import { useToggle } from '../../hooks/useToggle'

const DisplayScreen = () => {
  const { colors, dark } = useTheme()
  const { toggleTheme } = useToggle()

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar
        animated={true}
        showHideTransition={'slide'}
        barStyle={dark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.colorPrimary}
      />
      <View style={styles.item}>
        <View style={styles.text}>
          <Text style={[styles.title, { color: colors.text }]}>Tema Oscuro</Text>
          <Text style={[styles.description, { color: colors.textGray }]}>
            Modo nocturno. Esto hace que sea más fácil mirar la pantalla o leer con poca luz y puede
            ayudarlo a conciliar el sueño más fácilmente.
          </Text>
        </View>
        <Switch
          trackColor={{ false: '#767577', true: colors.colorThirdBlue }}
          thumbColor={dark ? colors.colorThirdYellow : '#f4f3f4'}
          ios_backgroundColor='#3e3e3e'
          onValueChange={toggleTheme}
          value={dark}
        />
      </View>
    </SafeAreaView>
  )
}
export default DisplayScreen

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  text: {
    display: 'flex',
    flexDirection: 'column',
    width: '80%',
  },
  title: {
    fontSize: 18,
  },
  description: {
    fontSize: 16,
  },
  icon: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
  },
})
