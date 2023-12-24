/**
 * Listener
 */
export interface Listener {
  (): void;
}

/**
 * Get data
 */
export interface Getter<Data> {
  (id: string): Data;
}

/**
 * Set data
 */
export interface Setter<Data> {
  (id: string, data: ((prevData?: Data) => Data) | Data): void;
}

/**
 * Get snapshot
 */
export interface GetSnapshot<Dataset> {
  (): Dataset;
}

/**
 * Subscribe
 */
export interface Subscribe {
  (listener: Listener): () => void;
}

/**
 * Emit update events to each listener
 */
export interface Emit {
  (): void;
}

/**
 * Store
 * @see https://react.dev/reference/react/useSyncExternalStore
 */
export interface Store<Data, Dataset = Record<string, Data>> {
  /**
   * Internal data store
   */
  _store: Dataset;
  /**
   * Intetnal listener list
   */
  _listenerList: Listener[];
  /**
   * Event emitter
   * Iterate through the listener list and notify each listener of the event to inform data changes
   */
  _emit: Emit;
  /**
   * Get data from the internal data store
   */
  get: Getter<Data>;
  /**
   * Set data in the internal data store
   */
  set: Setter<Data>;
  /**
   * Register an event listener in the store to detect changes
   */
  subscribe: Subscribe;
  /**
   * Get a snapshot of the data from the internal data store
   */
  getSnapshot: GetSnapshot<Dataset>;
}
