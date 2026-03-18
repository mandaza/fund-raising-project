"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { EVENT_INFO } from "@/lib/utils/constants";
import { useRouter } from "next/navigation";
import { getBookingImpactSummary } from "@/lib/api/bookings";

function getEventStartDate(): Date {
  const [year, month, day] = EVENT_INFO.date.split("-").map((v) => parseInt(v, 10));
  const [hours, minutes] = EVENT_INFO.time.split(":").map((v) => parseInt(v, 10));
  return new Date(year, (month ?? 1) - 1, day ?? 1, hours ?? 0, minutes ?? 0, 0, 0);
}

export default function Home() {
  const router = useRouter();
  const eventStart = useMemo(() => getEventStartDate(), []);
  const [now, setNow] = useState(() => new Date());
  const [impact, setImpact] = useState<{
    seatsBooked: number;
    amountRaised: number;
    currency: string;
  } | null>(null);

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    let cancelled = false;
    getBookingImpactSummary()
      .then((summary) => {
        if (cancelled) return;
        const amountRaised = Number(summary.amount_raised);
        setImpact({
          seatsBooked: summary.seats_booked,
          amountRaised: Number.isFinite(amountRaised) ? amountRaised : 0,
          currency: summary.currency || "USD",
        });
      })
      .catch(() => {
        if (cancelled) return;
        setImpact(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const countdown = useMemo(() => {
    const diffMs = eventStart.getTime() - now.getTime();
    if (diffMs <= 0) {
      return { isLive: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / (24 * 3600));
    const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return { isLive: false, days, hours, minutes, seconds };
  }, [eventStart, now]);

  const formattedDate = new Date(EVENT_INFO.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary to-primary-dark text-white py-20">
        <Container>
          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight text-[#facc5c]">
              Empowering Children with Special Needs in Zimbabwe
            </h1>
            <p className="text-lg md:text-xl text-white/85 max-w-2xl mx-auto">
              Join Mothers of Special Heroes (MOSH) in creating a more inclusive future for children with neurological
              disabilities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button
                variant="primary"
                size="lg"
                onClick={() => router.push("/book/corporate")}
                className="!bg-white !text-primary hover:!bg-gray-100"
              >
                Book Corporate Table
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => router.push("/book/individual")}
                className="border-white text-white hover:bg-white/10"
              >
                Book Individual Seat
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* About MOSH */}
      <section className="py-16 bg-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Who We Are</h2>
            <p className="text-lg text-gray-600">
              Mothers of Special Heroes (MOSH) is a community-driven organisation supporting children with neurological
              disabilities such as autism, cerebral palsy, and Down syndrome. We empower caregivers, raise awareness,
              and promote inclusion in society.
            </p>
          </div>
        </Container>
      </section>

      {/* Why this event matters */}
      <section
        className="py-16 relative overflow-hidden"
        style={{ backgroundImage: "url(/dinner/dinner-1.jpg)", backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-primary/80"></div>
        <Container>
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why Your Support Matters</h2>
              <p className="text-lg text-white/90">
                Your participation in this fundraising event directly supports therapy, education, and community
                programs for children with special needs. Every seat booked contributes to building a more inclusive and
                supportive environment.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Impact</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 h-6 w-6 rounded-full bg-primary/15 text-primary flex items-center justify-center flex-none font-semibold">
                    1
                  </span>
                  <span>One seat can support a therapy session</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 h-6 w-6 rounded-full bg-primary/15 text-primary flex items-center justify-center flex-none font-semibold">
                    2
                  </span>
                  <span>One table can support a child’s development program</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 h-6 w-6 rounded-full bg-primary/15 text-primary flex items-center justify-center flex-none font-semibold">
                    3
                  </span>
                  <span>Your support empowers families and builds community</span>
                </li>
              </ul>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button size="lg" onClick={() => router.push("/book/individual")} className="w-full sm:w-auto">
                  Book Individual Seat
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => router.push("/book/corporate")}
                  className="w-full sm:w-auto"
                >
                  Book Corporate Table
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Event details */}
      <section className="py-16 bg-white">
        <Container>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Fundraising Dinner Event</h2>
              <p className="text-lg text-gray-600">Join us for an evening of purpose, connection, and impact.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
                <p className="text-sm font-medium text-gray-900 mb-2">Countdown</p>
                {countdown.isLive ? (
                  <p className="text-2xl font-bold text-primary">Happening now</p>
                ) : (
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { label: "Days", value: countdown.days },
                      { label: "Hrs", value: countdown.hours },
                      { label: "Min", value: countdown.minutes },
                      { label: "Sec", value: countdown.seconds },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="rounded-xl bg-white border border-gray-200 px-3 py-2 text-center"
                      >
                        <div className="text-lg font-bold text-gray-900 tabular-nums">
                          {String(item.value).padStart(2, "0")}
                        </div>
                        <div className="text-[11px] font-medium text-gray-600">{item.label}</div>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-sm text-gray-600 mt-4">{formattedDate}</p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-gray-50 overflow-hidden">
                <div className="relative h-36 w-full">
                  <Image
                    src="/dinner/dinner-2.jpg"
                    alt={`${EVENT_INFO.venue}`}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover"
                    priority={false}
                  />
                  <div className="absolute inset-0 bg-primary/25" />
                </div>
                <div className="p-6">
                <p className="text-sm font-medium text-gray-900 mb-2">Location</p>
                <p className="text-gray-700">{EVENT_INFO.venue}</p>
                <p className="text-sm text-gray-600 mt-1">{EVENT_INFO.address}</p>
                </div>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
                <p className="text-sm font-medium text-gray-900 mb-2">Time</p>
                <p className="text-gray-700">{EVENT_INFO.time}</p>
                <p className="text-sm text-gray-600 mt-1">Dress code: Smart casual</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Already Booked Section */}
      <section className="py-16 bg-gray-100">
        <Container>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Already Have a Booking?
            </h2>
            <p className="text-gray-600 mb-6">
              Enter your booking reference to check your status or upload payment proof
            </p>
            <Link href="/return">
              <Button variant="outline" size="lg">
                Check My Booking
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* Bottom CTA */}
      <section className="py-16">
        <Container>
          <div className="rounded-3xl bg-primary text-white px-8 py-12 text-center shadow-sm">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Be Part of the Change</h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Every booking supports a child with special needs. Join MOSH and help build a more inclusive future.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
              <div className="rounded-2xl bg-white/10 border border-white/15 p-6">
                <p className="text-sm font-medium text-white/85">People booked</p>
                <p className="mt-2 text-4xl font-bold tabular-nums">
                  {impact ? impact.seatsBooked.toLocaleString() : "—"}
                </p>
              </div>
              <div className="rounded-2xl bg-white/10 border border-white/15 p-6">
                <p className="text-sm font-medium text-white/85">Raised so far</p>
                <p className="mt-2 text-4xl font-bold tabular-nums">
                  {impact
                    ? `${impact.currency} ${impact.amountRaised.toLocaleString(undefined, {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}`
                    : "—"}
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="primary"
                size="lg"
                onClick={() => router.push("/book/individual")}
                className="!bg-white !text-primary hover:!bg-gray-100"
              >
                Book Individual Seat
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => router.push("/book/corporate")}
                className="border-white text-white hover:bg-white/10"
              >
                Book Corporate Table
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <Footer />
    </div>
  );
}
