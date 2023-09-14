import { Inject, Injectable } from '@angular/core';
import { ConfigurationLoader } from './configuration-loader';
import { Observable, retry } from 'rxjs';
import { IConfiguration, IRetryConfiguration } from '../types';
import { LOADER_RETRY_CONFIG } from '../constants';

/**
 * Resilient configuration loader
 * Decorator for configuration loader, which adds retry logic
 */
@Injectable()
export class ResilientConfigurationLoader implements ConfigurationLoader {
  constructor(
    private readonly inner: ConfigurationLoader,
    @Inject(LOADER_RETRY_CONFIG) private readonly retryConfig: IRetryConfiguration
  ) {}

  public load(): Observable<IConfiguration> {
    return this.inner.load().pipe(
      retry({
        count: this.retryConfig.retryCount,
        delay: this.retryConfig.delay,
        resetOnSuccess: true,
      })
    );
  }
}
