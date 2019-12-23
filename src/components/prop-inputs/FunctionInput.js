import React from 'react'
import { css } from '@emotion/core'
import Button from '../common/Button'
import InputLabel from '../common/InputLabel'
import EditablePropInput from './EditablePropInput'

const styles = {
  objectContainer: css`
    width: 100%;
    position: relative;
    box-sizing: border-box;
  `,
}

export default function FunctionInput(props) {
  return <EditablePropInput {...props} />
}
