export function isJson(str) {
  try {
    const parsed = JSON.parse(str)
    return parsed
  } catch (e) {
    return false
  }
}

const sourceToken = 'react-draft'

export function msg(win, type, data) {
  return win.postMessage({ source: sourceToken, type, data }, '*')
}

export function parseMsg(fn) {
  return ({ data: { source, type, data } = {} }) => {
    if (source !== sourceToken) return
    fn(type, data)
  }
}

export function removeQuotes(str) {
  return str.replace(/(^("|')|("|')$)/g, '')
}
