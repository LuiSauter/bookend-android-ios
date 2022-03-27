import React, { useState, useEffect, Fragment, useCallback, memo } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, StatusBar } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useLazyQuery, useQuery } from '@apollo/client'
import { TouchableRipple, useTheme } from 'react-native-paper'
import ImageView from 'react-native-image-viewing'

import useTimeAgo from '../../hooks/useTimeAgo'
import { FIND_USER_BY_USER } from '../../user/graphql-queries'
import { GET_DOMINANT_COLOR } from '../../post/graphql-queries'
import userDefault from '../../assets/img/default-user.png'
import NameUser from '../NameUser'
import BtnOptions from '../Button/BtnOptions'
import { colorsRandom } from '../../config/colors'
import MultipleButtons from '../MultipleButtons'

const backgroundTintColorRandom = colorsRandom[Math.floor(Math.random() * colorsRandom.length)]

const AllPostItem = ({
  bookUrl,
  comments,
  likes,
  createdAt,
  image,
  title,
  description,
  id,
  user,
  author,
}) => {
  const { colors } = useTheme()
  const date = Number(createdAt)
  const { timeago, hourAndMinute } = useTimeAgo(date)
  const [isVisible, setIsVisible] = useState(false)
  const navigation = useNavigation()

  const { data, loading } = useQuery(FIND_USER_BY_USER, { variables: { user: user } })
  const { data: dataDominantColor } = useQuery(GET_DOMINANT_COLOR, { variables: { image: image } })
  const [getColor, { data: userDominantColor }] = useLazyQuery(GET_DOMINANT_COLOR)

  useEffect(() => {
    let cleanup = true
    if (cleanup) {
      data?.findUserById.me.photo && getColor({ variables: { image: data?.findUserById.me.photo } })
    }
    return () => {
      cleanup = false
    }
  }, [data?.findUserById, getColor])

  const activeModal = () => setIsVisible(!isVisible)

  const navigateToPost = useCallback(() => {
    return navigation.navigate('DetailScreen', {
      id: id,
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
  }, [
    author,
    bookUrl,
    comments,
    createdAt,
    data?.findUserById.description,
    data?.findUserById.followers,
    data?.findUserById.following,
    data?.findUserById.location,
    data?.findUserById.me.email,
    data?.findUserById.me.name,
    data?.findUserById.me.photo,
    data?.findUserById.me.username,
    data?.findUserById.me.verified,
    data?.findUserById.website,
    description,
    hourAndMinute,
    id,
    image,
    likes,
    navigation,
    title,
    user,
  ])

  const navigateToProfile = useCallback(() => {
    return navigation.navigate('UserScreen', {
      name: data?.findUserById.me.name,
      username: data?.findUserById.me.username,
      verified: data?.findUserById.me.verified,
      photo: data?.findUserById.me.photo,
      dominantColor: userDominantColor?.getColors ? userDominantColor?.getColors : '21,32,43',
      description: data?.findUserById.description,
      user: data?.findUserById.me.user,
      location: data?.findUserById.location,
      followers: data?.findUserById.followers,
      following: data?.findUserById.following,
      email: data?.findUserById.me.email,
      website: data?.findUserById.website,
    })
  }, [
    data?.findUserById.description,
    data?.findUserById.followers,
    data?.findUserById.following,
    data?.findUserById.location,
    data?.findUserById.me.email,
    data?.findUserById.me.name,
    data?.findUserById.me.photo,
    data?.findUserById.me.user,
    data?.findUserById.me.username,
    data?.findUserById.me.verified,
    data?.findUserById.website,
    navigation,
    userDominantColor?.getColors,
  ])

  const dominantColorString = dataDominantColor?.getColors
    ? `rgb(${dataDominantColor?.getColors})`
    : colors.primary

  return (
    <Fragment>
      {isVisible && (
        <StatusBar
          barStyle={'light-content'}
          animated={false}
          showHideTransition={'none'}
          backgroundColor={dominantColorString}
          translucent={true}
        />
      )}
      <ImageView
        images={[{ uri: image }]}
        imageIndex={0}
        visible={isVisible}
        onRequestClose={activeModal}
        animationType='fade'
        backgroundColor={dominantColorString}
      />
      <TouchableRipple
        onPress={navigateToPost}
        rippleColor={colors.colorUnderlay}
        style={{ backgroundColor: 'transparent' }}
      >
        <View style={styles.postContainer}>
          <View style={styles.userImgContainer}>
            {data?.findUserById ? (
              <TouchableRipple
                onPress={navigateToProfile}
                rippleColor={colors.colorUnderlay}
                borderless={true}
                style={{ borderRadius: 50 }}
              >
                <Image style={styles.userImg} source={{ uri: data?.findUserById.me.photo }} />
              </TouchableRipple>
            ) : (
              <Image style={styles.userImg} source={userDefault} />
            )}
          </View>
          <View style={styles.postItem}>
            <View style={styles.userTextContainer}>
              <TouchableOpacity onPress={navigateToProfile} activeOpacity={0.8}>
                <View style={styles.userTextItem}>
                  <NameUser
                    name={data?.findUserById.me.name}
                    verified={data?.findUserById.me.verified}
                    fontSize={17}
                  />
                  <Text style={[styles.userTextUsername, { color: colors.textGray }]}>
                    <Text style={{}}>
                      @
                      {data?.findUserById.me.username.length < 6
                        ? data?.findUserById.me.username
                        : `${data?.findUserById.me.username.toString().substring(0, 6)}...`}
                    </Text>{' '}
                    · {timeago}
                  </Text>
                </View>
              </TouchableOpacity>
              <BtnOptions username={data?.findUserById.me.username} user={user} />
            </View>
            <View style={styles.postItemDescription}>
              <Text style={[styles.postItemTitle, { color: colors.colorThirdBlue }]}>
                {title} - {author}
              </Text>
              <Text style={[styles.text, { color: colors.text }]}>
                {description.join('\n').length < 120
                  ? description.join('\n')
                  : `${description.join('\n').toString().substring(0, 120)}...`}
              </Text>
            </View>
            <TouchableRipple
              onPress={activeModal}
              style={[styles.postImgContainer, { borderColor: colors.border, borderRadius: 12 }]}
              borderless={true}
              rippleColor={colors.colorUnderlay}
            >
              {loading ? (
                <View
                  style={{
                    height: 350,
                    width: '100%',
                    backgroundColor: backgroundTintColorRandom,
                    borderRadius: 12,
                  }}
                />
              ) : (
                <Image style={styles.postImg} resizeMethod='resize' source={{ uri: image }} />
              )}
            </TouchableRipple>
            <View style={{ paddingVertical: 10 }}>
              <MultipleButtons title={title} bookUrl={bookUrl} id={id} />
            </View>
          </View>
        </View>
      </TouchableRipple>
    </Fragment>
  )
}

export default memo(AllPostItem)

const styles = StyleSheet.create({
  postContainer: {
    flex: 1,
    paddingHorizontal: 16,
    flexDirection: 'row',
    height: '100%',
  },
  userImgContainer: {
    marginVertical: 12,
    marginRight: 12,
    width: 47,
  },
  userImg: {
    height: 47,
    width: 47,
    borderRadius: 50,
  },
  userTextContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userTextItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflow: 'hidden',
  },
  userTextUsername: {
    fontSize: 16,
  },
  postItem: {
    flex: 1,
    marginTop: 8,
  },
  postItemDescription: {
    flex: 1,
    flexDirection: 'column',
    marginBottom: 12,
  },
  postItemTitle: {
    fontSize: 15.5,
    marginBottom: 7,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
  postImgContainer: {
    height: 350,
    flex: 1,
    justifyContent: 'flex-start',
    overflow: 'hidden',
    borderRadius: 12,
    borderWidth: 1,
  },
  postImg: {
    width: '100%',
    aspectRatio: 2 / 3,
    borderRadius: 12,
    resizeMode: 'cover',
  },
})
