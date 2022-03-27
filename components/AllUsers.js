import React from 'react'
import { FlatList, ActivityIndicator } from 'react-native'
import { useQuery } from '@apollo/client'
import { useTheme } from '@react-navigation/native'

import { ALL_USERS } from '../user/graphql-queries'
import ResultUser from '../components/Search/ResultUser'

const renderItem = ({ item }) => (
  <ResultUser
    name={item.name}
    username={item.username}
    user={item.user}
    email={item.email}
    photo={item.photo}
    verified={item.verified}
  />
)

const keyExtractor = item => item.user.toString()

const AllUsers = () => {
  const { data, loading } = useQuery(ALL_USERS)
  const { colors } = useTheme()
  return loading ? (
    <ActivityIndicator style={{ flex: 1 }} color={colors.colorThirdBlue} size='large' />
  ) : (
    <FlatList data={data?.allUsers} renderItem={renderItem} keyExtractor={keyExtractor} />
  )
}

export default AllUsers
