"use client";

import { useState } from "react";

export default function Home() {
  const [company, setCompany] = useState("");
  const [startDate, setStartDate] = useState("2026-03-01");
  const [endDate, setEndDate] = useState("2026-03-31");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function handleSearch() {
    if (!company.trim()) {
      alert("Enter company name");
      return;
    }

    if (startDate > endDate) {
      alert("Start date cannot be after end date");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_name: company,
          start_date: startDate,
          end_date: endDate,
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      alert("Backend error. Make sure FastAPI is running on port 8000.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F7F7F7]">
      <div className="bg-[#C00000] px-8 py-8 text-white shadow">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm uppercase tracking-[0.25em] text-white/80">
            CEO Alerts
          </p>
          <h1 className="mt-2 text-4xl font-bold">CEO Change Search</h1>
          <p className="mt-2 max-w-2xl text-white/85">
            Search a company and timeline to detect CEO changes and extract
            transition details.
          </p>
        </div>
      </div>

      <section className="mx-auto max-w-5xl px-6 py-10">
        <div className="rounded-2xl bg-white p-8 shadow-lg border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">
            Search Criteria
          </h2>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700">
              Company Name
            </label>
            <input
              placeholder="e.g., BT Group, Disney, HDFC Bank"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="mt-2 w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-[#C00000] focus:ring-2 focus:ring-[#C00000]/20"
            />
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-[#C00000] focus:ring-2 focus:ring-[#C00000]/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-[#C00000] focus:ring-2 focus:ring-[#C00000]/20"
              />
            </div>
          </div>

          <button
            onClick={handleSearch}
            disabled={loading}
            className="mt-7 w-full rounded-lg bg-[#C00000] px-5 py-3 font-semibold text-white shadow hover:bg-[#A00000] disabled:bg-gray-400"
          >
            {loading ? "Checking CEO change..." : "Check CEO Change"}
          </button>
        </div>

        {result && (
          <div className="mt-8 rounded-2xl bg-white p-8 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between gap-4 border-b pb-4">
              <div>
                <p className="text-sm text-gray-500">Result</p>
                <h2 className="text-2xl font-bold text-gray-900">
                  {company}
                </h2>
              </div>

              <span
                className={
                  result.ceo_change === "YES"
                    ? "rounded-full bg-[#C00000]/10 px-4 py-2 font-bold text-[#C00000]"
                    : "rounded-full bg-gray-100 px-4 py-2 font-bold text-gray-700"
                }
              >
                CEO Change: {result.ceo_change}
              </span>
            </div>

            <div className="mt-5 rounded-xl bg-gray-50 p-4">
              <p className="text-sm font-semibold text-gray-700">
                Screening Notes
              </p>
              <p className="mt-1 text-gray-900">
                {result.screening_notes || "-"}
              </p>

              {result.message && (
                <p className="mt-3 rounded-lg bg-yellow-50 p-3 text-sm text-yellow-800">
                  {result.message}
                </p>
              )}
            </div>

            {result.ceo_change === "YES" && result.details && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  CEO Transition Details
                </h3>

                <div className="mt-4 overflow-hidden rounded-xl border border-gray-200">
                  {Object.entries(result.details).map(([key, value], index) => (
                    <div
                      key={key}
                      className={`grid grid-cols-1 gap-2 px-4 py-3 md:grid-cols-2 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <p className="font-medium capitalize text-gray-700">
                        {key.replaceAll("_", " ")}
                      </p>
                      <p className="text-gray-900">{String(value || "-")}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}