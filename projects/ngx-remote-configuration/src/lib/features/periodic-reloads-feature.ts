import {
  makeRemoteConfigurationFeature,
  RemoteConfigurationFeature,
} from './configuration-feature';
import { PERIODIC_RELOAD_INTERVAL } from '../constants';
import {
  ConfigurationLoader,
  HttpClientConfigurationLoader,
  PeriodicConfigurationLoader,
  ResilientConfigurationLoader,
} from '../loader';
import { Optional } from '@angular/core';

/**
 * Decorates default {@link ConfigurationLoader} with periodic reloads.
 * Add reloads to configuration.
 *
 * @param refreshInterval - optional refresh interval in seconds.
 * If not provided, default refresh interval will be used (15sec).
 */
export function withPeriodicReloads(refreshInterval = 15): RemoteConfigurationFeature {
  return makeRemoteConfigurationFeature([
    // Add refresh interval
    { provide: PERIODIC_RELOAD_INTERVAL, useValue: refreshInterval },

    // Add periodic configuration loader
    {
      provide: PeriodicConfigurationLoader,
      useFactory: periodicConfigurationLoaderFactory,
      deps: [
        [new Optional(), ResilientConfigurationLoader],
        HttpClientConfigurationLoader,
        PERIODIC_RELOAD_INTERVAL,
      ],
    },
  ]);
}

function periodicConfigurationLoaderFactory(
  loader: ResilientConfigurationLoader | null,
  fallbackLoader: HttpClientConfigurationLoader,
  refreshInterval: number
): ConfigurationLoader {
  return new PeriodicConfigurationLoader(loader ?? fallbackLoader, refreshInterval);
}
