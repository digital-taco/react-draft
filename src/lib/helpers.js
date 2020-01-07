/* eslint-disable no-eval */
import stringifyObject from 'stringify-object'
import React from 'react'
import { transpile } from './transpile-jsx'

// React needs to be defined on the window for babel standalone to work with jsx strings
if (!window.React) window.React = React

// -------------------------------------------------------
// UTIL
// -------------------------------------------------------
export function isJson(str) {
  try {
    const parsed = JSON.parse(str)
    return parsed
  } catch (e) {
    return false
  }
}

export function removeQuotes(str) {
  return str.replace(/(^("|')|("|')$)/g, '')
}

export function boolAttr(val) {
  return val ? '' : undefined
}

// -------------------------------------------------------
// CROSS-IFRAME COMMUNICATION
// -------------------------------------------------------

const sourceToken = 'react-draft'

export function msg(win, type, data) {
  return win && win.postMessage({ source: sourceToken, type, data }, '*')
}

export function parseMsg(fn) {
  return ({ data: { source, type, data } = {} }) => {
    if (source !== sourceToken) return
    fn(type, data)
  }
}

// -------------------------------------------------------
// DATA SERIALIZATION FOR COMPLEX INFORMATION
// -------------------------------------------------------

const TOKEN_DELIMITER = '::⏣::'

export function serialize(item, options = []) {
  if (item) {
    const tokens = options.join('|')
    const stringed = item.constructor === Object ? stringifyObject(item) : item.toString()
    const processed = `${tokens}${TOKEN_DELIMITER}${encodeURI(stringed)}`
    return processed
  }
}

export function deserialize(item, evaluate = true) {
  const needsProccessing = typeof item === 'string' && item.includes(TOKEN_DELIMITER)

  let processed = item

  if (needsProccessing) {
    const [tokenString, valueString] = item.split(TOKEN_DELIMITER)
    const tokens = tokenString.split('|')
    const decodedValue = decodeURI(valueString)
    processed = decodedValue

    // TRANSPILE
    if (evaluate && tokens.includes('TRANSPILE') && processed.replace(/\s+/g, '')) {
      processed = transpile(`(() => { return ${decodedValue} })()`)
      processed = eval(`(() => { return ${processed} })()`)
    }
  }
  return processed
}

export function deserializeAll(states) {
  return Object.fromEntries(Object.entries(states).map(([s, v]) => [s, deserialize(v)]))
}
