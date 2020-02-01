import React from 'react'
import { css } from '@emotion/core'
import { boolAttr } from '../../lib/helpers'

const buttonCss = css`
  appearance: none;
  text-transform: uppercase;
  color: white;
  font-weight: bold;
  background-color: var(--color-primary);
  padding: 12px 16px;
  border: none;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.1s ease-out;
  display: flex;
  align-items: center;

  &[secondary] {
    background-color: var(--color-button-secondary);
  }
  &[secondary]:hover {
    background-color: var(--color-button-secondary-hover);
  }

  &[dense] {
    padding: 8px 16px;
  }

  &[maxwidth] {
    width: 100%;
    text-align: center;
    display: block;
  }

  & > svg {
    margin-left: 16px;
  }

  &:hover {
    background-color: var(--color-primary-hover);
  }
  &:focus {
    outline: none;
  }
  &:active {
    opacity: 0.8;
  }
`
export default function Button({ children, dense, secondary, maxWidth, ...props }) {
  return (
    <button
      type="button"
      dense={boolAttr(dense)}
      maxwidth={boolAttr(maxWidth)}
      secondary={boolAttr(secondary)}
      css={buttonCss}
      {...props}
    >
      {children}
    </button>
  )
}
