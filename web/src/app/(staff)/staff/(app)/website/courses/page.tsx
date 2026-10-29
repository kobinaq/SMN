import { redirect } from "next/navigation";
import { pageTitle } from "@/lib/brand";

export const metadata = { title: pageTitle("Courses", { staff: true }) };

export default function WebsiteCoursesPage() {
  redirect("/staff/learning");
}
