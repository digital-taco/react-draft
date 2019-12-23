import React, { useContext, useRef, useState, useEffect } from 'react'
import { css } from '@emotion/core'
import SplitPane from 'react-split-pane'
import PropsDrawer from './PropsDrawer'
import EditDrawer from './EditDrawer'
import ActivityBar from './ActivityBar'
import SideBar from './SideBar'
import Explorer from './Explorer'
import Settings from './Settings'
import { SettingsContext } from '../contexts/SettingsContext'
import { StorageContext } from '../contexts/StorageContext'
import { EditDrawerContext } from '../contexts/EditDrawerContext'
import Tabs from './Tabs'
import BadRenderMessage from './BadRenderMessage'
import SideBarTitle from './SideBarTitle'
import { boolAttr } from '../../lib/helpers'
import {
  SIDEBAR_VIEW,
  SIDEBAR_IS_OPEN,
  EDIT_DRAWER_ITEM,
  EDIT_DRAWER_HEIGHT,
  EDIT_DRAWER_WIDTH,
  SIDEBAR_WIDTH,
} from '../../constants/STORAGE_KEYS'

import {
  DEFAULT_EDIT_DRAWER_HEIGHT,
  DEFAULT_EDIT_DRAWER_WIDTH,
  DEFAULT_SIDEBAR_WIDTH,
} from '../../constants/DEFAULTS'

const wrapperCss = css`
  height: 100vh;
  max-height: 100vh;
  background: #283048;
  background: linear-gradient(to left, #859398, #283048);
`

const contentCss = css`
  display: flex;
  max-height: 100vh;
  height: 100%;

  & .horizontalResizer,
  & .verticalResizer {
    position: relative;
    z-index: 9999;
  }

  & .horizontalResizer {
    cursor: ns-resize;
    height: 8px;
    margin-bottom: -8px;
  }

  & .verticalResizer {
    cursor: ew-resize;
    width: 8px;
    margin-right: -12px;
  }

  & .verticalResizer::before,
  & .horizontalResizer::before {
    content: '';
    background: var(--color-text-secondary);
    opacity: 0.35;
    width: 30px;
    height: 2px;
    position: absolute;
  }

  & .horizontalResizer::before {
    left: calc(50% - 15px);

    bottom: 0;
  }

  & .verticalResizer::before {
    content: '';
    background: var(--color-text-secondary);
    opacity: 0.35;
    width: 2px;
    height: 30px;
    position: absolute;
    top: calc(50% + 24px - 15px);
    right: 0;
  }

  &[non-resizable] .verticalResizer {
    cursor: default;
  }

  &[non-resizable] .verticalResizer::before {
    display: none;
  }
`

const barCss = css`
  color: var(--color-text);
  background-color: var(--color-background-primary);
  height: 48px;
`

const paneCss = css`
  height: calc(100% - 48px);
  display: flex;
`

const boxCss = css`
  padding: 16px 16px 16px 0;
  box-sizing: border-box;
  height: 100%;
`

const containerCss = css`
  box-sizing: border-box;
  box-shadow: 0 0 16px 0 #0009;
  border-radius: 3px;
  overflow: hidden;
  position: relative;
  height: 100%;
`

const displayCss = css`
  height: 100%;
  max-height: calc(100% - 48px);
  flex-grow: 2;
`

