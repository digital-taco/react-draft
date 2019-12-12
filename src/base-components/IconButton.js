import React from 'react'
import { css } from '@emotion/core'

const buttonCss = css`
  appearance: none;
  text-transform: uppercase;
  background-color: transparent;
  padding: 4px;
  border-radius: 40px;
  border: none;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.1s ease-out;
  display: flex;
  align-items: center;
  height: 32px;
  width: 32px;

  & > svg {
    height: 24px;
    width: 24px;
    fill: var(--color-text);
    transition: all 0.1s ease-out;
  }

  &:hover > svg {
    fill: var(--color-text-accent);
  }

  &:hover {
    background-color: #fff4;
  }
  &:focus {
    outline: none;
  }
  &:active {
    opacity: 0.8;
  }
`

export default function IconButton({ Icon, ...props }) {
  return (
    <button type="button" css={buttonCss} {...props}>
      <Icon />
    </button>
  )
}
