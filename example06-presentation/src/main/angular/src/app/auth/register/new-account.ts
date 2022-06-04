
export class NewAccount {
    username: string;
    password: string;
    created: Date;
  
    static fromObject(object: any): NewAccount {
      const n = new NewAccount();
      n.username = object.username;
      n.password = object.password;
      n.created = new Date(object.created);
      return n;
    }
  }
  