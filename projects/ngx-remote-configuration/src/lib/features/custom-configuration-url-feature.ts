import {
  makeRemoteConfigurationFeature,
  RemoteConfigurationFeature,
} from './configuration-feature';
import { CONFIG_URL } from '../constants';

/**
 * Customizes default config url.
 *
 * @param url - custom url, from which configuration will be loaded
 * @see DEFAULT_CONFIG_URL
 */
export function withCustomConfigurationUrl(url: string): RemoteConfigurationFeature {
  return makeRemoteConfigurationFeature([
    // Replace default config url with custom one
    { provide: CONFIG_URL, useValue: url },
  ]);
}
