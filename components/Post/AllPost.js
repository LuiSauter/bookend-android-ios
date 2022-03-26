import React, { useState, useEffect, useRef } from 'react'
import { FlatList, ActivityIndicator, RefreshControl } from 'react-native'
import { useLazyQuery, useQuery } from '@apollo/client'
import { useTheme } from 'react-native-paper'

import { ALL_POSTS, ALL_POSTS_COUNT } from '../../post/graphql-queries'
import AllPostItem from './AllPostItem'

const INITIAL_PAGE = 8
const ITEM_HEIGHT = 600

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

const getItemLayout = (data, index) => ({
  length: ITEM_HEIGHT,
  offset: ITEM_HEIGHT * data.length,
  index,
})

const keyExtractor = item => item.id.toString()

const AllPost = ({ scrollTop, scrollToTop }) => {
  const { colors } = useTheme()
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(INITIAL_PAGE)
  const [refreshing, setRefreshing] = useState(false)
  const ref = useRef(null)

  const [getAllPost, { data, refetch }] = useLazyQuery(ALL_POSTS)
  const { data: allPostsCount } = useQuery(ALL_POSTS_COUNT)

  useEffect(() => {
    let cleanup = true
    if (cleanup) {
      // setCurrentPage(INITIAL_PAGE)
      getAllPost({ variables: { pageSize: INITIAL_PAGE, skipValue: 0 } })
    }
    return () => (cleanup = false)
  }, [getAllPost])

  useEffect(() => {
    let cleanup = true
    if (cleanup) {
      if (currentPage === INITIAL_PAGE) {
        return
      }
      refetch({ pageSize: currentPage, skipValue: 0 })
    }
    return () => {
      cleanup = false
    }
  }, [currentPage, refetch])

  useEffect(() => {
    let cleanup = true
    if (cleanup) {
      if (scrollTop) {
        ref.current?.scrollToOffset({ offset: -100 })
        scrollToTop()
      }
    }
    return () => {
      cleanup = false
    }
  }, [scrollToTop, scrollTop])

  const renderLoader = () => {
    return (
      isLoading && (
        <ActivityIndicator
          style={{
            marginBottom: 16,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          animating={true}
          color={colors.colorThirdBlue}
          size='small'
        />
      )
    )
  }

  const loadMoreItem = () => {
    if (allPostsCount && allPostsCount?.postCount === data?.allPosts.length) {
      return setIsLoading(false)
    }
    setCurrentPage(currentPage + INITIAL_PAGE)
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await refetch({ pageSize: INITIAL_PAGE, skipValue: 0 })
    setCurrentPage(INITIAL_PAGE)
    setIsLoading(true)
    setRefreshing(false)
  }

  return (
    <FlatList
      data={data?.allPosts}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ref={ref}
      // ListHeaderComponent={() =>
      //   loading && (
      //     <ActivityIndicator
      //       style={{ flex: 1, paddingTop: 24, paddingBottom: 16 }}
      //       color={colors.colorThirdBlue}
      //       size='large'
      //     />
      //   )
      // }
      ListFooterComponent={renderLoader}
      onEndReached={loadMoreItem}
      getItemLayout={getItemLayout}
      initialNumToRender={INITIAL_PAGE}
      onEndReachedThreshold={1.5}
      removeClippedSubviews={true}
      refreshControl={
        <RefreshControl
          progressBackgroundColor={colors.primary}
          refreshing={refreshing}
          colors={[colors.colorThirdBlue]}
          onRefresh={onRefresh}
        />
      }
    />
  )
}

export default AllPost
