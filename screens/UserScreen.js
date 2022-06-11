import React, { useCallback, useEffect, useState, useReducer } from 'react'
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
} from 'react-native'
import { useLazyQuery } from '@apollo/client'
import { useTheme } from '@react-navigation/native'

import { ALL_POST_BY_USER, ALL_POST_BY_USER_COUNT, FINDONE_POST } from '../post/graphql-queries'
import AllPostItem from '../components/Post/AllPostItem'
import { useAuth } from '../hooks/useAuth'
import HeaderProfile from '../components/Profile/HeaderProfile'

const INITIAL_REDUCER_STATE = { posts: [], loading: false }
const INITIAL_STATE = { liked: true }

const INITIAL_PAGE = 5

const reducer = (state, action) => {
  const { type } = action
  switch (type) {
    case '@add-post': {
      const isMatch = state.posts.some(post => post.id === action.payload.id)
      if (isMatch) {
        return state
      } else {
        return {
          ...state,
          posts: [action.payload, ...state.posts],
        }
      }
    }
    default: {
      return
    }
  }
}

const renderItem = ({ item }) => {
  return (
    <AllPostItem
      bookUrl={item.bookUrl}
      createdAt={item.createdAt}
      image={item.image}
      title={item.title}
      comments={item.comments}
      description={item.description}
      id={item.id}
      likes={item.likes}
      tags={item.tags}
      user={item.user}
      author={item.author}
    />
  )
}

const keyExtractor = item => item.id.toString()

const UserScreen = ({ route }) => {
  const {
    username,
    name,
    verified,
    photo,
    description,
    user,
    location,
    followers,
    following,
    email: userEmail,
    website,
    dominantColor,
    liked,
  } = route.params
  const { googleAuth } = useAuth()
  const { email } = googleAuth
  const { colors } = useTheme()

  const [refreshing, setRefreshing] = useState(false)
  const [currentPage, setCurrentPage] = useState(INITIAL_PAGE)
  const [isLoading, setIsLoading] = useState(true)
  const [headerTopTab, setHeaderTopTab] = useState(INITIAL_STATE)
  const [state, dispatch] = useReducer(reducer, INITIAL_REDUCER_STATE)
  const [getPost, { data }] = useLazyQuery(FINDONE_POST)

  const [getAllPost, { data: dataAllPosts, refetch }] = useLazyQuery(ALL_POST_BY_USER)
  const [getCountAllPost, { data: CountAllPosts }] = useLazyQuery(ALL_POST_BY_USER_COUNT)

  useEffect(() => {
    let cleanup = true
    if (cleanup) {
      if (username) {
        getAllPost({
          variables: { pageSize: INITIAL_PAGE, skipValue: 0, username: username },
        })
        getCountAllPost({ variables: { username: username } })
      }
    }
    return () => {
      cleanup = false
    }
  }, [getAllPost, getCountAllPost, username])

  useEffect(() => {
    let cleanup = true
    if (cleanup) {
      refetch({ pageSize: currentPage, skipValue: 0, username: username })
    }
    return () => {
      cleanup = false
    }
  }, [currentPage, refetch, username])

  useEffect(() => {
    let cleanup = true
    if (cleanup && !verified) {
      if (liked.length > 0) {
        getPost({ variables: { id: liked[0] } })
        setIsLoading(false)
      } else {
        setIsLoading(false)
      }
    }
    return () => {
      cleanup = false
    }
  }, [getPost, liked, verified])

  useEffect(() => {
    let cleanup = true
    if (cleanup) {
      data?.findPost && dispatch({ type: '@add-post', payload: data?.findPost })
    }
    return () => {
      cleanup = false
    }
  }, [data?.findPost])

  const HeaderComponent = () => {
    return (
      <HeaderProfile
        photo={photo}
        verified={verified}
        username={username}
        name={name}
        email={email}
        user={user}
        description={description}
        website={website}
        followers={followers}
        userEmail={userEmail}
        following={following}
        location={location}
        dominantColor={dominantColor}
        liked={liked}
        headerTopTab={headerTopTab}
      />
    )
  }

  const renderLoader = () => {
    return isLoading ? (
      <View style={{ marginVertical: 16 }}>
        <ActivityIndicator size='small' color={colors.colorThirdBlue} />
      </View>
    ) : null
  }

  const loadMoreItem = useCallback(() => {
    if (
      CountAllPosts &&
      dataAllPosts?.allPostsByUsername.length === CountAllPosts?.allPostUserCount
    ) {
      return setIsLoading(false)
    }
    setCurrentPage(currentPage + INITIAL_PAGE)
  }, [CountAllPosts, currentPage, dataAllPosts?.allPostsByUsername.length])

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await refetch({ pageSize: INITIAL_PAGE, skipValue: 0 })
    setCurrentPage(INITIAL_PAGE)
    setIsLoading(true)
    setRefreshing(false)
  }, [refetch])

  const dataOfILiked = headerTopTab.liked && state.posts

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.primary }]}
      edges={['top', 'left', 'right']}
    >
      <StatusBar
        animated={true}
        showHideTransition='fade'
        barStyle={'light-content'}
        backgroundColor={dominantColor ? `rgb(${dominantColor})` : colors.primary}
      />
      <FlatList
        ListHeaderComponent={HeaderComponent}
        data={verified ? dataAllPosts?.allPostsByUsername : dataOfILiked}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListFooterComponent={renderLoader}
        onEndReached={loadMoreItem}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            progressBackgroundColor={colors.primary}
            refreshing={refreshing}
            colors={[colors.colorThirdBlue]}
            onRefresh={onRefresh}
          />
        }
      />
    </SafeAreaView>
  )
}

export default UserScreen

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
})
