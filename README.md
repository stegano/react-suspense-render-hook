# React Suspense Render Hook
![NPM License](https://img.shields.io/npm/l/react-suspense-render-hook)
![NPM Downloads](https://img.shields.io/npm/dw/react-suspense-render-hook)

React Suspense Render Hook: This hook allows you to declaratively define components that render when asynchronous data is processed.

## Installation

The easiest way to install [`react-suspense-render-hook`](https://www.npmjs.com/package/react-suspense-render-hook) is with [npm](https://www.npmjs.com/).

```bash
npm install react-suspense-render-hook
```

Alternately, download the source.

```bash
git clone https://github.com/stegano/react-suspense-render-hook.git
```

## Quick Start

### useSuspenseRender 
The `useSuspenseRender` hook enables a declarative approach to display components based on asynchronous data processing status. Handle components' rendering based on data processing status within a single component.

```tsx
import { useSuspenseRender } from "react-suspense-render-hook";

const DataComponent = () => {
  // Asynchronous task function
  const asyncTask = useCallback(
    async () => new Promise((resolve) => {
      setTimeout(resolve, 1000);
    }
  ), []);

  const [ suspenseRender ] = useSuspenseRender(asyncTask);

  // Use `suspenseRender` to define rendering for data processing statuses: success, loading, or error. It auto-renders based on the `asyncTask` function's status.
  return suspenseRender(
    <p>Success</p>,
    <p>Loading..</p>,
    <p>Error, Oops somethins wrong.. :(</p>,
  );
}
```
Demo: https://stackblitz.com/edit/stackblitz-starters-pgefl6

### SuspenseRenderProvider
The `SuspenseRenderProvider` allows for predefined loading or error components to be set externally.

```tsx
import { SuspenseRenderProvider, useSuspenseRender } from "react-suspense-render-hook";

const App = ({ children }) => {
  return (
    <SuspenseRenderProvider loading={<p>Loading..</p>} error={<p>Error!</p>}>
      <DataComponent />
    </SuspenseRenderProvider>
  )
}

// ...

const DataComponent = () => {
  const [ suspenseRender ] = useSuspenseRender(asyncTask);
  // If not specified, components defined in `SuspenseRenderProvider` are used for `loading` or `error`.
  return suspenseRender(
    <p>Success</p>
  );
}
```
Demo: https://stackblitz.com/edit/stackblitz-starters-bwapyp