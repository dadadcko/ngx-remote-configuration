import { EnvironmentProviders, makeEnvironmentProviders, Optional, Self } from '@angular/core';
import { ConfigurationManager } from './configuration-manager';
import {
  ConfigurationLoader,
  HttpClientConfigurationLoader,
  PeriodicConfigurationLoader,
  ResilientConfigurationLoader,
} from './loader';
import { provideHttpClient } from '@angular/common/http';
import { CONFIG_URL, DEFAULT_CONFIG_URL } from './constants';
import { RemoteConfigurationFeature } from './features';

/**
 * Configures {@link ConfigurationManager} service to be available for injection.
 *
 * By default, `ConfigurationManager` will be configured for injection with its default
 * configuration loader and default configuration url.
 *
 * Additional configuration options can be provided by passing
 * feature functions to `provideRemoteConfiguration`.
 * For example, resilient configuration loader can be added using the
 * `withResilientConfigurationLoader(...)` feature.
 *
 * @param features - optional features to enrich configuration
 * @see withResilientConfigurationLoader
 * @see withCustomConfigurationUrl
 * @see withLoadOnApplicationBootstrap
 * @see withPeriodicReloads
 * @publicApi
 */
export function provideRemoteConfiguration(
  ...features: RemoteConfigurationFeature[]
): EnvironmentProviders {
  return makeEnvironmentProviders([
    // Add http client provider
    provideHttpClient(),

    // Add default config url
    { provide: CONFIG_URL, useValue: DEFAULT_CONFIG_URL },

    // Add default configuration loader
    { provide: HttpClientConfigurationLoader, useClass: HttpClientConfigurationLoader },
    {
      provide: ConfigurationLoader,
      useFactory: (...loaders: ConfigurationLoader[]) => loaders.find(loader => !!loader),
      deps: [
        [new Optional(), new Self(), PeriodicConfigurationLoader],
        [new Optional(), new Self(), ResilientConfigurationLoader],
        HttpClientConfigurationLoader,
      ],
    },

    // Add configuration manager
    { provide: ConfigurationManager, useClass: ConfigurationManager },

    // Add feature providers
    ...features.map(feature => feature.providers),
  ]);
}

export {
  withResilientConfigurationLoader,
  withCustomConfigurationUrl,
  withLoadOnApplicationBootstrap,
  withPeriodicReloads,
} from './features';
