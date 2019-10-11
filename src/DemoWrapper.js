import React from 'react'
/** @jsx jsx */
import { Global, css, jsx } from '@emotion/core'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Settings'
import PropsDrawer from './PropsDrawer'
import useLocalStorage from './useLocalStorage'
import EditDrawer from './EditDrawer'

const styles = {
  grid: css`
    height: 100vh;
    box-sizing: border-box;
    max-height: 100vh;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  `,
  wrapper: css`
    padding: 12px;
    flex-grow: 2;
    overflow-y: scroll;
    min-height: 0;
  `,
  main: css`
    display: flex;
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    min-height: 0;
    min-width: 0;

    & > .MuiCard-root {
      overflow: scroll;
    }
  `,
  contents: css`
    overflow-y: scroll;
    flex-grow: 1;
    display: grid;
    grid-template-rows: 1fr 1fr;
    min-height: calc(100vh - 64px);
  `,
  global: css`
    body {
      margin: 0;
    }
    .demo-font {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu',
        'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
  `,
  appBar: css`
    z-index: 3000;
    position: relative;
    & .MuiIconButton-root {
      margin-right: 8px;
    }
  `,
}

export default function DemoWrapper({
  propObjects,
  displayName,
  children,
  propStates,
  setPropStates,
  resetToDefaults,
}) {
  const [propsDrawerOpen, setPropsDrawerOpen] = useLocalStorage('propsDrawerOpen', true)
  const [editDrawerOpen, setEditDrawerOpen] = useLocalStorage('editDrawerOpen', true)
  const [editItem, setEditItem] = useLocalStorage(`${displayName}_editItem`, null)

  function updatePropState(propName, newState) {
    setPropStates(oldPropStates => ({
      ...oldPropStates,
      [propName]: newState,
    }))
  }

  return (
    <>
      <Global styles={styles.global} />
      <div css={styles.grid}>
        {/* APP BAR */}
        <div css={styles.appBar}>
          <AppBar position="static" color="primary">
            <Toolbar>
              <IconButton
                onClick={() => setPropsDrawerOpen(!propsDrawerOpen)}
                edge="start"
                color="inherit"
                aria-label="Props"
              >
                <MenuIcon />
              </IconButton>
              <h4 className="demo-font">{displayName}</h4>
            </Toolbar>
          </AppBar>
        </div>

        {/* MAIN */}
        <div css={styles.main}>
          {/* PROPS DRAWER */}
          <PropsDrawer
            propStates={propStates}
            open={propsDrawerOpen}
            propObjects={propObjects}
            setEditItem={setEditItem}
            updatePropState={updatePropState}
            resetToDefaults={resetToDefaults}
          />

          {/* DEMO COMPONENT */}
          <div
            css={styles.contents}
            style={{ gridTemplateRows: editDrawerOpen ? `1fr 1fr` : `auto` }}
          >
            <div css={styles.wrapper}>{children}</div>

            {/* EDIT DRAWER */}
            <EditDrawer
              open={editDrawerOpen}
              setOpen={setEditDrawerOpen}
              editItem={editItem}
              setEditItem={setEditItem}
              updatePropState={updatePropState}
            />
          </div>
        </div>
      </div>
    </>
  )
}
