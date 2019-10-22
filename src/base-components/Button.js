import React from 'react'
/** @jsx jsx */
import { css, jsx } from '@emotion/core'

const buttonCss = css`
  appearance: none;
  text-transform: uppercase;
  background-color: var(--button-background);
  color: var(--color-text-accent);
  background-color: var(--color-background-highlight);
  padding: 12px 16px;
  border-radius: 4px;
  border: none;
  font-size: 14px;
  cursor: pointer;
  transition: all .1s ease-out;

  &:hover {
    background-color: var(--color-background-highlight2);
  }
  &:focus {
    outline: none;
  }
  &:active {
    opacity: .8;
  }
`

export default function Button({children, ...props}) {
  return (
    <button css={buttonCss} {...props}>
      {children}
    </button>
  )
}
