import React from 'react'
import StringNumberInput from '../Inputs/StringNumberInput'
import BooleanInput from '../Inputs/BooleanInput'
import EnumInput from '../Inputs/EnumInput'
import ObjectInput from '../Inputs/ObjectInput'
import ShapeInput from '../Inputs/ShapeInput'

export default function getInput([propName, propObj], propStates, updatePropState, setEditItem) {
  const inputMap = {
    string: (
      <StringNumberInput
        updatePropState={updatePropState}
        propName={propName}
        propObj={propObj}
        value={propStates[propName]}
        type="string"
      />
    ),
    number: (
      <StringNumberInput
        updatePropState={updatePropState}
        propName={propName}
        propObj={propObj}
        value={propStates[propName]}
        type="number"
      />
    ),
    bool: (
      <BooleanInput
        updatePropState={updatePropState}
        propName={propName}
        value={propStates[propName]}
      />
    ),
    enum: (
      <EnumInput
        updatePropState={updatePropState}
        propName={propName}
        propObj={propObj}
        value={propStates[propName]}
      />
    ),
    object: (
      <ObjectInput propName={propName} value={propStates[propName]} setEditItem={setEditItem} />
    ),
    array: (
      <ObjectInput propName={propName} value={propStates[propName]} setEditItem={setEditItem} />
    ),
    shape: (
      <ShapeInput
        propName={propName}
        value={propStates[propName]}
        propObj={propObj}
        setEditItem={setEditItem}
      />
    ),
    exact: (
      <ShapeInput
        propName={propName}
        value={propStates[propName]}
        propObj={propObj}
        setEditItem={setEditItem}
        strict
      />
    ),
  }

  const isMissingRequired = propObj.required && !propStates[propName]

  return (
    <div key={propName} data-required={isMissingRequired}>
      {inputMap[propObj.type.name] || propName}
    </div>
  )
}
