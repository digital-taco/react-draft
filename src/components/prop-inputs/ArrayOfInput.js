import React from 'react'
import ArrayInput from './ArrayInput'

export default function ArrayOfInput({ type, ...props }) {
  const warnings = []
  return <ArrayInput warnings={warnings} {...props} />
}
