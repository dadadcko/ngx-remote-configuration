import {
  makeRemoteConfigurationFeature,
  RemoteConfigurationFeature,
} from './configuration-feature';
import { APP_INITIALIZER } from '@angular/core';
import { ConfigurationManager } from '../configuration-manager';
import { Observable, take } from 'rxjs';
import { IConfiguration } from '../types';

/**
 * Feature which will load the remote configuration before the application starts.
 * By default, configuration is loaded lazily, when it is requested for the first time.
 * This feature opposes this behavior and loads the configuration before the application starts.
 *
 * @remarks Application will be blocked until the configuration is loaded.
 * @note When error occurs during the configuration loading, application will not start!
 *
 * @PublicApi
 */
export function withLoadOnApplicationBootstrap(): RemoteConfigurationFeature {
  return makeRemoteConfigurationFeature([
    // Add APP_INITIALIZER which will load the remote configuration before the application starts
    {
      provide: APP_INITIALIZER,
      useFactory: loadRemoteConfiguration,
      deps: [ConfigurationManager],
      multi: true,
    },
  ]);
}

function loadRemoteConfiguration(configurationManager: ConfigurationManager) {
  return (): Observable<IConfiguration> => configurationManager.configuration$.pipe(take(1));
}
