import React from 'react'
import styles from './demo.module.css'

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
    const { error, hasError } = this.state
    const { children } = this.props
    return hasError ? (
      <div css={styles.error}>
        <div css={styles.message}>{error.message}</div>
        <div css={styles.stack}>{error.stack}</div>
      </div>
    ) : (
      children
    )
  }
}
