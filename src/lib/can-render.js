export default function canRender(props = {}, propStates = {}) {
  if (!propStates || !props) return false

  const allHaveValues = Object.entries(props).every(([propName, propObj]) => {
    // If they don't have a propType for the prop, let it pass anyway
    if (!propObj.type) {
      return true
    }

    if (propObj.type.name === 'shape' || propObj.type.name === 'exact') {
      // If it isn't required, it's good to go
      if (!propObj.required) return true

      // Otherwise, check all values on the object to see if they have a value
      return Object.entries(propObj.type.value).every(([subPropName, subPropObj]) => {
        // If it isn't required, it's good to go
        if (!subPropObj.required) return true
        // If it is required, but the object isn't defined, das bad
        if (!propStates[propName]) return false
        // Check if the prop's property has a value
        return propStates[propName][subPropName]
      })
    }

    return !propObj.required || propStates[propName]
  })

  const noRequiredProps = Object.entries(props).length === 0
  return propStates && (noRequiredProps || allHaveValues)
}
