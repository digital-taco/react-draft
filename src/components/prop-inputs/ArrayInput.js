import React from 'react'
import { css } from '@emotion/core'

const styles = {
  arrayInput: css`
    border: solid 1px rgba(0, 0, 0, 0.12);
    border-radius: 4px;
  `,
}

export default function ArrayInput({ propName, array, propObj, setEditItem }) {
  return (
    <div css={styles.arrayInput}>
      {array.map(item => (
        <div>{item}</div>
      ))}
    </div>
  )
}
