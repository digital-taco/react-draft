import React, { useState } from 'react'

// eslint-disable-next-line no-proto
Proxy.prototype = Proxy.prototype || Proxy.__proto__

function isFunction(funcStr) {
  return funcStr.startsWith('function') || funcStr.includes('=>')
}

function getFromLS(key, defaultValue) {
  const fetch = window.localStorage.getItem(key)
  try {
    return fetch !== undefined ? JSON.parse(fetch) : defaultValue
  } catch (e) {
    if (isFunction(fetch)) {
      // eslint-disable-next-line no-eval
      return eval(fetch) || defaultValue // convert to real function?
    }
    return fetch !== undefined ? fetch : defaultValue
  }
}

function setInLS(key, newValue) {
  try {
    const parsedValue =
      typeof newValue === 'function' ? newValue.toString() : JSON.stringify(newValue)
    return window.localStorage.setItem(key, parsedValue)
  } catch (e) {
    console.error(e)
  }
}

const Storage = (() => {
  let instance = null

  return class extends Proxy {
    constructor(...args) {
      if (instance) return instance
      const _ = Object.assign({}, ...args)

      super(_, {
        get(obj, prop) {
          obj[prop] = obj[prop] !== undefined ? obj[prop] : getFromLS(prop)
          return obj[prop]
        },

        set(obj, prop, value) {
          const old = obj[prop]
          if (!Object.is(old, value)) {
            obj[prop] = value
            setTimeout(() => setInLS(prop, value), 0)
          }
          return true
        },
      })
      instance = this
    }
  }
})()

export default function useStorage() {
  const [{ storage }, setStorage] = useState({ storage: new Storage() })

  const getItem = (key, defaultValue) => {
    const value = storage[key]
    if (value === undefined || value === null) storage[key] = defaultValue
    return storage[key]
  }

  const setItem = (key, newValue) => {
    if (!Object.is(storage[key], newValue)) {
      storage[key] = newValue
      setStorage({ storage })
    }
    return storage[key]
  }

  return [getItem, setItem]
}
