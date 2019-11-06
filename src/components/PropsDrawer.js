import React from 'react'
/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import amber from '@material-ui/core/colors/amber'
import Button from '../base-components/Button'
import getInput from '../lib/get-input'
// import ChildrenInput from '../Inputs/ChildrenInput'
import ErrorBox from './ErrorBox'
import { H1 } from '../base-components/Headers'

const styles = {
  propsContainer: css`
    min-width: 250px;
    box-sizing: border-box;
    display: grid;
    grid-row-gap: 8px;
    overflow-y: scroll;
    max-height: 100%;

    & .MuiFormControl-root {
      width: 100%;
      margin-top: 8px;
      margin-bottom: 4px;
    }

    & .Mui-required:not(.MuiFormLabel-filled) {
      color: ${amber[900]};
    }
  `,
  propsDrawer: css`
    display: flex;
    flex-direction: column;
  `,
  resetButton: css`
    margin-top: 24px;
  `,
}

export default function PropsDrawer({
  propObjects,
  propStates,
  open,
  setEditItem,
  updatePropState,
  resetToDefaults,
  SelectedComponent,
}) {
  if (!propObjects) return null

  const entries = Object.entries(propObjects)
  const inputs = entries.reduce(
    (acc, [propName, propInfo]) => {
      if (!propInfo) return acc
      if (!propInfo.type) {
        acc.missingPropTypes.push([propName, propInfo])
        return acc
      }
      if (!acc[propInfo.type.name]) acc[propInfo.type.name] = []
      acc[propInfo.type.name].push([propName, propInfo])
      return acc
    },
    {
      missingPropTypes: [],
    }
  )

  const style = {
    display: open ? 'block' : 'none',
  }

  function getInputProp(entry) {
    return getInput(entry, propStates, updatePropState, setEditItem)
  }

  return (
    <>
      <H1>{SelectedComponent.meta.displayName} Props</H1>
      <div css={styles.propsDrawer} style={style} className="demo-font">
        <div css={styles.propsContainer}>
          {/* <ChildrenInput value={propStates.children} setEditItem={setEditItem} /> */}
          {inputs.string && inputs.string.map(getInputProp)}
          {inputs.number && inputs.number.map(getInputProp)}
          {inputs.enum && inputs.enum.map(getInputProp)}
          {inputs.object && inputs.object.map(getInputProp)}
          {inputs.array && inputs.array.map(getInputProp)}
          {inputs.shape && inputs.shape.map(getInputProp)}
          {inputs.exact && inputs.exact.map(getInputProp)}
          {inputs.func && inputs.func.map(getInputProp)}
          {inputs.bool && inputs.bool.map(getInputProp)}

          {/* MISSING PROP TYPES */}
          {inputs.missingPropTypes.map(([propName]) => (
            <ErrorBox label={propName} error="Missing PropType" />
          ))}

          <div css={styles.resetButton}>
            <Button size="small" color="primary" onClick={resetToDefaults}>
              Reset to Defaults
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
//
