"use client";

import { useState } from "react";

interface ResearchResult {
  topic: string;
  research_plan: string;
  web_research: string;
  wiki_research: string;
  arxiv_research: string;
  analysis: string;
  final_report: string;
}

const TABS = [
  { key: "final_report", label: "Final Report" },
  { key: "research_plan", label: "Research Plan" },
  { key: "web_research", label: "Web Research" },
  { key: "wiki_research", label: "Wikipedia" },
  { key: "arxiv_research", label: "Arxiv" },
  { key: "analysis", label: "Analysis" },
] as const;

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<string>("final_report");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`${API_URL}/research`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topic.trim() }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data: ResearchResult = await res.json();
      setResult(data);
      setActiveTab("final_report");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight">
          Multi-Agent Research
        </h1>
        <p className="mt-2 text-gray-500">
          AI agents gather info from Web, Wikipedia &amp; Arxiv, then produce a
          structured report.
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSubmit} className="flex gap-3 mb-8">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter a research topic..."
          className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !topic.trim()}
          className="rounded-lg bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Researching..." : "Research"}
        </button>
      </form>

      {/* Loading Spinner */}
      {loading && (
        <div className="text-center py-20">
          <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="mt-4 text-gray-500">
            Agents are researching — this may take a minute...
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-700 mb-6">
          {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div>
          {/* Tabs */}
          <div className="flex gap-1 border-b border-gray-200 mb-6 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans">
              {result[activeTab as keyof ResearchResult]}
            </pre>
          </div>
        </div>
      )}
    </main>
  );
}
