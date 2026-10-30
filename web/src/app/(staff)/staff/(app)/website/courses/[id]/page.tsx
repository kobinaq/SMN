import { redirect } from "next/navigation";
import { pageTitle } from "@/lib/brand";

export const metadata = { title: pageTitle("Course", { staff: true }) };

export default function EditWebsiteCoursePage() {
  redirect("/staff/learning");
}
