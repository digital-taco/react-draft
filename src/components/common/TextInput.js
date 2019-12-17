import React from 'react'
import { css } from '@emotion/core'

const inputCss = css`
  appearance: none;
  padding: 8px;
  font-size: 16px;
  border: none;
  width: 100%;
  box-sizing: border-box;
  border-radius: 2px;
  background-color: var(--color-text);
  color: var(--color-background-secondary);
`

export default function TextInput(props) {
  return <input css={inputCss} {...props} />
}
