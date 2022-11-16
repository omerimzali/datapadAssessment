/**
 * Brand Class,
 * @param {string} name
 */
export class Brand {
  name: string;
  totalRevenue: number;
  totalPurchased: number;
  constructor(name: string) {
    this.name = name;
    this.totalRevenue = 0;
    this.totalPurchased = 0;
  }

  /**
   * Brand.addPurchase
   * It increases totalPurchase number by 1 and totalRevenue by amount
   * @param {number} amount
   */
  public addPurchase(amount: number) {
    this.totalRevenue = this.totalRevenue + amount;
    this.totalPurchased = this.totalPurchased + 1;
  }

  /**
   * Brand.getAvgRevenue
   * It returns average revenue.
   * @param {number} amount
   * @return {number} averageRevenue
   */
  public getAvgRevenue(): number {
    return this.totalRevenue / this.totalPurchased;
  }

    /**
   * Brand.getAvgRevenue
   * It returns name of the brand
   * @return {string} this.name
   */
  public getName(): string {
    return this.name;
  }
}
