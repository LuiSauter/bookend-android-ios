import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ActivityIndicator, useTheme } from 'react-native-paper'

const Loading = ({ label = '', size = 'small', indicator = false }) => {
  const { colors } = useTheme()
  return (
    <View style={styles.loadView}>
      {indicator && (
        <ActivityIndicator
          style={styles.loading}
          animating={true}
          color={colors.colorThirdBlue}
          size={size}
        />
      )}
      {label !== '' && <Text style={[styles.label, { color: colors.textGray }]}>{label}</Text>}
    </View>
  )
}

export default Loading

const styles = StyleSheet.create({
  loadView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  label: {
    fontSize: 20,
    paddingLeft: 16,
  },
})
