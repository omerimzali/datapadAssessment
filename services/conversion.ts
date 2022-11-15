
export class Conversion{
    type: string;
    sessions: number;
    totalPurchased: number;
    revenue: number;

    constructor(type: string){
      this.type = type;
      this.sessions = 0;
      this.totalPurchased = 0;
      this.revenue = 0;

    }
  
    public addPurchase(amount: number){
      this.revenue = this.revenue+amount;
      this.totalPurchased = this.totalPurchased+1;
    }

    public addSession(){
        this.sessions = this.sessions+1;
    }
  
    public getAvgRevenue():number{
      return this.revenue / this.totalPurchased;
    }
  
    public getType():string{
      return this.type
    }

    public getPurchases():number{
        return this.totalPurchased;
    }

    public getRevenue():number{
        return this.revenue;
    }

    public getSessions():number{
        return this.sessions;
    }
  
  }