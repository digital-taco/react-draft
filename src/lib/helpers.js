export function isJson(str) {
  try {
      const parsed = JSON.parse(str);
      return parsed
  } catch (e) {
      return false;
  }
}

export function removeQuotes(str) {
  return str.replace(/(^("|')|("|')$)/g, '')
}