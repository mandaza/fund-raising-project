import React from "react";
import { EVENT_INFO } from "@/lib/utils/constants";

export interface EventDetailsProps {
  eventName?: string;
  date?: string;
  time?: string;
  venue?: string;
  address?: string;
  description?: string;
}

export function EventDetails({
  eventName = EVENT_INFO.name,
  date = EVENT_INFO.date,
  time = EVENT_INFO.time,
  venue = EVENT_INFO.venue,
  address = EVENT_INFO.address,
  description = EVENT_INFO.description,
}: EventDetailsProps) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{eventName}</h2>
        {description && <p className="text-lg text-gray-600 max-w-3xl mx-auto">{description}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {/* Date */}
        <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/15 text-primary mb-3">
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Date</h3>
          <p className="text-sm text-gray-600">{formattedDate}</p>
        </div>

        {/* Time */}
        <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/15 text-primary mb-3">
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Time</h3>
          <p className="text-sm text-gray-600">{time}</p>
        </div>

        {/* Venue */}
        <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/15 text-primary mb-3">
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Venue</h3>
          <p className="text-sm text-gray-600">{venue}</p>
          {address && <p className="text-xs text-gray-500 mt-1">{address}</p>}
        </div>
      </div>
    </div>
  );
}
