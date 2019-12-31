/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useRef } from 'react'
import { css } from '@emotion/core'
import InputLabel from './InputLabel'
import { boolAttr } from '../../lib/helpers'

const containerCss = css`
  display: flex;
  align-items: center;
  margin: 12px 0;

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
  border: solid 2px var(--color-background-accent);
  background: var(--color-background-secondary);
  border-radius: 28px;
  padding: 2px;
  box-sizing: border-box;
  transition: all 0.1s;
  margin-right: 16px;

  [is-true] > & {
    background: var(--color-background-accent);
  }

  &:hover {
    background: var(--color-background-tertiary);
  }

  [is-true] > &:hover {
    background: var(--color-background-highlight);
  }

  &:focus {
    outline: none;
  }

  &:active,
  [is-true] > &:active {
    background: var(--color-background-highlight2);
  }
`

const sliderCss = css`
  background: var(--color-text);
  height: 16px;
  width: 16px;
  border-radius: 16px;
  transition: all 0.1s;
  [is-true] > div > & {
    transform: translateX(24px);
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
