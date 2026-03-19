"use client";

import { useEffect, useMemo, useState } from "react";

interface EventCountdownCardProps {
  eventStartIso: string;
  formattedDate: string;
}

export function EventCountdownCard({ eventStartIso, formattedDate }: EventCountdownCardProps) {
  const eventStart = useMemo(() => new Date(eventStartIso), [eventStartIso]);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
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

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-8 md:p-10 shadow-sm">
      <div className="text-center mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary mb-3">Countdown</p>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Time Until The Event</h2>
      </div>
      {countdown.isLive ? (
        <p className="text-center text-3xl md:text-4xl font-bold text-primary">Happening now</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Days", value: countdown.days },
            { label: "Hrs", value: countdown.hours },
            { label: "Min", value: countdown.minutes },
            { label: "Sec", value: countdown.seconds },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl bg-gray-50 border border-gray-200 px-4 py-5 text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-gray-900 tabular-nums leading-none">
                {String(item.value).padStart(2, "0")}
              </div>
              <div className="mt-3 text-sm md:text-base font-medium text-gray-600">{item.label}</div>
            </div>
          ))}
        </div>
      )}
      <p className="text-center text-base md:text-lg text-gray-600 mt-8">{formattedDate}</p>
    </div>
  );
}
