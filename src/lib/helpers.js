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
    // console.log('LOG: serialize -> item', item.constructor)
    // console.log('LOG: serialize -> item', item instanceof Object, item)
    const stringed = item.constructor === Object ? stringifyObject(item) : item.toString()
    console.log('LOG: serialize -> stringed', stringed)
    const processed = SERIALIZED_TOKEN + encodeURI(stringed)
    return processed
  }
}

export function deserialize(item, evaluate = true) {
  // console.log('LOG: deserialize -> item', item)
  const needsProccessing = typeof item === 'string' && item.startsWith(SERIALIZED_TOKEN)
  let processed = needsProccessing ? decodeURI(item.replace(SERIALIZED_TOKEN, '')) : item
  // console.log('LOG: deserialize -> processed', processed)
  // eslint-disable-next-line no-eval
  processed = needsProccessing && evaluate ? eval(`(()=>(${processed}))();`) : processed
  return processed
}

export function boolAttr(val) {
  return val ? '' : undefined
}
