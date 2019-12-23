import React from 'react'
import TextInput from '../common/TextInput'
import PropInputBase from './PropInputBase'

export default function StringNumberInput({
  type,
  propName,
  value = '',
  propObj,
  updatePropState,
}) {
  const { required } = propObj
  return (
    
    <PropInputBase propName={propName} type={type}>
      <TextInput
        id={propName}
        label={propName}
        value={value}
        required={required}
        type={type}
        onChange={e => updatePropState(propName, e.target.value)}
      />
    </PropInputBase>
  )
}
