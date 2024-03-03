import { ScrapperStatus } from './contracts/enums/scrapper-status';
import { ScrapperConfig } from './contracts/scrapper-config';

/**
 * Base class for the scrapper.
 */
export abstract class ScrapperBase {
  private _status: ScrapperStatus = ScrapperStatus.none;
  private _id: string;
  private _interval: number;
  private _timeout: NodeJS.Timeout;
  private scheduledCancellation = false;
  private isCurrentTickInProgress = false;

  /**
   * Gets or sets list of errors.
   */
  public errors: string[] = [];

  /**
   * Gets status of the scrapper.
   */
  public get status(): ScrapperStatus {
    return this._status;
  }

  /**
   * Gets id of the scrapper.
   */
  public get id(): string {
    return this._id;
  }

  /**
   * Creates instance of the scrapper.
   * @param config Scrapper configuration.
   */
  constructor(config: ScrapperConfig) {
    this._id = config.id;
    this._interval = config.interval;
  }

  /**
   * Schedules the scrapper to start.
   */
  public start(): void {
    this._timeout = setTimeout(() => this.internalScrape(), 0);
    this._status = ScrapperStatus.inProgress;
    console.log(`Scrapper '${this.id}': Page scrapper scheduled to start`);
  }

  /**
   * Schedules the scrapper to stop.
   */
  public stop(): void {
    if (this.isCurrentTickInProgress) {
      this.scheduledCancellation = true;
      console.log(`Scrapper '${this.id}': Cancellation scheduled`);
    } else {
      this.stopScrape();
    }
  }

  /**
   * The method contains main logic of the scrapper.
   */
  protected abstract scrape(): Promise<void>;

  private async internalScrape(): Promise<void> {
    try {
      this.isCurrentTickInProgress = true;
      console.log(`Scrapper '${this.id}': Tick started`);
      await this.scrape();
      console.log(`Scrapper '${this.id}': Tick finished`);
    } catch(ex) {
      this.errors.push(ex.message)
    } finally {
      if (!this.scheduledCancellation) {
        this._timeout = setTimeout(() => this.internalScrape(), this._interval);
      } else {
        this.stopScrape();
      }
      
      this.isCurrentTickInProgress = false;
    }
  }

  private stopScrape() {
    clearTimeout(this._timeout);
    this._status = ScrapperStatus.stopped;
    this.scheduledCancellation = false;
    console.log(`Scrapper '${this.id}': Page scrapper stopped`);
  }
}