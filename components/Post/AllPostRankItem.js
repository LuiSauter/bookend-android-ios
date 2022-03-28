import React, { memo } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { useQuery } from '@apollo/client'
import { useNavigation, useTheme } from '@react-navigation/native'

import { colorsRandom } from '../../config/colors'
import BtnLike from '../Button/BtnLike'
import useTimeAgo from '../../hooks/useTimeAgo'
import { FIND_USER_BY_USER } from '../../user/graphql-queries'
import { TouchableRipple } from 'react-native-paper'

const AllPostRankItem = ({
  bookUrl,
  createdAt,
  image,
  title,
  comments,
  description,
  id,
  likes,
  user,
  author,
}) => {
  const { colors } = useTheme()
  const navigation = useNavigation()
  const date = Number(createdAt)
  const { hourAndMinute } = useTimeAgo(date)
  const { data } = useQuery(FIND_USER_BY_USER, { variables: { user: user } })

  const navigatePost = () => {
    data?.findUserById &&
      navigation.navigate('DetailScreen', {
        id: id,
        randomColor: colorsRandom[Math.floor(Math.random() * colorsRandom.length)],
        createdAt,
        image,
        title,
        description,
        user,
        author,
        name: data?.findUserById.me.name,
        username: data?.findUserById.me.username,
        verified: data?.findUserById.me.verified,
        photo: data?.findUserById.me.photo,
        descriptionUser: data?.findUserById.description,
        location: data?.findUserById.location,
        followers: data?.findUserById.followers,
        following: data?.findUserById.following,
        email: data?.findUserById.me.email,
        website: data?.findUserById.website,
        hourAndMinute,
        bookUrl,
        comments,
        likes,
      })
  }

  return (
    <TouchableRipple
      onPress={navigatePost}
      rippleColor={colors.colorUnderlay}
      borderless={true}
      style={{ width: '50%', flex: 1 }}
    >
      <View style={styles.container}>
        <View
          style={{
            padding: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image style={styles.image} source={{ uri: image }} />
        </View>
        <View style={styles.TextAndLikes}>
          <Text style={[styles.text, { color: colors.text }]}>{title}</Text>
          <BtnLike id={id} likes={likes.length} />
        </View>
      </View>
    </TouchableRipple>
  )
}

export default memo(AllPostRankItem)

const styles = StyleSheet.create({
  container: {},
  image: {
    width: '100%',
    resizeMode: 'cover',
    aspectRatio: 9 / 13,
    borderRadius: 16,
  },
  text: {
    fontSize: 15,
    width: '70%',
    textAlign: 'center',
  },
  TextAndLikes: {
    flex: 1,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginVertical: 4,
    minHeight: 45,
  },
})
