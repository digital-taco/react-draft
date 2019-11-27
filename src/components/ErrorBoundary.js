import React from 'react'
/** @jsx jsx */
import { css, jsx } from '@emotion/core'

const errorCss = css`
  background: #fcc;
  color: #911;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu',
    'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`

const messageCss = css`
  margin-bottom: 16px;
  font-size: 20px;
  font-weight: bold;
`

const stackCSs = css`
  white-space: pre-wrap;
  overflow-wrap: break-word;
`

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: '' }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error }
  }

  render() {
    return this.state.hasError ? (
      <div css={errorCss}>
        <div css={messageCss}>{this.state.error.message}</div>
        <div css={stackCSs}>{this.state.error.stack}</div>
      </div>
    ) : (
      this.props.children
    )
  }
}
