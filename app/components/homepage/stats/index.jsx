"use client";

import { useEffect, useRef, useState } from "react";
import { personalData } from "@/utils/data/personal-data";

function useCountUp(targetNumber, isActive, durationMs = 1500) {
  const [value, setValue] = useState(0);
  const startTimeRef = useRef(null);

  useEffect(() => {
    if (!isActive) return;
    let rafId;
    const frame = (time) => {
      if (startTimeRef.current === null) startTimeRef.current = time;
      const progress = Math.min((time - startTimeRef.current) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * targetNumber));
      if (progress < 1) rafId = requestAnimationFrame(frame);
    };
    rafId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafId);
  }, [targetNumber, isActive, durationMs]);

  return value;
}

const StatCard = ({ label, value, suffix = "+" }) => {
  return (
    <div className="from-[#0d1224] border-[#1b2c68a0] relative rounded-lg border bg-gradient-to-r to-[#0a0d37] w-full">
      <div className="flex flex-row">
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-pink-500 to-violet-600"></div>
        <div className="h-[1px] w-full bg-gradient-to-r from-violet-600 to-transparent"></div>
      </div>
      <div className="overflow-hidden border-t-[2px] border-indigo-900 px-6 py-8 flex flex-col items-center justify-center gap-2">
        <span className="text-4xl md:text-5xl font-extrabold text-[#16f2b3]">{value}{suffix}</span>
        <span className="text-sm md:text-base text-gray-300">{label}</span>
      </div>
    </div>
  );
};

function Stats() {
  const containerRef = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(true);
        });
      },
      { root: null, threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const completed = useCountUp(personalData?.stats?.completedProjects ?? 0, active);
  const years = useCountUp(personalData?.stats?.yearsOfExperience ?? 0, active);
  const clients = useCountUp(personalData?.stats?.satisfiedClients ?? 0, active);

  return (
    <section ref={containerRef} className="relative z-50 border-t my-12 lg:my-24 border-[#25213b]">
      <div className="flex justify-center my-5 lg:py-8">
        <div className="flex items-center">
          <span className="w-24 h-[2px] bg-[#1a1443]"></span>
          <span className="bg-[#1a1443] w-fit text-white p-2 px-5 text-xl rounded-md">
            Stats
          </span>
          <span className="w-24 h-[2px] bg-[#1a1443]"></span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Completed Projects" value={completed} />
        <StatCard label="Years of Experience" value={years} suffix={"+"} />
        <StatCard label="Happy Clients" value={clients} />
      </div>
    </section>
  );
}

export default Stats;


