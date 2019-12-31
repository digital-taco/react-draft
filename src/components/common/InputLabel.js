import React from 'react'
import { css } from '@emotion/core'

const containerCss = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const labelCss = css`
  font-size: 14px;
  color: var(--color-text);
  font-weight: bold;
  margin: 16px 0 8px;
  letter-spacing: 0.015rem;
`

const metaCss = css`
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-top: 8px;
`

export default function InputLabel({ label, htmlFor, metaText, title }) {
  return (
    <div css={containerCss} title={title}>
      <label css={labelCss} htmlFor={htmlFor}>
        {label}
      </label>
      <div css={metaCss}>{metaText}</div>
    </div>
  )
}
