import React, { useEffect, useState, memo } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useLazyQuery } from '@apollo/client'
// import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu'

import { FIND_USER } from '../../user/graphql-queries'
import BtnFollow from './BtnFollow'
import { useAuth } from '../../hooks/useAuth'
import { IconButton, TouchableRipple, useTheme } from 'react-native-paper'
import { Menu, Divider } from 'react-native-paper'

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
          { backgroundColor: colors.secondary, borderColor: colors.border },
        ]}
      >
        <Menu.Item
          contentStyle={{ width: '100%', fontSize: 18 }}
          // onPress={hideMenu}
          title='Reportar un problema'
          disabled={true}
        />
        <Menu.Item
          title={
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 18 }}>{`@${username}`}</Text>
              <BtnFollow username={username} user={user} />
            </View>
          }
          contentStyle={{ width: '100%' }}
        />
        <Divider />
        <Menu.Item
          contentStyle={{ width: '100%' }}
          titleStyle={{ color: colors.colorFourthRed, fontSize: 18 }}
          onPress={showMenu}
          title='Cancelar'
        />
        {/* <View style={{ margin: 16 }}>
          {dataUser?.findUser.me.user !== user && (
            <MenuItem
              pressColor='transparent'
              textStyle={{ color: colors.text, fontSize: 18, width: '130%' }}
            >
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: colors.text, fontSize: 18, textAlign: 'center' }}>
                  @{username}
                </Text>
                <BtnFollow username={username} user={user} />
              </View>
            </MenuItem>
          )}
          <MenuDivider color={colors.border} />
        </View> */}
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
    alignItems: 'center',
  },
  contentMenu: {
    borderRadius: 16,
    borderWidth: 1,
    flex: 1,
  },
})
