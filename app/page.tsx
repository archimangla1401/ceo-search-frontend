"use client";

import { useState } from "react";

export default function Home() {
  const [companies, setCompanies] = useState("");
  const [startDate, setStartDate] = useState("2026-03-01");
  const [endDate, setEndDate] = useState("2026-03-31");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

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

  return (
    <main className="min-h-screen bg-[#F7F7F7]">
      {/* Header */}
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

      {/* Input Section */}
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
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 focus:border-[#C00000]"
            />

            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 focus:border-[#C00000]"
            />
          </div>

          <button
            onClick={handleSearch}
            disabled={loading}
            className="mt-7 w-full rounded-lg bg-[#C00000] px-5 py-3 font-semibold text-white hover:bg-[#A00000] disabled:bg-gray-400"
          >
            {loading ? "Checking companies..." : "Check CEO Changes"}
          </button>
        </div>

        {/* Results Table */}
        {results.length > 0 && (
          <div className="mt-8 rounded-2xl bg-white p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Results Summary</h2>

            <table className="w-full text-sm border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Company</th>
                  <th className="p-3">CEO Change</th>
                  <th className="p-3 text-left">Notes</th>
                </tr>
              </thead>

              <tbody>
                {results.map((r, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-3">{r.company_name}</td>
                    <td className="p-3 text-center">
                      <span
                        className={
                          r.ceo_change === "YES"
                            ? "text-[#C00000] font-bold"
                            : "text-gray-600"
                        }
                      >
                        {r.ceo_change}
                      </span>
                    </td>
                    <td className="p-3">{r.screening_notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Detailed Results */}
        {results
          .filter((r) => r.ceo_change === "YES")
          .map((r, i) => (
            <div key={i} className="mt-6 bg-white p-6 rounded-xl shadow">
              <h3 className="text-lg font-bold text-[#C00000]">
                {r.company_name}
              </h3>

              {r.message && (
                <p className="text-yellow-700 mt-2">{r.message}</p>
              )}

              {r.details &&
                Object.entries(r.details).map(([k, v]) => (
                  <p key={k}>
                    <b>{k.replaceAll("_", " ")}:</b> {String(v || "-")}
                  </p>
                ))}
            </div>
          ))}
      </section>
    </main>
  );
}