import React, { memo } from 'react'
import { StatusBar, StyleSheet, Text, FlatList, View } from 'react-native'
import { useNavigation, useTheme } from '@react-navigation/native'
import { IconButton, TouchableRipple } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'

const data = [
  {
    id: 0,
    title: 'Tu cuenta',
    description:
      'Ve la informacion de tu cuenta y obtén más información acerca de las opciones de desactivación de la cuenta.',
    screen: 'YourAccountScreen',
    icon: 'person-outline',
  },
  {
    id: 1,
    title: 'Pantalla y idiomas',
    description: 'Administra como vez el contenido en Bookend.',
    screen: 'DisplayScreen',
    icon: 'phone-portrait-outline',
  },
  {
    id: 2,
    title: 'Tu actividad en Bookend',
    description: 'Consulta la informacion sobre a quien seguiste y que post te gustaron.',
    screen: '',
    icon: 'eye-outline',
  },
  {
    id: 3,
    title: 'Reporta un problema',
    description: 'Ayudanos a mejorar reportando un bug o problemas de rendimiento.',
    screen: '',
    icon: 'bug-outline',
  },
  {
    id: 4,
    title: 'Contacto del desarrollador',
    description: 'Ayudanos a mejorar reportando un bug o problemas de rendimiento.',
    screen: '',
    icon: 'chatbubbles-outline',
  },
]

const Item = memo(({ title, description, screen, nameIcon }) => {
  const navigation = useNavigation()
  const { colors } = useTheme()

  return (
    <TouchableRipple
      onPress={() => screen !== '' && navigation.navigate(screen)}
      rippleColor={colors.colorUnderlay}
      borderless={true}
    >
      <View style={styles.item}>
        <View style={styles.textContainer}>
          <IconButton
            icon={nameIcon}
            size={26}
            style={{ marginRight: 16, marginLeft: 0, padding: 0 }}
            color={colors.textGray}
          />
          <View style={styles.text}>
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
            <Text style={[styles.description, { color: colors.textGray }]}>{description}</Text>
          </View>
        </View>
        <IconButton
          icon='chevron-forward'
          size={20}
          style={{ marginRight: 0, padding: 0, transform: [{ scale: 1.4 }] }}
          color={colors.textGray}
        />
      </View>
    </TouchableRipple>
  )
})

const renderItem = ({ item }) => (
  <Item
    title={item.title}
    screen={item.screen}
    description={item.description}
    nameIcon={item.icon}
  />
)

const keyExtractor = item => item.id

const SettingScreen = () => {
  const { colors, dark } = useTheme()

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.primary }]}
      edges={['top', 'left', 'right']}
    >
      <StatusBar
        animated={true}
        showHideTransition={'slide'}
        barStyle={dark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.primary}
      />
      <FlatList data={data} renderItem={renderItem} keyExtractor={keyExtractor} />
    </SafeAreaView>
  )
}
export default SettingScreen

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: 16,
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
  },
  text: {
    flex: 1,
    flexDirection: 'column',
  },
  title: {
    fontSize: 18,
  },
  description: {
    fontSize: 16,
  },
})
