import React from 'react'
/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import Button from '../base-components/Button'
import InputLabel from '../base-components/InputLabel'

const styles = {
  objectContainer: css`
    width: 100%;
    position: relative;
    box-sizing: border-box;
  `,
}

export default function FunctionInput({ propName, value, warnings = [], setEditItem, valueType }) {
  return (
    <div css={styles.objectContainer}>
      <InputLabel label={propName} metaText={valueType || 'object'} />
      <Button
        variant="text"
        dense
        onClick={() =>
          setEditItem({
            propName,
            value,
            warnings,
            valueType,
          })
        }
      >
        Edit
      </Button>
    </div>
  )
}
