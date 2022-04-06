import { StyleSheet, Text, View, Image, TouchableOpacity, Pressable } from 'react-native'
import React, { Fragment, memo, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useTheme } from 'react-native-paper'

import BtnFollow from '../Button/BtnFollow'
import NameUser from '../NameUser'
import { useAuth } from '../../hooks/useAuth'

const HeaderProfile = ({
  photo,
  verified,
  username,
  name,
  email,
  user,
  description,
  website,
  followers,
  userEmail,
  following,
  location,
  dominantColor,
  liked,
  headerTopTab,
}) => {
  const { colors } = useTheme()
  const navigation = useNavigation()
  const navigateToEditProfile = () => navigation.navigate('UpdateScreen')
  const { googleAuth } = useAuth()

  return (
    <Fragment>
      <View style={styles.profilePresentation}>
        <Image
          blurRadius={100}
          style={[styles.imageBackground, { tintColor: `rgb(${dominantColor})` }]}
          source={{ uri: photo }}
        />
        <Image
          style={[styles.profileImage, { borderColor: colors.primary }]}
          source={{ uri: photo }}
        />
      </View>
      <View style={{ marginHorizontal: 16, marginTop: 16 }}>
        <View style={styles.name}>
          <NameUser name={name} verified={verified} fontSize={20} />
          {userEmail !== email && <BtnFollow user={user} />}
          {userEmail === email && (
            <TouchableOpacity activeOpacity={0.7} onPress={navigateToEditProfile}>
              <Text style={[styles.edit, { borderColor: colors.text, color: colors.text }]}>
                Edit Profile
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={[styles.text, { color: colors.textGray, paddingBottom: 10 }]}>
          @{username}
        </Text>
        {description && (
          <Text style={[styles.text, { color: colors.text, marginBottom: 10 }]}>{description}</Text>
        )}
        <View style={styles.textPresentation}>
          <Text style={[styles.text, { color: colors.textGray }]}>
            📍{location ? location : '...'}
          </Text>
          <Text style={[styles.text, { color: colors.colorThirdBlue, marginLeft: 14 }]}>
            💻{website ? ` ${website}` : '...'}
          </Text>
        </View>
        <View style={styles.textPresentation}>
          <Text style={[styles.text, { marginRight: 16, color: colors.text }]}>
            {followers.length}
            <Text style={{ color: colors.textGray }}> Following</Text>
          </Text>
          <Text style={[styles.text, { color: colors.text }]}>
            {following.length}
            <Text style={{ color: colors.textGray }}> Followers</Text>
          </Text>
        </View>
      </View>
      {!verified && (
        <Fragment>
          <View style={[styles.tabNav, { borderBottomColor: colors.border }]}>
            {headerTopTab.liked && (
              <Pressable
                android_ripple={{ color: colors.colorUnderlay, borderless: true }}
                style={({ pressed }) => [
                  styles.tabNavButton,
                  { backgroundColor: pressed ? 'transparent' : 'transparent' },
                ]}
                onPress={() => console.log('xd')}
              >
                <View style={styles.tabNavBox}>
                  <Text style={[styles.tabNavText, { color: colors.text }]}>Me gusta</Text>
                  <View style={[styles.tabNavActive, { borderColor: colors.colorThirdBlue }]} />
                </View>
              </Pressable>
            )}
          </View>
          {liked.length === 0 && (
            <View style={styles.notPostFoundLiked}>
              {googleAuth.status === 'authenticated' && (
                <Text style={[styles.notFoundTitle, { color: colors.text }]}>
                  Publicaciones que te gustaron
                </Text>
              )}
              <Text style={[styles.notFoundResult, { color: colors.textGray }]}>
                {googleAuth.status === 'authenticated'
                  ? 'Cuando te haya gustado una publicación aparecera aquí.'
                  : 'Aún no le gustaron publicaciones.'}
              </Text>
            </View>
          )}
        </Fragment>
      )}
    </Fragment>
  )
}

export default memo(HeaderProfile)

const styles = StyleSheet.create({
  edit: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingBottom: 3,
    paddingTop: 4,
  },
  name: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 17,
  },
  profilePresentation: {
    alignItems: 'center',
    position: 'relative',
  },
  imageBackground: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: 100,
  },
  profileImage: {
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    marginTop: 50,
    height: 90,
    width: 90,
    marginHorizontal: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'cover',
    borderRadius: 50,
    position: 'relative',
  },
  textPresentation: { flex: 1, flexDirection: 'row', marginBottom: 10 },
  tabNav: {
    borderBottomWidth: 1,
    flexDirection: 'row',
  },
  tabNavButton: {
    textAlign: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  tabNavBox: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabNavText: {
    fontSize: 17,
    paddingBottom: 6,
  },
  tabNavActive: {
    borderWidth: 2,
    width: '90%',
    borderRadius: 100,
  },
  notPostFoundLiked: {
    paddingVertical: 24,
  },
  notFoundTitle: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    paddingBottom: 8,
  },
  notFoundResult: {
    fontSize: 18,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
})
