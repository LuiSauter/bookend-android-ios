import { useContext } from 'react'
import { ToggleContext } from '../context/ToggleContext'

export const useToggle = () => {
  const { showModal, handleModal } = useContext(ToggleContext)
  return { showModal, handleModal }
}
