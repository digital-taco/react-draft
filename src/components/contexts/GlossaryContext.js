import React, { createContext, useEffect, useState } from 'react'

export const GlossaryContext = createContext()

export default function GlossaryProvider({ children }) {
  const [glossary, setGlossary] = useState(null)

  useEffect(() => {
    const socket = new WebSocket(`ws://${window.location.hostname}:7999`)

    socket.addEventListener('message', ({ data }) => {
      if (process.env.DEBUG) console.log('[WEB SOCKET] Glossary Received', JSON.parse(data))
      setGlossary(JSON.parse(data))
    })
  }, [])

  return (
    <GlossaryContext.Provider value={glossary}>{glossary && children}</GlossaryContext.Provider>
  )
}
