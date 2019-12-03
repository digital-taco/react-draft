import React from 'react'
import InputLabel from '../base-components/InputLabel'
import Select from '../base-components/Select'
import { removeQuotes } from '../lib/helpers'

export default function EnumInput({ propName, value, propObj, updatePropState }) {
  return (
    <>
      <InputLabel htmlFor={propName} label={propName} metaText="one of" />
      <Select value={value || ''} onChange={e => updatePropState(propName, e.target.value)}>
        {propObj.type.value.map(option => {
          const trimmed = removeQuotes(option.value)
          return <option value={trimmed}>{trimmed || undefined}</option>
        })}
      </Select>
    </>
  )
}
