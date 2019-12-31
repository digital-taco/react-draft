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
  const { required, description } = propObj
  return (
    <PropInputBase propName={propName} type={type} description={description}>
      <TextInput
        id={propName}
        label={propName}
        value={value}
        required={required}
        type={type}
        onChange={e =>
          updatePropState(propName, type === 'number' ? +e.target.value : e.target.value)
        }
      />
    </PropInputBase>
  )
}
