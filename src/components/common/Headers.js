import React from 'react'
import { css } from '@emotion/core'

const styles = {
  h1: css`
    margin: 8px 0;
    font-size: 22px;
  `,
  h2: css`
    margin: 8px 0;
    font-size: 16px;
  `,
  h3: css`
    margin: 8px 0;
    font-size: 14px;
    text-transform: uppercase;
  `,
  h4: css`
    margin: 8px 0;
    font-size: 12px;
  `,
  h5: css`
    margin: 8px 0;
    font-size: 11px;
  `,
}

export const H1 = ({ children }) => <h1 css={styles.h1}>{children}</h1>
export const H2 = ({ children }) => <h2 css={styles.h2}>{children}</h2>
export const H3 = ({ children }) => <h3 css={styles.h3}>{children}</h3>
export const H4 = ({ children }) => <h4 css={styles.h4}>{children}</h4>
export const H5 = ({ children }) => <h5 css={styles.h5}>{children}</h5>
