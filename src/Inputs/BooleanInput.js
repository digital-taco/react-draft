import React from 'react'
import Checkbox from '../base-components/Checkbox'

export default function BooleanInput({ propName, value = '', updatePropState }) {
  return (
    <Checkbox
      label={propName}
      checked={value}
      onChange={e => updatePropState(propName, e.target.checked)}
      id={propName}
    />
  )
}
