import React from 'react'
import { css } from '@emotion/core'

const arrowCss = css`
  &[data-direction='up'] {
    transform: rotate(180deg);
  }
  &[data-direction='left'] {
    transform: rotate(90deg);
  }
  &[data-direction='right'] {
    transform: rotate(270deg);
  }
`

export default function ArrowIcon({ direction, ...props }) {
  return (
    <svg
      data-direction={direction}
      css={arrowCss}
      focusable="false"
      viewBox="0 0 24 24"
      aria-hidden="true"
      role="presentation"
      {...props}
    >
      <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
    </svg>
  )
}
