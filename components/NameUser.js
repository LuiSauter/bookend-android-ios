import React from 'react'
import { Text, StyleSheet, View } from 'react-native'
import { IconButton, useTheme } from 'react-native-paper'

const NameUser = ({ name, verified, fontSize, color = '' }) => {
  const { colors, dark } = useTheme()
  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.userTextName,
          { fontSize: fontSize, color: color !== '' ? colors.white : colors.text },
        ]}
      >
        {name}
      </Text>
      <Text>
        {verified && (
          <IconButton
            borderless={true}
            icon='checkmark-circle'
            style={{ padding: 0, margin: 0, borderRadius: 16 }}
            color={dark ? colors.white : colors.colorThirdBlue}
            size={fontSize + 4}
          />
        )}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { justifyContent: 'center', alignItems: 'center', flexDirection: 'row' },
  userTextName: {
    textAlignVertical: 'center',
    fontWeight: 'bold',
  },
})

export default NameUser
