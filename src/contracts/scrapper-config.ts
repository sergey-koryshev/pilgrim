/**
 * Represents scrapper configuration schema.
 */
export interface ScrapperConfig {
  /**
   * Unique id of scrapper.
   */
  id: string;

  /**
   * Interval in ms.
   */
  interval: number;
}