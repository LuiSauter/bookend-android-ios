import React, { useEffect, memo } from 'react'
import { Text, ActivityIndicator } from 'react-native'
import { useLazyQuery, useMutation } from '@apollo/client'
import { useTheme } from '@react-navigation/native'

import { FOLLOW_USER, UNFOLLOW_USER } from '../../user/graphql-mutation'
import { FIND_USER } from '../../user/graphql-queries'
import { useToggle } from '../../hooks/useToggle'
import { useAuth } from '../../hooks/useAuth'
import { TouchableRipple } from 'react-native-paper'

const BtnFollow = ({ user }) => {
  const { googleAuth } = useAuth()
  const { status, email } = googleAuth
  const { toggleModal } = useToggle()
  const { colors } = useTheme()
  const [getUserByEmail, { data: dataUser }] = useLazyQuery(FIND_USER)
  const [getFollow, { loading }] = useMutation(FOLLOW_USER, {
    refetchQueries: [{ query: FIND_USER, variables: { email: email } }],
  })

  const [getUnFollow, { loading: loadingUnFollow }] = useMutation(UNFOLLOW_USER, {
    refetchQueries: [{ query: FIND_USER, variables: { email: email } }],
  })

  useEffect(() => {
    let cleanup = true
    if (cleanup) {
      status === 'authenticated' && getUserByEmail({ variables: { email: email } })
    }
    return () => {
      cleanup = false
    }
  }, [getUserByEmail, email, status])

  const isMatch =
    status === 'authenticated' && dataUser?.findUser.following.some(userId => userId === user)

  const handleClickButtonFollow = data => {
    if (status === 'unauthenticated') {
      return toggleModal()
    }
    getFollow({ variables: { user: data, email: email } })
  }

  const handleClickButtonUnFollow = data => {
    getUnFollow({ variables: { user: data, email: email } })
  }

  return (
    <TouchableRipple
      onPress={() => {
        isMatch ? handleClickButtonUnFollow(user) : handleClickButtonFollow(user)
      }}
      borderless={true}
      rippleColor={colors.colorUnderlay}
      style={{
        borderRadius: 14,
        borderWidth: 1,
        borderColor: isMatch ? colors.textGray : colors.colorThirdBlue,
        backgroundColor: isMatch ? 'transparent' : colors.colorThirdBlue,
        paddingHorizontal: 10,
        paddingBottom: 4,
        paddingTop: 3,
      }}
    >
      {loading || loadingUnFollow ? (
        <ActivityIndicator
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 1,
            paddingHorizontal: 10,
          }}
          animating={true}
          color={isMatch ? colors.colorThirdBlue : colors.white}
          size='small'
        />
      ) : (
        <Text
          style={{
            color: isMatch ? colors.textGray : colors.text,
            fontSize: 16,
          }}
        >
          {isMatch ? 'Dejar de seguir' : 'Seguir'}
        </Text>
      )}
    </TouchableRipple>
  )
}
export default memo(BtnFollow)
