import { StyleSheet, StatusBar, ScrollView } from 'react-native'
import React from 'react'
import { useQuery } from '@apollo/client'
import { SafeAreaView } from 'react-native-safe-area-context'

import { FIND_USER } from '../user/graphql-queries'
import ProfileForm from '../components/Profile/ProfileForm'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from 'react-native-paper'

const UpdateScreen = () => {
  const { dark, colors } = useTheme()
  const { googleAuth } = useAuth()
  const { data } = useQuery(FIND_USER, { variables: { email: googleAuth.email } })

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: `${colors.primary}aa` }]}
      edges={['top', 'left', 'right']}
    >
      <StatusBar
        animated={true}
        showHideTransition={'slide'}
        barStyle={dark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.primary}
      />
      <ScrollView style={{ paddingHorizontal: 16 }}>
        {data?.findUser && (
          <ProfileForm
            name={data?.findUser.me.name}
            username={data?.findUser.me.username}
            photo={data?.findUser.me.photo}
            description={data?.findUser.description}
            location={data?.findUser.location}
            email={data?.findUser.me.email}
            website={data?.findUser.website}
            gender={data?.findUser.gender}
            id={data?.findUser.id}
            user={data?.findUser.me.user}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

export default UpdateScreen

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
})
