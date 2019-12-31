import React from 'react'
import InputLabel from '../common/InputLabel'

export default function PropInputBase({ propName, type, description, children }) {
  return (
    <div>
      <InputLabel htmlFor={propName} label={propName} metaText={type} title={description} />
      {children}
    </div>
  )
}
