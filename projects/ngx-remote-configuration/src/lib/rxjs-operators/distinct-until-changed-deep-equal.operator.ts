import { distinctUntilChanged, MonoTypeOperatorFunction } from 'rxjs';

/**
 * Filter emission of distinct values from source observable
 * Uses deep equal comparison, recursively comparing object properties
 *
 * @returns MonoTypeOperatorFunction<T> - filtered source observable of distinct values
 */
export function distinctUntilChangedDeepEqualOperator<T>(): MonoTypeOperatorFunction<T> {
  return source => source.pipe(distinctUntilChanged(_isDeepStrictEqual));
}

function _isDeepStrictEqual<T>(left: T | undefined, right: T | undefined): boolean {
  if (left === right) return true;

  if (typeof left == 'object' && left != null && typeof right == 'object' && right != null) {
    if (Object.keys(left).length != Object.keys(right).length) return false;

    for (const prop in left) {
      if (Object.prototype.hasOwnProperty.call(right, prop)) {
        if (!_isDeepStrictEqual(left[prop], right[prop])) return false;
      } else return false;
    }

    return true;
  }

  return false;
}
