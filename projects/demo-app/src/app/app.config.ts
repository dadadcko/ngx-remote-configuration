import { ApplicationConfig } from '@angular/core';
import {
  provideRemoteConfiguration,
  withCustomConfigurationUrl,
  withLoadOnApplicationBootstrap,
  withPeriodicReloads,
  withResilientConfigurationLoader,
} from 'ngx-remote-configuration';

export const appConfig: ApplicationConfig = {
  providers: [
    // register the remote configuration provides
    // with optional features
    provideRemoteConfiguration(
      // you can customize the url to the remote configuration
      withCustomConfigurationUrl('assets/my-demo-config.json'),

      // you can add resiliency to configuration loader
      // if you opt out options, the default values will be used
      withResilientConfigurationLoader({ retryCount: 4, delay: 200 /* milliseconds */ }),

      // you can add periodic reloads to the configuration
      // consumers will be notified only when the configuration changes
      withPeriodicReloads(15 /* seconds */),

      // you can add a load on application bootstrap.
      // it uses APP_INITIALIZER to load the configuration and therefore block application startup
      // until the configuration is loaded
      withLoadOnApplicationBootstrap()
    ),
  ],
};
