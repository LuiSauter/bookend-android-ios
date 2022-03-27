import { useContext } from 'react'
import { ToggleContext } from '../context/ToggleContext'

export const useToggle = () => {
  const { toggleTheme, isThemeDark, toggleModal, showModal, handleChangeWord, word } =
    useContext(ToggleContext)
  return { toggleTheme, isThemeDark, toggleModal, showModal, handleChangeWord, word }
}
