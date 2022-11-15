
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

    public addRefund(amount: number){
        this.totalRevenue = this.totalRevenue-amount;
    }
  
    public getNetRevenue():string{
        return  (this.totalRevenue).toFixed(2);
    }
  
    public getName():string{
      return this.name;
    }
  
  }