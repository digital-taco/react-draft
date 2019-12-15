import React from 'react'
import Checkbox from '../../common/Checkbox'

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
