import React, { useContext } from 'react'
import { css } from '@emotion/core'
import getInput from '../../lib/get-input'
import { SelectedContext } from '../contexts/SelectedContext'
import ResetIcon from '../icons/ResetIcon'
import IconButton from '../common/IconButton'
import { EditDrawerContext } from '../contexts/EditDrawerContext'

const propsDrawerCss = css`
  padding: 0 16px 0 16px;
  position: relative;
`

const styles = {
  propsContainer: css`
    display: grid;
    grid-row-gap: 8px;
  `,
  propsDrawer: css`
    overflow-y: scroll;
    height: 100%;
  `,
}

const propsTitleCss = css`
  position: absolute;
  top: -32px;
  right: 0;
`

const noPropsCss = css`
  font-size: 12px;
  padding: 32px 0;
  text-align: center;
  text-transform: uppercase;
`

export default function PropsDrawer({ propObjects }) {
  if (!propObjects) return <div css={noPropsCss}>No props available</div>

  const { propStates, resetToDefaults, updatePropState } = useContext(SelectedContext)

  const { setEditItem } = useContext(EditDrawerContext)

  // This guarantees that all components have a children prop input (does not override defined prop types for children)
  if (!propObjects.children) {
    propObjects.children = {
      type: {
        name: 'node',
      },
    }
  }

  const entries = Object.entries(propObjects)

  const inputs = entries.reduce(
    (acc, [propName, propInfo]) => {
      if (!propInfo) return acc

      // collect missing prop types
      if (!propInfo.type) {
        acc.missingPropTypes.push([propName, propInfo])
        return acc
      }

      // create empty array for the type if it does not exist
      if (!acc[propInfo.type.name]) acc[propInfo.type.name] = []

      // push it to its type on the acc
      acc[propInfo.type.name].push([propName, propInfo])
      return acc
    },
    {
      missingPropTypes: [],
    }
  )

  function getInputProp(entry) {
    return getInput(entry, propStates, updatePropState)
  }

  function handleResetToDefaults() {
    resetToDefaults()
    setEditItem(null)
  }

  return (
    <div css={propsDrawerCss}>
      <div css={propsTitleCss}>
        <IconButton
          title="Reset all props to default values"
          Icon={ResetIcon}
          onClick={handleResetToDefaults}
        />
      </div>
      <div css={styles.propsDrawer} className="demo-font">
        <div css={styles.propsContainer}>
          {inputs.node && inputs.node.map(getInputProp)}
          {inputs.string && inputs.string.map(getInputProp)}
          {inputs.number && inputs.number.map(getInputProp)}
          {inputs.enum && inputs.enum.map(getInputProp)}
          {inputs.object && inputs.object.map(getInputProp)}
          {inputs.array && inputs.array.map(getInputProp)}
          {inputs.shape && inputs.shape.map(getInputProp)}
          {inputs.exact && inputs.exact.map(getInputProp)}
          {inputs.func && inputs.func.map(getInputProp)}
          {inputs.bool && inputs.bool.map(getInputProp)}
          {inputs.custom && inputs.custom.map(getInputProp)}
        </div>
      </div>
    </div>
  )
}
