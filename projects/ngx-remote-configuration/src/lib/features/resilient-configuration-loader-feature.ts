import {makeRemoteConfigurationFeature, RemoteConfigurationFeature} from "./configuration-feature";
import {DEFAULT_RETRY_CONFIGURATION, IRetryConfiguration} from "../types";
import {ConfigurationLoader, HttpClientConfigurationLoader, ResilientConfigurationLoader} from "../loader";
import {LOADER_RETRY_CONFIG} from "../constants";

/**
 * Decorates default {@link ConfigurationLoader} with resiliency.
 * Add retries while loading configuration.
 *
 * @param config - optional retry configuration. If not provided, default retry configuration will be used.
 * @see DEFAULT_RETRY_CONFIGURATION
 */
export function withResilientConfigurationLoader(
  config?: IRetryConfiguration): RemoteConfigurationFeature {

  const retryConfig = {...DEFAULT_RETRY_CONFIGURATION, ...(config ?? {})}
  return makeRemoteConfigurationFeature([
    // Add retry options
    {provide: LOADER_RETRY_CONFIG, useValue: retryConfig},

    // Add resilient configuration loader
    {provide: HttpClientConfigurationLoader, useClass: HttpClientConfigurationLoader},
    {
      provide: ConfigurationLoader,
      useFactory: resilientConfigurationLoaderFactory,
      deps: [HttpClientConfigurationLoader, LOADER_RETRY_CONFIG]
    }
  ]);
}

function resilientConfigurationLoaderFactory(
  loader: HttpClientConfigurationLoader,
  retryConfig: IRetryConfiguration): ConfigurationLoader {
  return new ResilientConfigurationLoader(loader, retryConfig);
}
