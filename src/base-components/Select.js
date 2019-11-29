import React from 'react'
/** @jsx jsx */
import { css, jsx } from '@emotion/core'

const selectWrapperCss = css`
  &::after {
    content: '';
    border: solid white;
    border-width: 0 3px 3px 0;
    display: inline-block;
    padding: 3px;
    transform: rotate(45deg);
    position: absolute;
    right: 12px;
    top: calc(50% - 6px);
  }
`

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

export default function Select({ children, value, ...props }) {
  return (
    <div style={{ position: 'relative' }}>
      <div css={selectWrapperCss}>
        <select css={inputCss} value={value} {...props}>
          {children}
        </select>
      </div>
    </div>
  )
}