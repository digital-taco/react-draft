import React from 'react'
import TextInput from '../base-components/TextInput'
import InputLabel from '../base-components/InputLabel'

export default function StringNumberInput({
  type,
  propName,
  value = '',
  propObj,
  updatePropState,
}) {
  const { required } = propObj
  return (
    <>
      <InputLabel htmlFor={propName} label={propName} metaText={type} />
      <TextInput
        id={propName}
        label={propName}
        value={value}
        required={required}
        type={type}
        onChange={e => updatePropState(propName, e.target.value)}
      />
    </>
  )
}
