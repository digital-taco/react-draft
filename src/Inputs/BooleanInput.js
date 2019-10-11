import React from 'react'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'

export default function BooleanInput({ propName, value, updatePropState }) {
  return (
    <FormControlLabel
      control={
        <Checkbox checked={value} onChange={e => updatePropState(propName, e.target.checked)} />
      }
      label={propName}
    />
  )
}
