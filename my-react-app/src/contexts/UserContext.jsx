import React, { createContext, useState, useEffect } from 'react'
import customFetch from '../../../utils/CustomFetch'
export const UserContext = createContext({})

export const UserContextProvider = ({ children }) => {
  const [loggingUsername, setLoggingUsername] = useState(null)
  const [loggingId, setLoggingId] = useState(null)

  useEffect(() => {
    const fetchChatPage = async () => {
      const { data } = await customFetch('/chatPage')
      setLoggingId(data.userId)
      setLoggingUsername(data.username)
      return
    }
    fetchChatPage()
    localStorage.setItem('username', loggingUsername)
    localStorage.setItem('userId', loggingId)
  }, [loggingUsername, loggingId])

  return (
    <UserContext.Provider
      value={{ loggingUsername, setLoggingUsername, loggingId, setLoggingId }}
    >
      {children}
    </UserContext.Provider>
  )
}
