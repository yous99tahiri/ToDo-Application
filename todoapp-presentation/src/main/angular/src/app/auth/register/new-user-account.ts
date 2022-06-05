export class NewUserAccount{
    username: string;
    password: string;
    created: Date;
  
    static fromObject(object: any): NewUserAccount {
      const n = new NewUserAccount();
      n.username = object.username;
      n.password = object.password;
      n.created = new Date(object.created);
      return n;
    }
  }
  