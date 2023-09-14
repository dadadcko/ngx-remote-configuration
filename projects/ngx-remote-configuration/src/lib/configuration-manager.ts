import { inject, Injectable, Type } from '@angular/core';
import { ConfigurationLoader } from './loader';
import { IConfiguration } from './types';
import { map, Observable, shareReplay } from 'rxjs';
import { distinctUntilChangedDeepEqualOperator, selectNestedValue } from './rxjs-operators';

/**
 * Configuration manager
 *
 */
@Injectable()
export class ConfigurationManager {
  private readonly loader = inject(ConfigurationLoader);

  // actual configuration stream
  private readonly _configStream = this.loader
    .load()
    .pipe(distinctUntilChangedDeepEqualOperator()) // emit only when configuration changes
    .pipe(shareReplay(1)); // share same configuration stream to all subscribers

  /**
   * Stream of current configuration.
   *
   * Emits new configuration each time new value is available.
   * @remarks This method returns untyped configuration object, containing any possible value.
   * Use {@link value$} to bind configuration section to class instance and get type support.
   */
  public get configuration$(): Observable<IConfiguration> {
    return this._configStream;
  }

  /**
   * Get configuration stream, scoped to property specified by key
   * Property can be primitive, array or nested object.
   *
   * @param key - dot separated path to property
   *
   * @param bindTo - optional class to bind configuration section to.
   * When specified, new instance of class is created
   * and configuration section is bound to that instance.
   *
   * @returns Observable stream of scoped configuration based on key.
   * If property is not found, `undefined` is emitted.
   *
   * @remarks
   *  - Emits new value each time a new value for specified property is available.
   *  - Equality check is deep strict, so it also check nested values for updates.
   *  - When parameter `bindTo` is specified, actual instance of class is created
   *  and whole configuration section is bound to that instance.
   *
   * @example
   * // get nested value
   * const value$ = configurationManager.value$('section.subsection.value');
   *
   * // get value from nested array
   * const value$ = configurationManager.value$('section.0.value');
   */
  public value$<T>(key: string, bindTo?: Type<T>): Observable<T | undefined> {
    return this.configuration$.pipe(
      selectNestedValue<T>(key),
      distinctUntilChangedDeepEqualOperator(),
      map(v => (bindTo && !!v ? Object.assign(new bindTo() as object, v) : v))
    );
  }
}
