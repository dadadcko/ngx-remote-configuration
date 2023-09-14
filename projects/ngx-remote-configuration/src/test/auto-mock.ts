type Clazz<T> = new (...args: unknown[]) => T;

export function mockClass<T>(obj: Clazz<T>): Clazz<T> {
  const keys = Object.getOwnPropertyNames(obj.prototype);
  const allMethods = keys.filter(key => {
    try {
      return typeof obj.prototype[key] === 'function';
    } catch (error) {
      return false;
    }
  });
  const allProperties = keys.filter(x => !allMethods.includes(x));

  const mockedClass = class T {};

  allMethods.forEach(
    method =>
      (mockedClass.prototype[method as never] = ((): void => {
        /* do nothing, its mocked */
      }) as never)
  );

  allProperties.forEach(method => {
    Object.defineProperty(mockedClass.prototype, method, {
      get() {
        return '';
      },
      configurable: true,
    });
  });

  return mockedClass as Clazz<T>;
}
