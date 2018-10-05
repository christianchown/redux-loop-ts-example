// Simulate a flaky API around otherwise an otherwise synchronous `f()`.
const flakify = <T>(f: () => T): Promise<T> =>
  new Promise(
    (resolve, reject) =>
      // We'll always take 200 * (1d10 + 1) ms to respond
      window.setTimeout(() => {
        try {
          // And ~20% of the time we'll fail
          if (Math.random() < 0.2) {
            throw new Error('Failed arbitrarily');
          }

          resolve(f());
        } catch (e) {
          return reject(e);
        }
      }, 200 + Math.random() * 2000) // tslint:disable-line
  );

export type Api = {
  save(x: number): Promise<null>;
  load(): Promise<number>;
};

export const api: Api = {
  save: (counter: number): Promise<null> =>
    flakify(() => {
      localStorage.setItem('__counterValue', counter.toString());
      return null;
    }),
  load: (): Promise<number> =>
    flakify(() => {
      const storedValue = parseInt(
        localStorage.getItem('__counterValue') || '',
        10
      );
      return storedValue || 0;
    }),
};
