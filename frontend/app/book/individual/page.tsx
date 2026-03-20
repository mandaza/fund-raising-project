import { redirect } from "next/navigation";

export default function IndividualBookingPage() {
  redirect("/book?type=individual");
}
