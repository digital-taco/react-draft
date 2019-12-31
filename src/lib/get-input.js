import React from 'react'
import StringNumberInput from '../components/prop-inputs/StringNumberInput'
import BooleanInput from '../components/prop-inputs/BooleanInput'
import EnumInput from '../components/prop-inputs/EnumInput'
import ShapeInput from '../components/prop-inputs/ShapeInput'
import EditablePropInput from '../components/prop-inputs/EditablePropInput'

export default function getInput([propName, propObj], propStates, updatePropState) {
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
        propObj={propObj}
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
      <EditablePropInput
        propName={propName}
        value={propStates[propName]}
        valueType="object"
        description={propObj.description}
      />
    ),
    array: (
      <EditablePropInput
        propName={propName}
        value={propStates[propName]}
        valueType="array"
        description={propObj.description}
      />
    ),
    shape: (
      <ShapeInput
        propName={propName}
        value={propStates[propName]}
        propObj={propObj}
        valueType="object"
      />
    ),
    exact: (
      <ShapeInput
        propName={propName}
        value={propStates[propName]}
        propObj={propObj}
        valueType="object"
        strict
      />
    ),
    func: (
      <EditablePropInput
        propName={propName}
        value={propStates[propName]}
        propObj={propObj}
        valueType="function"
        description={propObj.description}
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
