import { Color } from "./color";
import { Group } from "./group";

export class Lesson {
  id!: number;
  title!:string;
  description!:string;
  homework!:string;
  start!:Date;
  end!:Date;
  group!:Group;
  color!:Color;

  constructor(lesson:any){
    this.id = lesson.id;
    this.title = lesson.title;
    this.description = lesson.description;
    this.homework = lesson.homework;
    this.start = lesson.start;
    this.end = lesson.end;
    this.group = lesson.group;
    this.color = lesson.color;
  }
}
