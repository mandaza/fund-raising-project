import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { BookingActions } from "@/components/home/BookingActions";
import { EventCountdownCard } from "@/components/home/EventCountdownCard";
import { EVENT_INFO } from "@/lib/utils/constants";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const IMPACT_REVALIDATE_SECONDS = 60;

export const revalidate = 60;

function getEventStartDate(): Date {
  const [year, month, day] = EVENT_INFO.date.split("-").map((v) => parseInt(v, 10));
  const [hours, minutes] = EVENT_INFO.time.split(":").map((v) => parseInt(v, 10));
  return new Date(year, (month ?? 1) - 1, day ?? 1, hours ?? 0, minutes ?? 0, 0, 0);
}

function getFormattedEventDate(): string {
  const [year, month, day] = EVENT_INFO.date.split("-").map((v) => parseInt(v, 10));
  const utcDate = new Date(Date.UTC(year ?? 2026, (month ?? 1) - 1, day ?? 1));
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(utcDate);
}

function getMapEmbedUrl(): string {
  return `https://maps.google.com/maps?q=${encodeURIComponent(EVENT_INFO.address)}&z=15&output=embed`;
}

interface ImpactViewModel {
  seatsBooked: number;
  amountRaised: number;
  currency: string;
}

async function getHomePageImpact(): Promise<ImpactViewModel | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(`${API_URL}/api/bookings/summary`, {
      signal: controller.signal,
      next: { revalidate: IMPACT_REVALIDATE_SECONDS },
    });

    if (!response.ok) {
      return null;
    }

    const summary = await response.json();
    const amountRaised = Number(summary.amount_raised);

    return {
      seatsBooked: Number(summary.seats_booked) || 0,
      amountRaised: Number.isFinite(amountRaised) ? amountRaised : 0,
      currency: summary.currency || "USD",
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export default async function Home() {
  const eventStart = getEventStartDate();
  const impact = await getHomePageImpact();

  const formattedDate = getFormattedEventDate();
  const mapEmbedUrl = getMapEmbedUrl();

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
            <BookingActions
              primaryHref="/book/corporate"
              primaryLabel="Book Corporate Table"
              secondaryHref="/book/individual"
              secondaryLabel="Book Individual Seat"
              className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
              primaryClassName="!bg-white !text-primary hover:!bg-gray-100"
              secondaryClassName="border-white text-white hover:bg-white/10"
            />
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
              <BookingActions
                primaryHref="/book/individual"
                primaryLabel="Book Individual Seat"
                secondaryHref="/book/corporate"
                secondaryLabel="Book Corporate Table"
                className="mt-8 flex flex-col sm:flex-row gap-3"
                primaryClassName="w-full sm:w-auto"
                secondaryClassName="w-full sm:w-auto"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Countdown */}
      <section className="py-16 bg-white">
        <Container>
          <div className="max-w-6xl mx-auto">
            <EventCountdownCard eventStartIso={eventStart.toISOString()} formattedDate={formattedDate} />
          </div>
        </Container>
      </section>

      {/* Event location */}
      <section className="py-16 bg-white">
        <Container>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Event Location</h2>
              <p className="text-lg text-gray-600">Find the venue easily and plan your route before the dinner.</p>
            </div>

            <div className="rounded-3xl overflow-hidden border border-gray-200 bg-gray-50 shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.8fr]">
                <div className="min-h-[420px]">
                  <iframe
                    title={`Map of ${EVENT_INFO.venue}`}
                    src={mapEmbedUrl}
                    className="h-full min-h-[420px] w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary mb-3">Venue Details</p>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900">{EVENT_INFO.venue}</h3>
                  <p className="mt-3 text-base md:text-lg text-gray-600">{EVENT_INFO.address}</p>
                  <div className="mt-6 space-y-3 text-gray-700">
                    <p>
                      <span className="font-semibold text-gray-900">Date:</span> {formattedDate}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-900">Time:</span> {EVENT_INFO.time}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-900">Dress code:</span> Smart casual
                    </p>
                  </div>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(EVENT_INFO.address)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-8 inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-white font-medium hover:bg-primary-dark transition-colors"
                  >
                    Open In Google Maps
                  </a>
                </div>
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
            <Link
              href="/return"
              className="font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 inline-flex items-center justify-center border-2 border-primary text-primary hover:bg-primary/10 focus:ring-primary/30 px-8 py-4 text-lg"
            >
              Check My Booking
            </Link>
          </div>
        </Container>
      </section>

      {/* Bottom CTA */}
      <section className="py-16">
        <Container>
          <div className="rounded-3xl bg-[#facc5c] text-gray-900 px-8 py-12 text-center shadow-sm">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Be Part of the Change</h2>
            <p className="text-lg text-gray-800 max-w-2xl mx-auto">
              Every booking supports a child with special needs. Join MOSH and help build a more inclusive future.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
              <div className="rounded-2xl bg-white/50 border border-white/60 p-6">
                <p className="text-sm font-medium text-gray-700">People booked</p>
                <p className="mt-2 text-4xl font-bold tabular-nums">
                  {impact ? impact.seatsBooked.toLocaleString() : "—"}
                </p>
              </div>
              <div className="rounded-2xl bg-white/50 border border-white/60 p-6">
                <p className="text-sm font-medium text-gray-700">Raised so far</p>
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
            {!impact && <p className="mt-3 text-sm text-gray-700">Live impact data is temporarily unavailable.</p>}

            <BookingActions
              primaryHref="/book/individual"
              primaryLabel="Book Individual Seat"
              secondaryHref="/book/corporate"
              secondaryLabel="Book Corporate Table"
              className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
              primaryClassName="!bg-primary !text-white hover:!bg-primary-dark"
              secondaryClassName="border-gray-900 text-gray-900 hover:bg-gray-900/10"
            />
          </div>
        </Container>
      </section>

      <Footer />
    </div>
  );
}
