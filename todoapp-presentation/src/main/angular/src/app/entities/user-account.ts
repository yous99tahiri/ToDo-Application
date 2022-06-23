export class UserAccount{
    id:number = 0;
    username: string ="";
    password: string ="";
    registrationDate: Date = null;
    role:USER_ROLE = USER_ROLE.REGULAR
  
    static fromObject(object: any): UserAccount {
      console.log(`UserAccount: fromObject called for ${JSON.stringify(object)}`)
      const n = new UserAccount();
      n.id = object.id;
      n.username = object.username;
      n.password = object.password;
      n.registrationDate = new Date(object.registrationDate);
      n.role = object.role;
      return n;
    }

    toObject():any {
      const obj = {
        "id":this.id,
        "username" : this.username,
        "password" : this.password,
        "registrationDate" : this.registrationDate != null ? this.registrationDate.toISOString() : "null",
        "role":this.role
      }
      console.log(`UserAccount: toObject called for ${JSON.stringify(obj)}`);
      return obj;
    }
}

export const enum USER_ROLE{
  REGULAR,
  ADMIN
}


  