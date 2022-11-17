/**
 * CustomerClass
 * @param {string}  name
 */
export class Customer {
  name: string;
  totalRevenue: number;

  constructor(name: string) {
    this.name = name;
    this.totalRevenue = 0;
  }

  /**
   * Customer.addRevenue
   * It adds amount to total revenue.

   * @param {number} amount
   */
  public addRevenue(amount: number) {
    this.totalRevenue = this.totalRevenue + amount;
  }

  /**
   * Customer.addRefund
   * It  subtracts amount to total revenue.
   * @param {number} amount
   */

  public addRefund(amount: number) {
    this.totalRevenue = this.totalRevenue - amount;
  }

  /**
   * Customer.getNetRevenue
   * It returns total amount of Revenue.
   * @return {string} amount
   */
  public getNetRevenue(): string {
    return (this.totalRevenue).toFixed(2) || "0";
  }

  /**
   * Customer.getName
   * It returns name of Customer
   * @return{number} amount
   */
  public getName(): string {
    return this.name;
  }
}
