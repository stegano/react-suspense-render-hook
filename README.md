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

## Quick Starts

### useSuspenseRender 
By using the `useSuspenseRender` hook, you can declaratively define which components will be displayed based on the asynchronous data processing status within the component. 
Inside the component, you can comprehensively handle the components to be rendered based on the data processing status.

```tsx
import { useSuspenseRender } from "react-suspense-render-hook";

const DataComponent = () => {
  // Asynchronous data processing function
  const fetcher = useCallback(
    async () => new Promise((resolve) => {
      setTimeout(resolve, 1000);
    }
  ), []);

  // Pass the `fetcher` function as an argument to the `useSuspenseRender` function and call it.
  // When you pass an asynchronous data processing function(=fetcher) 
  // to the `useSuspenseRender` hook, it returns a `suspenseRender` function.
  const [ suspenseRender ] = useSuspenseRender(fetcher);

  // Define rendering for each data processing status using the `suspenseRender` function.
  // The `suspenseRender` function allows you to define the components that will be displayed 
  // when data processing is successful, while data processing is ongoing, and when data processing fails. 
  // While the fetcher function passed as an argument to the `useSuspenseRender` function is running, 
  // `suspenseRender` automatically renders the screen based on the data processing status.
  return suspenseRender(
    <p>Success</p>,
    <p>Loading..</p>,
    <p>Error, Oops somethins wrong.. :(</p>,
  );
}
```

### SuspenseRenderProvider
By using the `SuspenseRenderProvider`, you can predefine the screen that will be displayed when data is being processed or when data processing fails, from outside the component.

```tsx
import { SuspenseRenderProvider, useSuspenseRender } from "react-suspense-render-hook";

const App = ({ children }) => {
  ...

  return (
    <SuspenseRenderProvider loading={<p>Loading..</p>} error={<p>Error!</p>}>
      <DataComponent />
    </SuspenseRenderProvider>
  )
}

...

const DataComponent = () => {
  ...

  const [ suspenseRender ] = useSuspenseRender(fetcher);

  // If you do not define the components to be displayed during data processing or when data processing fails, 
  // the components defined in the parent component (i.e., SuspenseRenderProvider) will be displayed.
  return suspenseRender(
    <p>Success</p>
  );
}
```