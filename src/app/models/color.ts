export class Color {
  id!: number;
  primary!:string;

  constructor(color:any){
    this.id = color.id;
    this.primary = color.primary;
  }
}
