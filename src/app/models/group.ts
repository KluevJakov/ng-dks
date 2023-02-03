import { Category } from "./category";
import { Lesson } from "./lesson";
import { User } from "./user";

export class Group {
  id!: number;
  name!:string;
  category!:Category;
  students!:Array<User>;
  lessons!:Array<Lesson>;
  teacher!:User;

  constructor(group:any){
    this.id = group.id;
    this.name = group.name;
    this.category = group.category;
    this.students = group.students;
    this.lessons = group.lessons;
    this.teacher = group.teacher;
  }
}
