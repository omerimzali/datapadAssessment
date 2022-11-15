
export class Customer{
    name: string;
    totalRevenue: number;

    constructor(name: string){
      this.name = name;
      this.totalRevenue = 0;
    
    }
  
    public addRevenue(amount: number){
      this.totalRevenue = this.totalRevenue+amount;
    }
  
    public getNetRevenue():number{
        return this.totalRevenue;
    }
  
    public getName():string{
      return this.name;
    }
  
  }