export default function DemoWrapper({ propObjects, children, componentTree }) {
  const { getItem, setItem } = useContext(StorageContext)
  const { settings } = useContext(SettingsContext)
  const { setEditItem, editItem, closeEditDrawer } = useContext(EditDrawerContext)

  const [demoVisible, setDemoVisible] = useState(true)
  const contentRef = useRef(null)

  const sidebarView = getItem(SIDEBAR_VIEW, 'explorer')
  const sideBarIsOpen = getItem(SIDEBAR_IS_OPEN, true)

  const { editDrawerSide } = settings
  // const editItem = getItem(EDIT_DRAWER_ITEM, { warnings: [] })

  const sideBarWidth = getItem(SIDEBAR_WIDTH, DEFAULT_SIDEBAR_WIDTH)
  const editDrawerSize = editDrawerSide === 'right' ? EDIT_DRAWER_WIDTH : EDIT_DRAWER_HEIGHT
  const editDrawerSizeDefault =
    editDrawerSide === 'right' ? DEFAULT_EDIT_DRAWER_WIDTH : DEFAULT_EDIT_DRAWER_HEIGHT

  // const setEditItem = newEditItem => setItem(EDIT_DRAWER_ITEM, newEditItem)

  const VerticalSplitPane = editItem ? SplitPane : 'div'
  const verticalSplitPaneProps = editItem
    ? {
        split: editDrawerSide === 'right' ? 'vertical' : 'horizontal',
        style: { position: 'unset' },

        // Only collapse as far as the sidebar's width plus a little bit
        minSize: editDrawerSide === 'right' ? sideBarWidth + 100 : 200,
        maxSize: -48,
        defaultSize: getItem(editDrawerSize, editDrawerSizeDefault),
        resizerClassName: editDrawerSide === 'right' ? 'verticalResizer' : 'horizontalResizer',

        // demoVisible is used to disable pointer-events on the iframe, which drops the dragging functionality on hover
        onDragStarted: () => setDemoVisible(false),
        onDragFinished: newValue => {
          setItem(editDrawerSize, newValue)
          setDemoVisible(true)
        },
      }
    : {}

  const horizontalSplitPaneProps = {
    split: 'vertical',
    className: 'horizontalSplitPane',
    minSize: sideBarIsOpen ? 300 : 68,
    maxSize: sideBarIsOpen ? -40 : 68,
    defaultSize: sideBarWidth,
    resizerClassName: 'verticalResizer',
    onDragStarted: () => setDemoVisible(false),
    onDragFinished: newWidth => {
      setItem(SIDEBAR_WIDTH, newWidth)
      setDemoVisible(true)
    },
  }

  // Resizes the vertical pane whenever the edit drawer side changes to keep the state uptodate
  useEffect(() => {
    if (editItem) {
      const pane1 = contentRef.current.querySelector('.Pane1')
      if (editDrawerSide === 'right') {
        pane1.style.width = `${getItem(editDrawerSize, editDrawerSizeDefault)}px`
      } else if (editDrawerSide === 'bottom') {
        pane1.style.height = `${getItem(editDrawerSize, editDrawerSizeDefault)}px`
      }
    }
  }, [editDrawerSide])

  // Resizes the horizontal pane whenever the sidebar is opened or closed so the state stays uptodate
  useEffect(() => {
    const pane1 = contentRef.current.querySelector('.horizontalSplitPane > .Pane1')
    pane1.style.width = sideBarIsOpen ? `${sideBarWidth}px` : '68px'
  }, [sideBarIsOpen, editItem])

  return (
    <div css={wrapperCss}>
      {/* CONTENT */}
      <div ref={contentRef} css={contentCss} non-resizable={boolAttr(!sideBarIsOpen)}>
        <VerticalSplitPane {...verticalSplitPaneProps}>
          {/* SIDEBAR */}
          <SplitPane {...horizontalSplitPaneProps}>
            <div style={{ height: '100%' }}>
              <div css={barCss}>
                <SideBarTitle sideBarIsOpen={sideBarIsOpen} sidebarView={sidebarView} />
              </div>
              <div css={paneCss}>
                <ActivityBar />
                {sideBarIsOpen && (
                  <SideBar>
                    {/* PROPS VIEW */}
                    {sidebarView === 'props' && (
                      <PropsDrawer
                        open={sideBarIsOpen && sidebarView === 'props'}
                        propObjects={propObjects}
                      />
                    )}

                    {/* EXPLORER VIEW */}
                    {sidebarView === 'explorer' && <Explorer componentTree={componentTree} />}

                    {/* SETTINGS VIEW */}
                    {sidebarView === 'settings' && <Settings />}
                  </SideBar>
                )}
              </div>
            </div>

            <div style={{ height: '100%' }}>
              {/* TABS */}
              <div css={barCss}>
                <Tabs />
              </div>

              {/* DEMO */}
              <div css={displayCss}>
                <div css={boxCss} style={{ paddingLeft: sideBarIsOpen ? 16 : 0 }}>
                  <div
                    css={containerCss}
                    style={{
                      padding: `${settings.demoPadding}px`,
                      backgroundColor: settings.hideBackground
                        ? 'transparent'
                        : settings.backgroundColor || '#fff',
                      pointerEvents: demoVisible ? 'initial' : 'none',
                    }}
                  >
                    {children}
                  </div>
                  {!children && <BadRenderMessage />}
                </div>
              </div>
            </div>
          </SplitPane>

          {/* EDIT DRAWER */}
          <EditDrawer />
        </VerticalSplitPane>
      </div>
    </div>
  )
}
