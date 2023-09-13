import {Provider} from "@angular/core";

/**
 * A feature for use when configuring `provideRemoteConfiguration`.
 */
export interface RemoteConfigurationFeature {
  kind: 'RemoteConfigurationFeature';
  providers: Provider[];
}

export function makeRemoteConfigurationFeature(providers: Provider[]): RemoteConfigurationFeature {
  return {
    kind: 'RemoteConfigurationFeature',
    providers: providers,
  };
}
