import React from 'react'
import { css } from '@emotion/core'

const emptyDemoCss = css`
  padding: 40px;
  height: 100vh;
  width: 100vw;
  box-sizing: border-box;

  & > * {
    text-align: center;
  }
`

export default function EmptyDemo() {
  return (
    <div css={emptyDemoCss}>
      <div>Please select a component to display</div>
    </div>
  )
}

EmptyDemo.meta = {
  componentHash: 'EmptyDemo',
}
