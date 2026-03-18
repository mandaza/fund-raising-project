import React from "react";
import { EVENT_INFO, CONTACT_INFO } from "@/lib/utils/constants";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Event Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">{EVENT_INFO.name}</h3>
            <p className="text-sm mb-2">{EVENT_INFO.tagline}</p>
            <p className="text-sm">{EVENT_INFO.description}</p>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Contact Us</h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Email:</span> {CONTACT_INFO.email}
              </p>
              <p>
                <span className="font-medium">Phone:</span> {CONTACT_INFO.phone}
              </p>
              <p>
                <span className="font-medium">Address:</span> {CONTACT_INFO.address}
              </p>
            </div>
          </div>

          {/* Event Details */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Event Details</h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Date:</span>{" "}
                {new Date(EVENT_INFO.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p>
                <span className="font-medium">Time:</span> {EVENT_INFO.time}
              </p>
              <p>
                <span className="font-medium">Venue:</span> {EVENT_INFO.venue}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {currentYear} Fundraising Committee. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
