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
  const { setEditItem, editItem } = useContext(EditDrawerContext)

  function handleSetEditItem() {
    if (editItem && editItem.propName === propName) {
      setEditItem(null)
    } else {
      setEditItem({
        propName,
        value,
        warnings,
        valueType,
      })
    }
  }

  return (
    <PropInputBase propName={propName} type={type} description={description}>
      <Button
        variant="text"
        secondary={editItem && editItem.propName === propName}
        dense
        // maxWidth
        onClick={handleSetEditItem}
      >
        {editItem && editItem.propName === propName ? 'Stop Editing' : 'Edit'}
      </Button>
    </PropInputBase>
  )
}
