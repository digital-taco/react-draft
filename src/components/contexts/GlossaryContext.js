import React, { createContext, useEffect, useState } from 'react'

export const GlossaryContext = createContext()

export default function GlossaryProvider({ children }) {
  const [glossary, setGlossary] = useState(null)
  const [tree, setTree] = useState(null)

  useEffect(() => {
    const socket = new WebSocket(`ws://${window.location.hostname}:7999`)

    socket.addEventListener('message', ({ data }) => {
      if (process.env.DEBUG || process.env.VERBOSE)
        console.log('[WEB SOCKET] Glossary Received', JSON.parse(data))
      const glossaryData = JSON.parse(data)

      if (!glossaryData.glossary) {
        console.error('There was an issue retrieving the component glossary')
      }
      if (!glossaryData.tree) {
        console.error('There was an issue retrieving the component tree')
      }
      setGlossary(glossaryData.glossary)
      setTree(glossaryData.tree)
    })
  }, [])

  return (
    <GlossaryContext.Provider value={{ glossary, tree }}>
      {glossary && tree && children}
    </GlossaryContext.Provider>
  )
}
