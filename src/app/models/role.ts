export class Role {
  id!: number;
  displayName!:string;
  systemName!:string;

  constructor(role:any){
    this.id = role.id;
    this.displayName = role.displayName;
    this.systemName = role.systemName;
  }
}
