import { Group } from "./group";
import { User } from "./user";

export class Lesson {
  id!: number;
  title!:string;
  description!:string;
  homework!:string;
  start!:Date;
  end!:Date;
  group!:Group;

  constructor(lesson:any){
    this.id = lesson.id;
    this.title = lesson.title;
    this.description = lesson.description;
    this.homework = lesson.homework;
    this.start = lesson.start;
    this.end = lesson.end;
    this.group = lesson.group;
  }
}
