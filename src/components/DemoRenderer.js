import React, { useContext } from 'react'
import ReactDOM from 'react-dom'
import Components from '../../out/master-exports'
import DemoWrapper from './DemoWrapper'
import canRender from '../lib/can-render'
import ChildrenRenderer from './ChildrenRenderer'
import ErrorBox from './ErrorBox'
import SettingsProvider from './Settings/SettingsProvider'
import ErrorBoundary from './ErrorBoundary'
import SelectedProvider, { SelectedContext } from './SelectedProvider'
import StorageProvider from './StorageContext'

import '../global.css' //eslint-disable-line

// Add the app container so react can render
const container = document.createElement('div')
document.body.appendChild(container)
container.setAttribute('id', 'app')

// Add the babel standalone script so we can transpile jsx live
const babelStandalone = document.createElement('script')
babelStandalone.setAttribute('src', 'https://unpkg.com/@babel/standalone/babel.min.js')
babelStandalone.setAttribute('data-presets', 'es2015,react')
document.head.appendChild(babelStandalone)

const { componentTree } = Components

function ComponentDemo() {
  const { SelectedComponent, propStates } = useContext(SelectedContext)

  const { meta } = SelectedComponent
  const { props } = meta

  const canRenderComponent = propStates && canRender(props, propStates)

  return (
    <DemoWrapper propObjects={props} componentTree={componentTree}>
      {canRenderComponent && (
        <ErrorBoundary key={meta.componentHash}>
          {/* DEMO COMPONENT */}
          <SelectedComponent {...propStates}>
            <ChildrenRenderer value={propStates.children} />
          </SelectedComponent>

          {/* MISSING REQUIRED PROPS */}
          {!canRenderComponent && <ErrorBox>All required props must be given a value</ErrorBox>}
        </ErrorBoundary>
      )}
    </DemoWrapper>
  )
}

// Render the demo in the dom
ReactDOM.render(
  <StorageProvider>
    <SelectedProvider components={Components}>
      <SettingsProvider>
        <ComponentDemo />
      </SettingsProvider>
    </SelectedProvider>
  </StorageProvider>,
  document.getElementById('app')
)
