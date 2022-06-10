export class NewUserAccount{
    username: string;
    password: string;
    registrationDate: Date;
  
    static fromObject(object: any): NewUserAccount {
      const n = new NewUserAccount();
      n.username = object.username;
      n.password = object.password;
      n.registrationDate = new Date(object.registrationDate);
      return n;
    }
  }
  