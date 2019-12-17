import React, { useContext } from 'react'
import { SettingsContext } from '../contexts/SettingsContext'
import { css } from '@emotion/core'
import TextInput from '../common/TextInput'
import Select from '../common/Select'
import InputLabel from '../common/InputLabel'

const settingsCss = css`
  padding: 8px 16px 0;
`

export default function Settings() {
  const { settings, updateSetting } = useContext(SettingsContext)

  return (
    <div css={settingsCss}>
      <InputLabel htmlFor="setting_demoPadding" label="Demo Padding" metaText="px" />
      <TextInput
        id="setting_demoPadding"
        type="number"
        value={settings.demoPadding}
        onChange={({ target: { value } }) => {
          updateSetting('demoPadding', value && value >= 0 ? value : 0)
        }}
      />

      <InputLabel htmlFor="setting_backgroundColor" label="Background Color" />
      <TextInput
        id="setting_backgroundColor"
        value={settings.backgroundColor}
        onChange={({ target: { value } }) => {
          updateSetting('backgroundColor', value)
        }}
      />

      <InputLabel htmlFor="setting_editDrawerSide" label="Edit Drawer Location" />
      <Select
        id="setting_editDrawerSide"
        value={settings.editDrawerSide}
        onChange={({ target: { value } }) => {
          updateSetting('editDrawerSide', value)
        }}
      >
        <option value="right">Right</option>
        <option value="bottom">Bottom</option>
      </Select>
    </div>
  )
}
