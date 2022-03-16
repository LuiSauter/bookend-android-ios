/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect } from 'react'
import { Text, View } from 'react-native'

const App = () => {
  const [first, setfirst] = useState('')
  useEffect(() => {
    let cleanup = true
    cleanup && setfirst('Hello World')
    return () => {
      cleanup = false
    }
  }, [])

  return (
    <View style={{ backgroundColor: '#022', flex: 1 }}>
      <Text>{first}</Text>
    </View>
  )
}

export default App
