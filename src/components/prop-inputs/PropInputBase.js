import React from 'react'
import InputLabel from '../common/InputLabel'

export default function PropInputBase({ propName, type, children }) {
  return (
    <div>
      <InputLabel htmlFor={propName} label={propName} metaText={type} />
      {children}
    </div>
  )
}
