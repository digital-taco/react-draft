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
  const processed = SERIALIZED_TOKEN + encodeURI(item.toString())
  return processed
}

export function deserialize (item, evaluate = true) {
  const needsProccessing = typeof item === 'string' && item.startsWith(SERIALIZED_TOKEN)
  let processed = needsProccessing ? decodeURI(item.replace(SERIALIZED_TOKEN, '')) : item
  processed = needsProccessing && evaluate ? eval(`(()=>(${processed}))();`) : processed
  return processed
}