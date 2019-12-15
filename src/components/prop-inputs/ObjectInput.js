import React from 'react'
import { css } from '@emotion/core'
import Button from '../common/Button'
import InputLabel from '../common/InputLabel'

const styles = {
  objectContainer: css`
    width: 100%;
    position: relative;
    box-sizing: border-box;
  `,
}

export default function ObjectInput({ propName, value, warnings = [], setEditItem, valueType }) {
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
