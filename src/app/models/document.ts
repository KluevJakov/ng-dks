export class Document {
  id!: number;
  filePath!:string;
  name!:string;

  constructor(document:any){
    this.id = document.id;
    this.filePath = document.name;
    this.name = document.name;
  }
}
