import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Pressable } from 'react-native'
import { useLazyQuery, useMutation, useQuery } from '@apollo/client'
import { useTheme } from '@react-navigation/native'

import { DISLIKE_POST, LIKE_POST } from '../../post/graphql-mutations'
import { FINDONE_POST } from '../../post/graphql-queries'
import { FIND_USER } from '../../user/graphql-queries'
import { useAuth } from '../../hooks/useAuth'
import { useToggle } from '../../hooks/useToggle'
import { IconButton } from 'react-native-paper'

const BtnLike = ({ id }) => {
  const { colors } = useTheme()
  const [like, setLike] = useState(false)
  const [likeCount, setLikeCount] = useState(null)
  const { toggleModal } = useToggle()
  const { googleAuth } = useAuth()

  const { email, status } = googleAuth

  const { data } = useQuery(FINDONE_POST, {
    variables: { id: id },
  })
  const [getUserByEmail, { data: dataUser }] = useLazyQuery(FIND_USER)
  const [getLike] = useMutation(LIKE_POST, {
    refetchQueries: [{ query: FINDONE_POST, variables: { id } }],
  })
  const [getDisLike] = useMutation(DISLIKE_POST, {
    refetchQueries: [{ query: FINDONE_POST, variables: { id } }],
  })

  useEffect(() => {
    let cleanup = true
    if (cleanup) {
      status === 'authenticated' && getUserByEmail({ variables: { email: email } })
    }
    return () => {
      cleanup = false
    }
  }, [email, getUserByEmail, status])

  const isMatch = data?.findPost.likes.some(postId => postId === dataUser?.findUser.me.user)

  useEffect(() => {
    let cleanup = true
    if (cleanup) {
      if (status === 'unauthenticated') {
        return setLike(false)
      }
      isMatch ? setLike(true) : setLike(false)
    }
    return () => {
      cleanup = false
    }
  }, [isMatch, status])

  useEffect(() => {
    let cleanup = true
    if (cleanup) {
      setLikeCount(data?.findPost.likes.length)
    }
    return () => {
      cleanup = false
    }
  }, [data?.findPost])

  const handleLike = idUser => {
    if (status === 'unauthenticated') {
      toggleModal()
    }
    if (status === 'authenticated') {
      getLike({ variables: { id: idUser, email: email } })
      setLike(!like)
      setLikeCount(prev => prev + 1)
    }
  }

  const handleDisLike = idUser => {
    if (status === 'unauthenticated') {
      toggleModal()
    }
    if (status === 'authenticated') {
      getDisLike({ variables: { id: idUser, email: email } })
      setLike(!like)
      setLikeCount(prev => prev - 1)
    }
  }

  return (
    <View style={styles.btn}>
      {like ? (
        <Pressable
          onPress={() => handleDisLike(id)}
          android_ripple={{
            color: `${colors.colorThirdPurple}33`,
            borderless: true,
            radius: 22,
          }}
          style={({ pressed }) => [
            { backgroundColor: pressed ? 'transparent' : 'transparent', paddingTop: 2 },
          ]}
        >
          <IconButton
            icon='heart'
            backgroundColor='transparent'
            borderRadius={50}
            color={colors.colorLikeRed}
            size={23}
            iconStyle={{ marginRight: 0 }}
            underlayColor='transparent'
          />
        </Pressable>
      ) : (
        <Pressable
          onPress={() => handleLike(id)}
          android_ripple={{
            color: `${colors.colorLikeRed}55`,
            borderless: true,
            radius: 22,
          }}
          style={({ pressed }) => [
            { backgroundColor: pressed ? 'transparent' : 'transparent', paddingTop: 2 },
          ]}
        >
          <IconButton
            icon='heart-outline'
            backgroundColor='transparent'
            borderRadius={50}
            color={colors.textGray}
            size={23}
            iconStyle={{ marginRight: 0 }}
            underlayColor='transparent'
          />
        </Pressable>
      )}
      <Text
        style={{ fontSize: 17, color: like ? colors.colorLikeRed : colors.textGray, marginLeft: 5 }}
      >
        {likeCount}
      </Text>
    </View>
  )
}

export default BtnLike

const styles = StyleSheet.create({
  btn: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 15,
  },
})
