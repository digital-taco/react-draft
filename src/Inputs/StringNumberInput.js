import React from 'react'
import TextField from '@material-ui/core/TextField'

export default function StringNumberInput({
  type,
  propName,
  value = '',
  propObj,
  updatePropState,
}) {
  const { defaultValue, required } = propObj
  return (
    <TextField
      id={propName}
      label={propName}
      variant="outlined"
      defaultValue={defaultValue ? defaultValue.value : ''}
      value={value}
      required={required}
      margin="dense"
      type={type}
      onChange={e => updatePropState(propName, e.target.value)}
    />
  )
}
