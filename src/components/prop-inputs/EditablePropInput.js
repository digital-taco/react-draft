import React, { useContext } from 'react'
import PropInputBase from './PropInputBase'
import Button from '../common/Button'
import { EditDrawerContext } from '../contexts/EditDrawerContext'

export default function EditablePropInput({
  propName,
  description,
  type,
  value,
  warnings = [],
  valueType,
}) {
  const { setEditItem } = useContext(EditDrawerContext)

  return (
    <PropInputBase propName={propName} type={type} description={description}>
      <Button
        variant="text"
        dense
        onClick={() => {
          setEditItem({
            propName,
            value,
            warnings,
            valueType,
          })
        }}
      >
        Edit
      </Button>
    </PropInputBase>
  )
}
