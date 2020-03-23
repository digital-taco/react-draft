import React from 'react'
import styles from './demo.module.css'

export default function EmptyDemo() {
  return (
    <div className={styles.emptyDemo}>
      <div>Please select a component to display</div>
    </div>
  )
}

EmptyDemo.componentHash = 'EmptyDemo'
