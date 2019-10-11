import React from 'react'
import sharedStyles from './shared.module.css'

export default function ErrorBox({children}) {
  return (
    <div className={sharedStyles.missingProps}>
      {children}
    </div>
  )
}
