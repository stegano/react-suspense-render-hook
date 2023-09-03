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

## Using

### useSuspenseRender 
Using the custom hook `useSuspenseRender` to obtain `suspenseRender` (determines rendering based on fetch state) and `reFetch` (re-fetches data if needed).
```tsx
const DataComponent = () => {
  const fetcher = useCallback(
    async () => new Promise((resolve) => {
      setTimeout(resolve, 1000);
    }), []);
  const [suspenseRender, reFetch] = useSuspenseRender(fetcher);
  return suspenseRender(
    <p>Success</p>,
    <p>Loading</p>,
    <p>Error, Oops somethins wrong.. :(</p>,
  );
}
```

### SuspenseRenderProvider
In the `SuspenseRenderProvider`, the `loading` and `error` components are pre-configured. Therefore, when using `useSuspense`, even if you omit the configurations for the `loading` and `error` components, the `loading` and `error` components defined by the `SuspenseRenderProvider` are rendered.
```tsx
const App = ({ children }) => {
  return (
    <SuspenseRenderProvider loading={<p>Loading</p>} error={<p>Error :(</p>}>
      {children}
    </SuspenseRenderProvider>
  )
}
```