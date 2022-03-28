import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { IconButton, TouchableRipple, useTheme, Menu, Divider } from 'react-native-paper'

const BtnOptions = ({ user, emailOfUser, username }) => {
  const { colors } = useTheme()
  const [visible, setVisible] = useState(false)

  const showMenu = () => setVisible(!visible)

  const anchor = (
    <TouchableRipple
      rippleColor={colors.colorUnderlay}
      onPress={showMenu}
      style={styles.btn}
      borderless={true}
    >
      <IconButton
        icon='ellipsis-vertical'
        color={colors.textGray}
        size={15}
        underlayColor={colors.colorUnderlay}
      />
    </TouchableRipple>
  )

  return (
    <View style={styles.container}>
      <Menu
        visible={visible}
        style={[styles.menu]}
        anchor={anchor}
        onDismiss={showMenu}
        contentStyle={[
          styles.contentMenu,
          { backgroundColor: colors.primary, borderColor: colors.border },
        ]}
      >
        <Menu.Item
          contentStyle={{ width: '100%', fontSize: 18 }}
          title='Reportar un problema'
          disabled={true}
        />
        <Divider />
        <Menu.Item
          contentStyle={{ width: '100%' }}
          titleStyle={{ color: colors.colorFourthRed, fontSize: 18 }}
          onPress={showMenu}
          title='Cancelar'
        />
      </Menu>
    </View>
  )
}
export default BtnOptions

const styles = StyleSheet.create({
  btn: { borderRadius: 16 },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  menu: {
    width: '90%',
    flex: 1,
    padding: 0,
    margin: 0,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  contentMenu: {
    borderRadius: 16,
    borderWidth: 1,
    flex: 1,
    width: '100%',
  },
})
