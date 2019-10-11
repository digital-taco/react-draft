import React from 'react'
import ObjectInput from './ObjectInput'

export default function NodeInput({ propName, value, setEditItem }) {
  return <ObjectInput propName={propName} value={value} setEditItem={setEditItem} isJSXValue />
}
