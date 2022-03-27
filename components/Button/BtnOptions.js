import React, { useEffect, useState, memo } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useLazyQuery } from '@apollo/client'
import { IconButton, TouchableRipple, useTheme, Menu, Divider } from 'react-native-paper'

import { FIND_USER } from '../../user/graphql-queries'
import BtnFollow from './BtnFollow'
import { useAuth } from '../../hooks/useAuth'

const BtnOptions = ({ username, user }) => {
  const { colors } = useTheme()
  const [visible, setVisible] = useState(false)
  const { googleAuth } = useAuth()
  const { status, email } = googleAuth
  const [getUserByEmail, { data: dataUser }] = useLazyQuery(FIND_USER)

  useEffect(() => {
    let cleanup = true
    if (cleanup) {
      status === 'authenticated' && getUserByEmail({ variables: { email: email } })
    }
    return () => {
      cleanup = false
    }
  }, [email, getUserByEmail, status])

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
        {dataUser?.findUser.me.user !== user && (
          <Menu.Item
            pressColor='transparent'
            textStyle={{ color: colors.text, fontSize: 18, width: '130%' }}
            title={
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 18, color: colors.text }}>@{username}</Text>
                <BtnFollow user={user} />
              </View>
            }
          />
        )}
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
export default memo(BtnOptions)

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
