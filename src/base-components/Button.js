import React from 'react'
/** @jsx jsx */
import { css, jsx } from '@emotion/core'

const buttonCss = dense => css`
  appearance: none;
  text-transform: uppercase;
  color: var(--color-text-hover);
  font-weight: bold;
  background-color: var(--color-background-highlight);
  padding: ${dense ? '8px 16px' : '12px 16px'};
  border-radius: 4px;
  border: none;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.1s ease-out;
  display: flex;
  align-items: center;

  & > svg {
    margin-left: 16px;
  }

  &:hover {
    background-color: var(--color-background-highlight2);
  }
  &:focus {
    outline: none;
  }
  &:active {
    opacity: 0.8;
  }
`

export default function Button({ children, dense, ...props }) {
  return (
    <button type="button" css={buttonCss(dense)} {...props}>
      {children}
    </button>
  )
}
