import type { Block } from "payload";

export const CourseList: Block = {
  slug: "course-list",
  labels: { singular: "Course list", plural: "Course lists" },
  fields: [
    { name: "heading", type: "text" },
    { name: "intro", type: "textarea" },
  ],
};
