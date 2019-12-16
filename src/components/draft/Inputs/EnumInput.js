import React from 'react'
import InputLabel from '../../common/InputLabel'
import Select from '../../common/Select'
import { removeQuotes } from '../../../lib/helpers'

export default function EnumInput({ propName, value, propObj, updatePropState }) {
  return (
    <>
      <InputLabel htmlFor={propName} label={propName} metaText="one of" />
      <Select value={value || ''} onChange={e => updatePropState(propName, e.target.value)}>
        {propObj.type.value.map((option, index) => {
          const trimmed = removeQuotes(option.value)
          return <option key={`options_${index}`} value={trimmed}>{trimmed || undefined}</option>
        })}
      </Select>
    </>
  )
}
