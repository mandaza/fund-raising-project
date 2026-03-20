import { redirect } from "next/navigation";

export default function CorporateBookingPage() {
  redirect("/book?type=corporate");
}
