import React from 'react'
/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import InputLabel from './InputLabel'

const containerCss = css`
  display: grid;
  grid-template-columns: min-content 1fr;
  grid-column-gap: 8px;
  align-items: center;
  height: 34px;
  padding: 16px 0;

  & > *,
  & label {
    cursor: pointer;
  }

  & label {
    margin: 0;
  }
`

const checkboxCss = css`
  appearance: none;
  height: 28px;
  width: 28px;
  border: solid 2px var(--color-background-accent);
  box-sizing: border-box;
  padding: 2px;
  transition: all 0.1s ease-out;
  border-radius: 3px;

  &::before {
    content: '';
    height: 100%;
    width: 100%;
    font-size: 20px;
    line-height: 20px;
    color: white;
    text-align: center;
    display: grid;
    align-items: center;
    border-radius: 3px;
    transition: all 0.1s ease-out;
  }

  &:checked {
    padding: 0;
  }

  &:checked:hover {
    padding: 1px;
  }

  &:active,
  &:checked:active {
    padding: 2px;
  }

  &:checked::before {
    content: '✓';
    background-color: var(--color-text-selected);
  }
  &:checked:hover::before {
    background-color: var(--color-text-hover);
  }

  &:hover::before {
    background-color: var(--color-background-highlight);
  }
  &:focus {
    outline: none;
  }
`

export default function Button({ checked, onChange, label, id, ...props }) {
  return (
    <div css={containerCss}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        css={checkboxCss}
        id={id}
        {...props}
      />
      <InputLabel htmlFor={id} label={label} />
    </div>
  )
}
