import { Inject, Injectable } from '@angular/core';
import { ConfigurationLoader } from './configuration-loader';
import { PERIODIC_RELOAD_INTERVAL } from '../constants';
import { IConfiguration } from '../types';
import { catchError, exhaustMap, interval, Observable, startWith, switchMap } from 'rxjs';

/**
 * Periodic configuration loader
 * Decorator for configuration loader, which adds periodic reload logic
 */
@Injectable()
export class PeriodicConfigurationLoader implements ConfigurationLoader {
  constructor(
    private readonly inner: ConfigurationLoader,
    @Inject(PERIODIC_RELOAD_INTERVAL) private readonly reloadInterval: number
  ) {}

  public load(): Observable<IConfiguration> {
    return this.inner.load().pipe(switchMap(value => this.periodicReload().pipe(startWith(value))));
  }

  private periodicReload(): Observable<IConfiguration> {
    return interval(this.reloadInterval * 1000).pipe(
      exhaustMap(() => this.inner.load()),

      // ignore errors on reload - try again on next reload cycle
      catchError(() => this.periodicReload())
    );
  }
}
