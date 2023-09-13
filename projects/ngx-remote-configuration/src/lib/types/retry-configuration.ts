/**
 * Retry configuration for resilient loader.
 */
export interface IRetryConfiguration {
  /**
   * Number of retries.
   *
   * @default 3
   */
  retryCount?: number,

  /**
   * Delay between retries in milliseconds.
   *
   * @default 100
   */
  delay?: number,
}

/**
 * Default retry configuration.
 *
 * @default {count: 3, delay: 100}
 */
export const DEFAULT_RETRY_CONFIGURATION: IRetryConfiguration = {
  retryCount: 3,
  delay: 100,
}
