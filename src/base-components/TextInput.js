import React from 'react'
/** @jsx jsx */
import { css, jsx } from '@emotion/core'

const inputCss = css`
  appearance: none;
  padding: 8px;
  font-size: 16px;
  border: none;
  width: 100%;
  box-sizing: border-box;
  border-radius: 3px;
  background-color: var(--color-background-highlight);
  color: var(--color-text);
`

export default function TextInput(props) {
  return (
    <input css={inputCss} {...props} />
  )
}
