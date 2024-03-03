import { ScrapperBase } from "./scrapper-base";

/**
 * The controller to manage scrappers.
 */
export class ScrapperController {
  private _scrappers: {[key: string]: ScrapperBase} = {};

  /**
   * Gets list of added scrappers.
   */
  public get scrappers() {
    return Object.values(this._scrappers);
  }

  /**
   * Adds the scrapper to the controller.
   * @param scrapper The scrapper to add.
   */
  addPageScrapper(scrapper: ScrapperBase) {
    if (this._scrappers[scrapper.id] != null) {
      throw new Error(`Page Scrapper with id ${scrapper.id} already exists`);
    }

    this._scrappers[scrapper.id] = scrapper;
    console.log(`Scrapper controller: Page scrapper [${scrapper.id}] added`);
  }

  /**
   * Schedules all added scrappers to start.
   */
  startAll() {
    this.scrappers.forEach((scrapper) => {
      try {
        scrapper.start();
        console.log(`Scrapper controller: All page scrappers were scheduled to start`);
      } catch(ex) {
        scrapper.errors.push(ex.message);
      }
    });
  }

  /**
   * Schedules all added scrappers to stop.
   */
  stopAll() {
    this.scrappers.forEach((scrapper) => 
    {
      try {
        scrapper.stop();
        console.log(`Scrapper controller: Cancellation were scheduled for all page scrappers`);
      } catch(ex) {
        scrapper.errors.push(ex.message);
      }
    });
  }
}