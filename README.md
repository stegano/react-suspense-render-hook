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
import { useState, useCallback } from "react";
import { useSuspenseRender } from "react-suspense-render-hook";

const App = () => {
  // Asynchronous task function
  const asyncTask = useCallback(
    () =>
      new Promise<string>((resolve) => {
        const randomString = Math.random().toString(32).slice(2);
        setTimeout(() => resolve(randomString), 1000 * 3);
      }),
    [],
  );

  // You can use the `runAsyncTask` function to process asynchronous data again at your desired point after the screen has been rendered.
  const [suspenseRender, runAsyncTask] = useSuspenseRender<string, Error>();

  useEffect(() => {
    // Run asynchronous task function
    runAsyncTask(async () => {
      return asyncTask();
    });
  }, [asyncTask]);

  const handleButtonClick = useCallback(() => {
    // Run the `asyncTask` function
    runAsyncTask(async () => {
      return asyncTask();
    }); // Alternatively, you can use `runAsyncTask(new Promise(...))`;
  }, [asyncTask, runAsyncTask]);

  // Use `suspenseRender` to define rendering for data processing statuses: success, loading, or error. It auto-renders based on the `asyncTask` function's status.
  return suspenseRender(
    (data) => (
      <div>
        <p>Success({data})</p>
        <button type="button" onClick={handleButtonClick}>
          Update
        </button>
      </div>
    ),
    <p>Loading..</p>,
    (error) => <p>Error, Oops something went wrong.. :(, ({error.message})</p>,
  );
};
```
Demo: https://stackblitz.com/edit/stackblitz-starters-pgefl6

### SuspenseRenderProvider
The `SuspenseRenderProvider` allows for predefined loading or error components to be set externally.

```tsx
import { useCallback, useEffect } from 'react';
import {
  SuspenseRenderProvider,
  useSuspenseRender,
} from 'react-suspense-render-hook';

const DataComponent = () => {
  // Asynchronous task function
  const asyncTask = useCallback(
    () =>
      new Promise<any>((resolve) => {
        setTimeout(resolve, 1000 * 1);
      }),
    []
  );

  const [suspenseRender, runAsyncTask] = useSuspenseRender();

  useEffect(() => {
    runAsyncTask(async () => {
      await asyncTask();
    });
  }, []);

  // If not specified, components defined in `SuspenseRenderProvider` are used for `renderLoading` or `renderError`.
  return suspenseRender(<p>Success</p>);
};

export const App = ({ children }) => {
  return (
    <SuspenseRenderProvider
      renderLoading={<p>Loading..☀️</p>}
      renderError={<p>Error!</p>}
    >
      <DataComponent />
    </SuspenseRenderProvider>
  );
};

```
Demo: https://stackblitz.com/edit/stackblitz-starters-bwapyp