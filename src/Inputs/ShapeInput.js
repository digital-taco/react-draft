import React from 'react'
import ObjectInput from './ObjectInput'

export default function ShapeInput({ propObj, strict, ...props }) {
  const shapeProperties = propObj.type.value
  let warnings = []
  if (props && props.value) {
    warnings = Object.entries(shapeProperties)
      .filter(entry => {
        return !props.value[entry[0]]
      })
      .map(
        ([property, value]) =>
          `• Missing ${value.required ? 'required ' : ''}property: ${property} (${value &&
            value.name})`
      )

    if (strict) {
      warnings = warnings.concat(
        Object.keys(props.value)
          .filter(key => {
            return !propObj.type.value[key]
          })
          .map(key => {
            return `• Property not allowed: ${key}`
          })
      )
    }
  }

  return <ObjectInput {...props} warnings={warnings} />
}
