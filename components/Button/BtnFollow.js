import React, { useEffect, memo } from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { useLazyQuery, useMutation } from '@apollo/client'
import { useTheme } from '@react-navigation/native'

import { FOLLOW_USER, UNFOLLOW_USER } from '../../user/graphql-mutation'
import { FIND_USER } from '../../user/graphql-queries'
import { useToggle } from '../../hooks/useToggle'
import { useAuth } from '../../hooks/useAuth'

const BtnFollow = ({ user }) => {
  const { googleAuth } = useAuth()
  const { toggleModal } = useToggle()
  const { colors } = useTheme()
  const [getUserByEmail, { data: dataUser }] = useLazyQuery(FIND_USER)
  const [getFollow] = useMutation(FOLLOW_USER, {
    refetchQueries: [{ query: FIND_USER, variables: { email: googleAuth.email } }],
  })

  const [getUnFollow] = useMutation(UNFOLLOW_USER, {
    refetchQueries: [{ query: FIND_USER, variables: { email: googleAuth.email } }],
  })

  useEffect(() => {
    let cleanup = true
    if (cleanup) {
      googleAuth.status === 'authenticated' &&
        getUserByEmail({ variables: { email: googleAuth.email } })
    }
    return () => {
      cleanup = false
    }
  }, [getUserByEmail, googleAuth.email, googleAuth.status])

  const handleClickButtonFollow = data => {
    if (googleAuth.status === 'unauthenticated') {
      return toggleModal()
    }
    getFollow({ variables: { user: data, email: googleAuth.email } })
  }

  const handleClickButtonUnFollow = data => {
    getUnFollow({ variables: { user: data, email: googleAuth.email } })
  }

  const isMath =
    googleAuth.status === 'authenticated' &&
    dataUser?.findUser.following.some(userId => userId === user)

  return isMath ? (
    <TouchableOpacity
      style={{ marginLeft: 16 }}
      activeOpacity={0.6}
      onPress={() => handleClickButtonUnFollow(user)}
    >
      <Text
        style={{
          color: colors.text,
          borderWidth: 1,
          borderRadius: 16,
          borderColor: colors.text,
          paddingHorizontal: 10,
          paddingBottom: 3,
          paddingTop: 3,
          fontSize: 16,
        }}
      >
        Dejar de seguir
      </Text>
    </TouchableOpacity>
  ) : (
    <TouchableOpacity
      style={{ marginLeft: 16 }}
      activeOpacity={0.6}
      onPress={() => handleClickButtonFollow(user)}
    >
      <Text
        style={{
          color: colors.white,
          backgroundColor: colors.colorThirdBlue,
          borderRadius: 16,
          paddingHorizontal: 10,
          paddingBottom: 4,
          paddingTop: 2,
          fontSize: 16,
        }}
      >
        Seguir
      </Text>
    </TouchableOpacity>
  )
}
export default memo(BtnFollow)
