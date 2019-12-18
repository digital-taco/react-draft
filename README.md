# React Draft
📝 WIP: Develop your React components in isolation without any configuration.

## Installation

In your project's root directory, run:

```bash
npm i @digital-taco/react-draft
```

## Usage

### Using NPX

In your project's root directory, run:

```bash
npx draft
```

### Using Node Scripts

In your project's `package.json`, add:

```json
"scripts": {
  "draft": "draft"
}
```

Use this command to launch react-draft:

```bash
npm run draft
```

## Configuration

An _entirely optional_ file named `draft.config.js` can be placed in the root directory of your project. This file should have the following structure:

```
module.exports = {
  optionName: optionValue,
  ...
}
```

Here are the available options:

|Option     |What it do                                               |
|-----------|---------------------------------------------------------|
|ignore     |An array of strings to match filenames against to ignore when parsing for react components. This is useful for skipping files that don't contain development components, like `.stories.` files or `.test.` files.|
|wrapperPath|Path to the `draft.wrapper.js` file, as described below. If not provided, draft will look for one in the current working directory.|
|babelModules|An array of strings or regexes to match against additional modules that need to be run through babel that live outside the project's directory or in the project's node_modules.|
|middleware|A function that is passed the `app` instance of express. This allows adding custom middleware needed for things like authentication.|

#### Custom Middleware

Example:

```js
// draft.config.js
module.exports = {
  middleware: app => {
    app.use('/flush-ion-cores', (req, res, next) => {
      // flush the icon cores here
    })
  }
}
```

## Wrapper Component

In many cases, additional context is needed for your components to run. This might include providers, service layers, global styling, or similar. To provide these, a wrapper component can be provided that will wrap around each component demo.

To add the wrapper component to your project, add a file named `draft.wrapper.js` to the root directory of the project. You can store it at a different path, as long as that path is specified under the `wrapperPath` option in the `draft.config.js` file.

The wrapper is just a standard react component. It must render any children passed to it. The `children` passed to it contains the component selected in the UI. 

```js
import React from 'react'
// import styles, services, providers, etc.

export default function Wrapper({ children }) {
  // Wrap the children in any providers, services, styles, etc. needed
  return <div>{children}</div>
}
```

> **Note**: The function can be named anything. `Wrapper` keeps it consistent across projects.

## Contributing & Running Locally

For ease of development, a [create-react-app generated application has been created](https://github.com/digital-taco/react-draft-sandbox). Developing `react-draft` is made much simpler by npm linking `react-draft` within the development repository. Clone both repositories locally, then follow these steps:

Where you cloned `react-draft`, run:

```bash
npm link
```

Where you cloned `react-draft-sandbox`, run:

```bash
npm link @digital-taco/react-draft
```

Run draft in the sandbox. Any changes made in `react-draft` will be applied live.

## Authors && Contributors

Zach Williams ([@zachintosh](https://github.com/zachintosh))

Kyle West ([@kyle-west](https://github.com/kyle-west))
