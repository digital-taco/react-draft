import React from 'react'
import Toggle from '../common/Toggle'

export default function BooleanInput({ propName, value = '', updatePropState }) {
  return (
    <Toggle
      label={propName}
      checked={value}
      onChange={e => updatePropState(propName, e.target.checked)}
      id={propName}
    />
  )
}
