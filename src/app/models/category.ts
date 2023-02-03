export class Category {
  id!: number;
  name!:string;

  constructor(category:any){
    this.id = category.id;
    this.name = category.name;
  }
}
