
export class Conversion{
    type: string;
    sessions: number;
    totalPurchased: number;
  

    constructor(type: string){
      this.type = type;
      this.sessions = 0;
      this.totalPurchased = 0;
   

    }
  
    public addPurchase(){
      this.totalPurchased = this.totalPurchased+1;
    }

    public addSession(){
        this.sessions = this.sessions+1;
    }
  
    public getType():string{
      return this.type
    }

    public getPurchases():number{
        return this.totalPurchased;
    }

    public getSessions():number{
        return this.sessions;
    }

    public getSuccessRate():number{
        return ((100*this.totalPurchased)/this.sessions).toFixed(3);
    }
  
  }