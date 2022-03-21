import React, { createContext, useState, useMemo, useCallback } from 'react'

export const ToggleContext = createContext({})

export const ToggleStateProvider = ({ children }) => {
  const [showModal, setShowModal] = useState(false)

  const handleModal = useCallback(() => setShowModal(!showModal), [showModal])
  const values = useMemo(() => ({ showModal, handleModal }), [showModal, handleModal])

  return <ToggleContext.Provider value={values}>{children}</ToggleContext.Provider>
}
