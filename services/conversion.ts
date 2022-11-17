/**
 * Conversion Class
 * @param {string} type: weekly-daily
 */
export class Conversion {
  type: string;
  sessions: number;
  totalPurchased: number;

  constructor(type: string) {
    this.type = type;
    this.sessions = 0;
    this.totalPurchased = 0;
  }
  /**
   * Conversion.addPurchase
   * It increases totalPurchase number by 1
   */
  public addPurchase() {
    this.totalPurchased = this.totalPurchased + 1;
  }
  /**
   * Conversion.addSession
   * It session value by 1
   */
  public addSession() {
    this.sessions = this.sessions + 1;
  }

  /**
   * Conversion.getType
   * It returns type of the conversion
   *  @param {string} type
   */

  public getType(): string {
    return this.type;
  }
  /**
   * Conversion.getPurchases
   * It returns number of purchased.
   */
  public getPurchases(): string {
    return String(this.totalPurchased);
  }

  /**
   * Conversion.getPurchases
   * It returns number of sessions.
   *   @param {number} sessions
   */

  public getSessions(): string {
    return String(this.sessions);
  }

  /**
   * Conversion.getPurchases
   * It returns ratio of purchased sessions.
   * @param {number} successRate
   */
  public getSuccessRate(): string {
    return ((100 * this.totalPurchased) / this.sessions).toFixed(2);
  }
}
