
export class Brand{
    name: string;
    totalRevenue: number;
    totalPurchased: number;
    constructor(name: string){
      this.name = name;
      this.totalRevenue = 0;
      this.totalPurchased = 0;
    }
  
    public addPurchase(amount: number){
      this.totalRevenue = this.totalRevenue+amount;
      this.totalPurchased = this.totalPurchased+1;
    }
  
    public getAvgRevenue():number{
      return this.totalRevenue / this.totalPurchased;
    }
  
    public getName():string{
      return this.name;
    }
  
  }