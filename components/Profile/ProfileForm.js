import { StyleSheet, Text, View, TextInput, Image, TouchableHighlight } from 'react-native'
import React, { Fragment, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { Picker } from '@react-native-picker/picker'
import { useTheme } from 'react-native-paper'
import { useMutation } from '@apollo/client'

import { UPDATE_PROFILE } from '../../user/graphql-mutation'
import { ALL_USERS, FIND_USER, FIND_USER_BY_USER } from '../../user/graphql-queries'

const ProfileForm = ({
  name,
  username,
  photo,
  description,
  location,
  email,
  website,
  gender,
  id,
  user,
}) => {
  const { colors } = useTheme()
  const [error, setError] = useState('')
  const [profile, setProfile] = useState({
    name: name,
    username: username,
    photo: photo,
    description: description,
    location: location,
    email: email,
    website: website,
    gender: gender,
    id: id,
  })
  const navigation = useNavigation()

  const [updateProfile, { reset }] = useMutation(UPDATE_PROFILE, {
    refetchQueries: [
      { query: FIND_USER, variables: { email: email } },
      { query: FIND_USER_BY_USER, variables: { user: user } },
      { query: ALL_USERS },
    ],
  })

  const handleUpdate = () => {
    const filterState =
      profile.description !== '' &&
      profile.gender !== '' &&
      profile.name !== '' &&
      profile.photo !== '' &&
      profile.username !== ''

    if (filterState) {
      updateProfile({
        variables: {
          name: profile.name,
          username: profile.username,
          profile: profile.id,
          description: profile.description,
          gender: profile.gender,
          website: profile.website,
          location: profile.location,
        },
      })
      reset()
      navigation.navigate('TabNavigator')
    } else {
      setError(' es requerido')
    }
  }

  const textColor = { color: colors.text }
  const inputColor = { color: colors.text, backgroundColor: colors.secondary }
  const textError = (
    <Text style={{ color: `${colors.colorFourthRed}cc`, fontSize: 18 }}>{error}</Text>
  )

  return (
    <Fragment>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: photo }}
          resizeMode='cover'
          style={[styles.image, { borderColor: colors.textGray }]}
        />
      </View>
      <Text style={[styles.text, textColor]}>
        Nombre <Text style={{ color: colors.colorThirdBlue }}>*</Text>
        {profile.name === '' && textError}
      </Text>
      <TextInput
        placeholder='Write your name'
        placeholderTextColor={colors.textGray}
        value={profile.name}
        defaultValue={profile.name}
        onChangeText={nameTxt => setProfile(prev => ({ ...prev, name: nameTxt }))}
        style={[styles.input, inputColor]}
      />
      <Text style={[styles.text, textColor]}>
        Username <Text style={{ color: colors.colorThirdBlue }}>*</Text>
        {profile.username === '' && textError}
      </Text>
      <TextInput
        placeholder='Write a username'
        placeholderTextColor={colors.textGray}
        value={profile.username}
        defaultValue={profile.username}
        onChangeText={usernameTxt => setProfile(prev => ({ ...prev, username: usernameTxt }))}
        style={[styles.input, inputColor]}
      />
      <Text style={[styles.text, textColor]}>
        Descripción <Text style={{ color: colors.colorThirdBlue }}>*</Text>
        {profile.description && profile.description.length === 0 && textError}
      </Text>
      <TextInput
        placeholder='Write a description'
        placeholderTextColor={colors.textGray}
        value={profile.description}
        defaultValue={profile.description}
        multiline={true}
        onChangeText={descriptionTxt =>
          setProfile(prev => ({ ...prev, description: descriptionTxt }))
        }
        style={[styles.input, inputColor]}
      />
      <Text style={[styles.text, textColor]}>Email</Text>
      <TextInput
        placeholder={email}
        placeholderTextColor={colors.textGray}
        value={email}
        editable={false}
        style={[styles.input, inputColor, { opacity: 0.6 }]}
      />
      <Text style={[styles.text, textColor]}>
        Gender <Text style={{ color: colors.colorThirdBlue }}>*</Text>
      </Text>
      <Picker
        selectedValue={profile.gender}
        style={{ color: colors.text, marginBottom: 16 }}
        dropdownIconColor={colors.text}
        onValueChange={(itemValue, itemIndex) =>
          setProfile(prev => ({ ...prev, gender: itemValue }))
        }
      >
        <Picker.Item label='Male' value='male' />
        <Picker.Item label='Female' value='female' />
        <Picker.Item label='Otro' value='other' />
      </Picker>
      <Text style={[styles.text, textColor]}>
        Location <Text style={{ color: colors.colorThirdBlue }}>*</Text>
        {profile.location === '' && textError}
      </Text>
      <TextInput
        placeholder='Tokio, Japón'
        placeholderTextColor={colors.textGray}
        value={profile.location}
        defaultValue={profile.location}
        onChangeText={locationTxt => setProfile(prev => ({ ...prev, location: locationTxt }))}
        style={[styles.input, inputColor]}
      />
      <Text style={[styles.text, textColor]}>Website</Text>
      <TextInput
        placeholder={'Website'}
        placeholderTextColor={colors.textGray}
        value={profile.website}
        defaultValue={profile.website}
        onChangeText={websiteTxt => setProfile(prev => ({ ...prev, website: websiteTxt }))}
        style={[styles.input, inputColor]}
      />
      <Text style={[styles.text, { color: colors.textGray }]}>
        <Text style={{ color: colors.colorThirdBlue }}>* </Text>
        Fields required
      </Text>
      <TouchableHighlight
        activeOpacity={0.9}
        onPress={handleUpdate}
        style={{ marginVertical: 16, borderRadius: 10 }}
      >
        <Text
          style={[styles.submit, { backgroundColor: colors.colorThirdBlue, color: colors.white }]}
        >
          Actualizar
        </Text>
      </TouchableHighlight>
    </Fragment>
  )
}

export default ProfileForm

const styles = StyleSheet.create({
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 100,
    borderWidth: 3,
  },
  text: {
    fontSize: 17,
    paddingBottom: 10,
  },
  input: {
    fontSize: 16,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: '100%',
    marginBottom: 16,
  },
  submit: {
    borderRadius: 10,
    padding: 6,
    textAlign: 'center',
    fontSize: 20,
  },
})
