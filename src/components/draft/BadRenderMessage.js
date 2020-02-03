import React from 'react'
import { css } from '@emotion/core'

const noRenderCss = css`
  color: white;
  text-align: center;
  margin-top: 40px;
`

const titleCss = css`
  font-weight: bold;
  letter-spacing: 0.035rem;
  line-height: 3rem;
`

export default function BadRenderMessage() {
  return (
    <div css={noRenderCss} className="demo-font">
      <div css={titleCss}>UNABLE TO RENDER</div>
      <div>Please verify all required props have values.</div>
    </div>
  )
}
