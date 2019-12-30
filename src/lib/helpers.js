/* eslint-disable no-eval */
import stringifyObject from 'stringify-object'

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

const SERIALIZED_TOKEN = '::SERIALIZED::'

export function serialize(item) {
  if (item) {
    const stringed = item.constructor === Object ? stringifyObject(item) : item.toString()
    const processed = SERIALIZED_TOKEN + encodeURI(stringed)
    return processed
  }
}

export function deserialize(item, evaluate = true) {
  const needsProccessing = typeof item === 'string' && item.startsWith(SERIALIZED_TOKEN)
  let processed = needsProccessing ? decodeURI(item.replace(SERIALIZED_TOKEN, '')) : item
  if (needsProccessing && evaluate && processed.replace(/\s+/g, '')) {
    processed = eval(`(()=>(${processed}))();`)
  }
  return processed
}

export function deserializeAll(states) {
  return Object.fromEntries(Object.entries(states).map(([s, v]) => [s, deserialize(v)]))
}
