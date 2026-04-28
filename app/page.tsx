"use client";

import { useState } from "react";

export default function Home() {
  const [company, setCompany] = useState("");
  const [startDate, setStartDate] = useState("2026-03-01");
  const [endDate, setEndDate] = useState("2026-03-15");
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

    // MOCK RESPONSE (we will replace with backend later)
    setTimeout(() => {
      const hasChange = true;

      if (hasChange) {
        setResult({
          company_name: company,
          ceo_change: "YES",
          screening_notes: "Sample CEO change detected in selected timeline.",
          details: {
            departing_ceo_name: "John Doe",
            incoming_ceo_name: "Jane Smith",
            announcement_date: startDate,
            reason: "Retirement",
          },
        });
      } else {
        setResult({
          company_name: company,
          ceo_change: "NO",
          screening_notes: "No CEO change found.",
          details: null,
        });
      }

      setLoading(false);
    }, 1000);
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-6">
          CEO Change Search
        </h1>

        <input
          placeholder="Enter Company Name"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="w-full p-3 border rounded mb-4"
        />

        <div className="flex gap-4 mb-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-1/2 p-3 border rounded"
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-1/2 p-3 border rounded"
          />
        </div>

        <button
          onClick={handleSearch}
          className="w-full bg-black text-white p-3 rounded"
        >
          {loading ? "Checking..." : "Check CEO Change"}
        </button>

        {result && (
          <div className="mt-6 p-4 border rounded">
            <p><b>Company:</b> {result.company_name}</p>

            <p>
              <b>CEO Change:</b>{" "}
              <span className={result.ceo_change === "YES" ? "text-green-600" : "text-red-600"}>
                {result.ceo_change}
              </span>
            </p>

            <p><b>Notes:</b> {result.screening_notes}</p>

            {result.ceo_change === "YES" && result.details && (
              <div className="mt-4">
                <p><b>Departing CEO:</b> {result.details.departing_ceo_name}</p>
                <p><b>Incoming CEO:</b> {result.details.incoming_ceo_name}</p>
                <p><b>Date:</b> {result.details.announcement_date}</p>
                <p><b>Reason:</b> {result.details.reason}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}