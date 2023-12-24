/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-syntax */

import { Store } from "./store.interface";

/**
 * `createStore` is a function that creates a store object for managing state.
 * @see https://react.dev/reference/react/useSyncExternalStore
 */
export const createStore = <Data>(): Store<Data> => {
  const store: Store<Data> = {
    _store: {},
    _listenerList: [],
    _emit: () => {
      for (const listener of store._listenerList) {
        listener();
      }
    },
    set: (id, data) => {
      const nextState = typeof data === "function" ? (data as Function)(store._store[id]) : data;
      store._store = {
        ...store._store,
        [id]: nextState,
      };
      store._emit();
    },
    get: (id) => {
      return store._store[id];
    },
    subscribe: (listener) => {
      store._listenerList.push(listener);
      return () => {
        store._listenerList = store._listenerList.filter(
          (currentListener) => currentListener !== listener,
        );
      };
    },
    getSnapshot: () => {
      return store._store;
    },
  };
  return store;
};

export default {};
