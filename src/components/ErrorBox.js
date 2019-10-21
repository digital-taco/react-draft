import React from 'react'
import sharedStyles from '../shared.module.css'
import InputLabel from '../base-components/InputLabel'

export default function ErrorBox({label, error}) {
  return (
    <>
      <InputLabel label={label} />
      <div className={sharedStyles.missingProps}>
        {error}
      </div>
    </>
  )
}
