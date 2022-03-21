import { useContext } from 'react'
import { DarkContext } from '../context/DarkContext'

export const useDarkMode = () => {
  const { toggleTheme, isThemeDark } = useContext(DarkContext)
  return { toggleTheme, isThemeDark }
}
