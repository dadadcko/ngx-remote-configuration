import {map, OperatorFunction} from "rxjs";
import {IConfiguration} from "../types";


/**
 * Select nested value from configuration object
 * @param key - dot separated path to nested value
 * @returns OperatorFunction<IConfiguration, T | undefined> - observable of selected value
 * or undefined if value not found
 *
 * @example
 * // get value from configuration
 * this.configurationManager.configuration$.pipe(
 *  selectNestedValue<string>('section.subsection.value')
 *  ).subscribe(value => console.log(value));
 *
 *  // works also for arrays
 *  ... selectNestedValue<string>('section.2.value') ...
 */
export function selectNestedValue<T>(key: string): OperatorFunction<IConfiguration, T | undefined> {
  const keys = !!key ? key.split('.') : [];
  return source => source.pipe(
    map(config => _findValue<T>(config, keys)
    )
  );
}

function _findValue<T>(config: IConfiguration, keys: string[]): T | undefined {
  return keys.reduce((value, key) => value?.[key], config) as T | undefined
}
