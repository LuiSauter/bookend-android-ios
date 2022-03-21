import React from 'react'
import { StyleSheet, Text, View, Pressable } from 'react-native'
import { useNavigation, useTheme } from '@react-navigation/native'
import { IconButton } from 'react-native-paper'
import BtnLike from './Button/BtnLike'

// import BtnLike from './Button/BtnLike'

const MultipleButtons = ({ id, bookUrl, title }) => {
  const { colors } = useTheme()
  const navigation = useNavigation()
  return (
    <View style={styles.btnContainer}>
      <Pressable
        android_ripple={{
          color: `${colors.colorThirdPurple}33`,
          borderless: true,
          radius: 22,
        }}
        onPress={() => console.log('xd')}
        style={({ pressed }) => [{ backgroundColor: pressed ? 'transparent' : 'transparent' }]}
      >
        <IconButton
          icon='share-social'
          backgroundColor='transparent'
          borderRadius={50}
          color={colors.textGray}
          size={22}
          iconStyle={{ marginRight: 0 }}
          underlayColor='transparent'
        />
      </Pressable>
      <Pressable
        android_ripple={{
          color: `${colors.colorThirdYellow}33`,
          borderless: true,
          radius: 22,
        }}
        onPress={() => console.log('xd')}
        style={({ pressed }) => [
          { backgroundColor: pressed ? 'transparent' : 'transparent', flexDirection: 'row' },
        ]}
      >
        <IconButton
          icon='chatbubble-outline'
          backgroundColor='transparent'
          borderRadius={50}
          color={colors.textGray}
          size={22}
          iconStyle={{ marginRight: 0 }}
          underlayColor='transparent'
        />
        {/* <Text style={[styles.text, { color: colors.textGray, marginLeft: 5 }]}>0</Text> */}
      </Pressable>
      <BtnLike id={id} />
      <Pressable
        android_ripple={{
          color: `${colors.colorFourthRed}44`,
          borderless: true,
          radius: 22,
        }}
        style={({ pressed }) => [
          { backgroundColor: pressed ? 'transparent' : 'transparent', flexDirection: 'row' },
        ]}
        onPress={() => navigation.navigate('PdfScreen', { bookUrl, title })}
      >
        <Text style={[styles.text, { color: colors.textGray }]}>PDF</Text>
      </Pressable>
    </View>
  )
}

export default MultipleButtons

const styles = StyleSheet.create({
  btnContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 10,
  },
  btn: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
  },
})
