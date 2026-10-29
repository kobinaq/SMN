import { redirect } from "next/navigation";
import { pageTitle } from "@/lib/brand";

export const metadata = { title: pageTitle("New course", { staff: true }) };

export default function NewWebsiteCoursePage() {
  redirect("/staff/learning/courses/new");
}
