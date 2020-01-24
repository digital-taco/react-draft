/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useRef } from 'react'
import { css } from '@emotion/core'
import InputLabel from './InputLabel'
import { boolAttr } from '../../lib/helpers'

const containerCss = css`
  display: flex;
  align-items: center;
  margin: 8px 0;

  & > *,
  & label {
    cursor: pointer;
  }

  & label {
    margin: 0;
  }
`

const sliderPanelCss = css`
  height: 24px;
  width: 48px;
  border: solid 2px var(--color-border-bottom);
  background: transparent;
  border-radius: 28px;
  padding: 2px;
  box-sizing: border-box;
  transition: all 0.1s;
  margin-right: 16px;

  [is-true] > & {
    background: var(--color-primary);
    border-color: var(--color-primary);
  }

  &:hover {
    background: #ddd;
  }

  [is-true] > &:hover {
    background: var(--color-primary-hover);
  }

  &:focus {
    outline: none;
  }

  &:active {
    background-color: #ccc;
  }

  [is-true] > &:active {
    background-color: var(--color-primary-hover);
  }
`

const sliderCss = css`
  background-color: var(--color-background-highlight);
  height: 16px;
  width: 16px;
  border-radius: 16px;
  transition: all 0.1s;
  [is-true] > div > & {
    transform: translateX(24px);
    background: white;
  }
`

const checkboxCss = css`
  display: none;
`

export default function Toggle({ checked, onChange, label, id, title, ...props }) {
  const checkboxRef = useRef(null)

  /* Manually triggers the onChange, since the slider isn't the checkbox and isn't in the label */
  const handleSliderClick = () => {
    const changeEvent = new MouseEvent('click', { bubbles: true, view: window, cancelable: false })
    checkboxRef.current.dispatchEvent(changeEvent)
  }

  return (
    <div css={containerCss} is-true={boolAttr(checked)}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        css={checkboxCss}
        ref={checkboxRef}
        id={id}
        {...props}
      />
      <div role="button" tabIndex="0" css={sliderPanelCss} onClick={handleSliderClick}>
        <div css={sliderCss} />
      </div>
      <InputLabel htmlFor={id} label={label} title={title} />
    </div>
  )
}
