import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export interface Messages {
  sprintId: number;
  studentId: number;
  templateId: number;
  timestamp: Generated<string>;
  url: string;
}

export interface Sprints {
  id: Generated<number>;
  sprintCode: string;
  title: string;
}

export interface Students {
  id: Generated<number>;
  name: string;
  username: string;
}

export interface Templates {
  id: Generated<number>;
  text: string;
}

export interface DB {
  messages: Messages;
  sprints: Sprints;
  students: Students;
  templates: Templates;
}
