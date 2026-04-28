"use client";

import { useState } from "react";

export default function Home() {
  const [companies, setCompanies] = useState("");
  const [startDate, setStartDate] = useState("2026-03-01");
  const [endDate, setEndDate] = useState("2026-03-31");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  async function handleSearch() {
    const companyList = companies
      .split("\n")
      .map((c) => c.trim())
      .filter(Boolean);

    if (companyList.length === 0) {
      alert("Enter at least one company name");
      return;
    }

    if (companyList.length > 20) {
      alert("Maximum 20 companies allowed per search.");
      return;
    }

    if (startDate > endDate) {
      alert("Start date cannot be after end date");
      return;
    }

    setLoading(true);
    setResults([]);
    setActiveIndex(0);

    try {
      const allResults: any[] = [];

      for (let i = 0; i < companyList.length; i++) {
        const company = companyList[i];

        const response = await fetch("http://127.0.0.1:8000/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            company_name: company,
            start_date: startDate,
            end_date: endDate,
          }),
        });

        const data = await response.json();

        allResults.push({
          company_name: company,
          ...data,
        });

        setResults([...allResults]);
      }
    } catch (error) {
      alert("Backend error. Make sure FastAPI is running.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const yesResults = results.filter((r) => r.ceo_change === "YES");
  const activeResult = yesResults[activeIndex] || yesResults[0];

  return (
    <main className="min-h-screen bg-[#F7F7F7]">
      <div className="bg-[#C00000] px-8 py-8 text-white shadow">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm uppercase tracking-[0.25em] text-white/80">
            CEO Alerts
          </p>
          <h1 className="mt-2 text-4xl font-bold">CEO Change Search</h1>
          <p className="mt-2 max-w-2xl text-white/85">
            Search multiple companies over a selected timeline to detect CEO
            changes and extract transition details.
          </p>
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900">
            Search Criteria
          </h2>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700">
              Company Names
            </label>
            <textarea
              placeholder={`Enter one company per line\nBT Group\nDisney\nHDFC Bank`}
              value={companies}
              onChange={(e) => setCompanies(e.target.value)}
              rows={6}
              className="mt-2 w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-[#C00000] focus:ring-2 focus:ring-[#C00000]/20"
            />
            <p className="mt-2 text-sm text-gray-500">
              Enter one company per line. Maximum 20 companies.
            </p>
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
            {loading ? "Checking companies..." : "Check CEO Changes"}
          </button>
        </div>

        {results.length > 0 && (
          <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900">
              Results Summary
            </h2>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm text-gray-500">Companies searched</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {results.length}
                </p>
              </div>

              <div className="rounded-xl bg-[#C00000]/10 p-4">
                <p className="text-sm text-gray-500">CEO changes found</p>
                <p className="mt-1 text-2xl font-bold text-[#C00000]">
                  {yesResults.length}
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm text-gray-500">No change found</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {results.filter((r) => r.ceo_change !== "YES").length}
                </p>
              </div>
            </div>

            <div className="mt-5 overflow-hidden rounded-xl border border-gray-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3">Company</th>
                    <th className="px-4 py-3">CEO Change</th>
                    <th className="px-4 py-3">Notes</th>
                  </tr>
                </thead>

                <tbody>
                  {results.map((result, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {result.company_name}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={
                            result.ceo_change === "YES"
                              ? "rounded-full bg-[#C00000]/10 px-3 py-1 font-bold text-[#C00000]"
                              : "rounded-full bg-gray-100 px-3 py-1 font-bold text-gray-700"
                          }
                        >
                          {result.ceo_change}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-gray-700">
                        {result.screening_notes || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {yesResults.length > 0 && activeResult && (
          <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">
            <div className="flex items-center justify-between gap-4 border-b pb-4">
              <div>
                <p className="text-sm text-gray-500">
                  CEO Transition Details
                </p>
                <h2 className="text-2xl font-bold text-[#C00000]">
                  {activeResult.company_name}
                </h2>
              </div>

              <span className="rounded-full bg-[#C00000]/10 px-4 py-2 font-bold text-[#C00000]">
                {activeIndex + 1} of {yesResults.length}
              </span>
            </div>

            {activeResult.message && (
              <p className="mt-4 rounded-lg bg-yellow-50 p-3 text-sm text-yellow-800">
                {activeResult.message}
              </p>
            )}

            <div className="mt-5 rounded-xl bg-gray-50 p-4">
              <p className="text-sm font-semibold text-gray-700">
                Screening Notes
              </p>
              <p className="mt-1 text-gray-900">
                {activeResult.screening_notes || "-"}
              </p>
            </div>

            {activeResult.details ? (
              <div className="mt-6 overflow-hidden rounded-xl border border-gray-200">
                {Object.entries(activeResult.details).map(
                  ([key, value], rowIndex) => (
                    <div
                      key={key}
                      className={`grid grid-cols-1 gap-2 px-4 py-3 md:grid-cols-2 ${
                        rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <p className="font-medium capitalize text-gray-700">
                        {key.replaceAll("_", " ")}
                      </p>
                      <p className="text-gray-900">
                        {String(value || "-")}
                      </p>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="mt-6 rounded-xl bg-gray-50 p-5 text-gray-700">
                Detailed CEO transition fields are unavailable for this company.
              </div>
            )}

            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={() =>
                  setActiveIndex((prev) =>
                    prev === 0 ? yesResults.length - 1 : prev - 1
                  )
                }
                className="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-100"
              >
                ← Previous
              </button>

              <div className="flex gap-2">
                {yesResults.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={
                      index === activeIndex
                        ? "h-3 w-3 rounded-full bg-[#C00000]"
                        : "h-3 w-3 rounded-full bg-gray-300"
                    }
                    aria-label={`Go to company ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={() =>
                  setActiveIndex((prev) =>
                    prev === yesResults.length - 1 ? 0 : prev + 1
                  )
                }
                className="rounded-lg bg-[#C00000] px-4 py-2 font-medium text-white hover:bg-[#A00000]"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}