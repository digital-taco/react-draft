import React, { useState, useEffect } from 'react'
import { css } from '@emotion/core'
import ReloadingIcon from '../icons/ReloadingIcon'

const notificationCss = css`
  background-color: var(--color-background-highlight);
  padding: 8px;
  position: fixed;
  bottom: 20px;
  left: 20px;
  height: 32px;
  width: 32px;
  border-radius: 40px;
  display: flex;
  justify-content: center;
  pointer-events: none;

  & svg {
    fill: limegreen;
  }
`

export default function ReloadNotification() {
  const [reloading, setReloading] = useState(false)
  useEffect(() => {
    const handler = status => {
      if (status === 'prepare') {
        setReloading(true)
      }
      if (status === 'idle') {
        setReloading(false)
      }
    }
    module.hot.addStatusHandler(handler)
    return () => module.hot.removeStatusHandler(handler)
  })

  return (
    <div style={{ opacity: reloading ? 1 : 0 }} css={notificationCss}>
      <ReloadingIcon fill="limegreen" />
    </div>
  )
}
