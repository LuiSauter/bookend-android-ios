import React, { useCallback, useEffect, useState, useRef } from 'react'
import { RefreshControl, StyleSheet, ActivityIndicator, FlatList } from 'react-native'
import { useLazyQuery, useQuery } from '@apollo/client'
import { useTheme } from '@react-navigation/native'

import { ALL_POSTS_COUNT, ALL_POST_RANKING } from '../../post/graphql-queries'
import AllPostRankItem from './AllPostRankItem'

const INITIAL_PAGE = 8
const ITEM_HEIGHT = 270

const renderItem = ({ item }) => (
  <AllPostRankItem
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

const keyExtractor = item => item.id.toString()

const getItemLayout = (data, index) => ({
  length: ITEM_HEIGHT,
  offset: ITEM_HEIGHT * index,
  index,
})

const AllPostRanking = ({ scrollTop, scrollToTop }) => {
  const { colors } = useTheme()
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(INITIAL_PAGE)
  const [refreshing, setRefreshing] = useState(false)
  const ref = useRef(null)
  const [getAllPostRank, { data, refetch }] = useLazyQuery(ALL_POST_RANKING)
  const { data: allPostsCount } = useQuery(ALL_POSTS_COUNT)

  useEffect(() => {
    let cleanup = true
    if (cleanup) {
      getAllPostRank({ variables: { pageSize: INITIAL_PAGE, skipValue: 0 } })
    }
    return () => (cleanup = false)
  }, [getAllPostRank])

  useEffect(() => {
    let cleanup = true
    if (cleanup) {
      if (currentPage !== INITIAL_PAGE) {
        refetch({ pageSize: currentPage, skipValue: 0 })
      }
    }
    return () => (cleanup = false)
  }, [currentPage, refetch])

  useEffect(() => {
    let cleanup = true
    if (cleanup) {
      if (scrollTop) {
        ref.current?.scrollToOffset({ offset: -100 })
        scrollToTop()
      }
    }
    return () => (cleanup = false)
  }, [scrollToTop, scrollTop])

  const renderLoader = () => {
    return (
      isLoading && (
        <ActivityIndicator
          style={{ flex: 1, marginVertical: 16, width: '100%' }}
          color={colors.colorThirdBlue}
          size='small'
        />
      )
    )
  }
  const loadMoreItem = useCallback(() => {
    if (allPostsCount && allPostsCount?.postCount === data?.allPostRanking.length) {
      return setIsLoading(false)
    }
    setCurrentPage(currentPage + INITIAL_PAGE)
  }, [allPostsCount, currentPage, data?.allPostRanking.length])

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await refetch({ pageSize: INITIAL_PAGE, skipValue: 0 })
    setCurrentPage(INITIAL_PAGE)
    setIsLoading(true)
    setRefreshing(false)
  }, [refetch])

  return data?.allPostRanking ? (
    <FlatList
      data={data?.allPostRanking}
      ref={ref}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ListFooterComponent={renderLoader}
      onEndReached={loadMoreItem}
      getItemLayout={getItemLayout}
      initialNumToRender={INITIAL_PAGE}
      onEndReachedThreshold={1.5}
      removeClippedSubviews={true}
      numColumns={2}
      columnWrapperStyle={styles.column}
      refreshControl={
        <RefreshControl
          progressBackgroundColor={colors.primary}
          refreshing={refreshing}
          colors={[colors.colorThirdBlue]}
          onRefresh={onRefresh}
        />
      }
    />
  ) : (
    <ActivityIndicator
      style={{ flex: 1, width: '100%', height: '100%' }}
      color={colors.colorThirdBlue}
      size='large'
    />
  )
}

export default AllPostRanking

const styles = StyleSheet.create({
  column: {
    display: 'flex',
    justifyContent: 'space-evenly',
  },
})
