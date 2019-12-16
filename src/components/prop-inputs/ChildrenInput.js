import React from 'react'
import ObjectInput from './ObjectInput'

export default function ChildrenInput({ value, setEditItem }) {
  return <ObjectInput propName="children" value={value} setEditItem={setEditItem} valueType="jsx" />
}
