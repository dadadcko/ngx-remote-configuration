import { InjectionToken } from '@angular/core';
import { IRetryConfiguration } from './types';

export const CONFIG_URL = new InjectionToken<string>('CONFIG_URL_TOKEN');

export const LOADER_RETRY_CONFIG = new InjectionToken<IRetryConfiguration>(
  'LOADER_RETRY_CONFIG_TOKEN'
);

export const PERIODIC_RELOAD_INTERVAL = new InjectionToken<number>(
  'PERIODIC_RELOAD_INTERVAL_TOKEN'
);

// Default config url
export const DEFAULT_CONFIG_URL = 'assets/app-config.json';
