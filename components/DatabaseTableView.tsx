"use client";

import React, { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import {
  Database,
  Building2,
  Calendar,
  Microscope,
  Pill,
  Search,
  ChevronLeft,
  ChevronRight,
  Download,
  RefreshCw,
  ArrowLeft,
  Lock,
  FileCode,
  CheckCircle2,
  Table as TableIcon,
} from "lucide-react";

type TableName = "workers" | "facilities" | "visits" | "screenings" | "treatments";

export function DatabaseTableView() {
  const [activeTable, setActiveTable] = useState<TableName>("workers");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState<{
    meta: {
      table: string;
      page: number;
      limit: number;
      totalCount: number;
      totalPages: number;
      columns: string[];
    };
    data: any[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchTableData = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        table: activeTable,
        page: String(page),
        limit: String(limit),
        search: search.trim(),
      });

      const res = await fetch(`/api/admin/database?${params.toString()}`);
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to fetch database table.");
      }

      setTableData(json);
    } catch (err: any) {
      setError(err.message || "Failed to load table records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTableData();
  }, [activeTable, page, limit]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchTableData();
  };

  const handleTableChange = (newTable: TableName) => {
    setActiveTable(newTable);
    setPage(1);
    setSearch("");
  };

  const handleExportJson = () => {
    if (!tableData?.data) return;
    const blob = new Blob([JSON.stringify(tableData.data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeTable}_export_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabs: { id: TableName; label: string; icon: any }[] = [
    { id: "workers", label: "Workers (Prisma.Worker)", icon: Database },
    { id: "facilities", label: "Facilities (Prisma.Facility)", icon: Building2 },
    { id: "visits", label: "Visits (Prisma.Visit)", icon: Calendar },
    { id: "screenings", label: "Screenings (Prisma.Screening)", icon: Microscope },
    { id: "treatments", label: "Treatments (Prisma.Treatment)", icon: Pill },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-mono text-slate-100">
      {/* Top Breadcrumb & Technical Inspector Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1.5 text-xs font-sans font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Surveillance</span>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h1 className="text-sm font-bold text-slate-100 tracking-wider uppercase">
                Database Schema &amp; Table Inspector
              </h1>
            </div>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
              SQLite Database: <code className="text-emerald-400">dev.db</code> • Model Engine: Prisma v6.19.3 • Role: ADMIN
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-950/80 border border-amber-600/50 text-[10px] font-bold text-amber-300">
            <Lock className="w-3 h-3 text-amber-400" />
            <span>Admin-Only Read-Only View</span>
          </span>
          <button
            type="button"
            onClick={fetchTableData}
            title="Refresh Table"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Table Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-800">
        {tabs.map((tab) => {
          const isSelected = activeTable === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTableChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors border ${
                isSelected
                  ? "bg-emerald-950 border-emerald-500 text-emerald-300 shadow-sm"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search & Actions Utility Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl">
        {/* Search Query Form */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Filter ${activeTable}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-hidden focus:border-emerald-500"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition"
          >
            Filter
          </button>
        </form>

        {/* Limit Selector & Export */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400">
            <span>Rows:</span>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(parseInt(e.target.value, 10));
                setPage(1);
              }}
              className="bg-slate-950 border border-slate-800 text-slate-200 px-2 py-1 rounded text-xs focus:outline-hidden"
            >
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleExportJson}
            disabled={!tableData?.data || tableData.data.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 bg-red-950/80 border border-red-800 text-red-200 rounded-xl text-xs flex items-center gap-2">
          <span>Error loading database table: {error}</span>
        </div>
      )}

      {/* Main Table Viewer */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto max-h-[600px] scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-slate-950">
          <table className="w-full text-left text-[11px] border-collapse">
            {/* Table Header */}
            <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 sticky top-0 z-10 select-none">
              <tr>
                <th className="p-3 font-mono font-bold text-slate-500 w-10 text-center border-r border-slate-800">#</th>
                {tableData?.meta.columns.map((col) => (
                  <th key={col} className="p-3 font-mono font-bold border-r border-slate-800 last:border-0 whitespace-nowrap text-slate-300">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-900/80 font-mono">
              {loading ? (
                <tr>
                  <td
                    colSpan={(tableData?.meta.columns.length || 5) + 1}
                    className="p-12 text-center text-slate-500 text-xs"
                  >
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-500" />
                    <span>Executing SQL query...</span>
                  </td>
                </tr>
              ) : tableData?.data.length === 0 ? (
                <tr>
                  <td
                    colSpan={(tableData?.meta.columns.length || 5) + 1}
                    className="p-12 text-center text-slate-500 text-xs"
                  >
                    No rows found matching current filter query.
                  </td>
                </tr>
              ) : (
                tableData?.data.map((row: any, idx: number) => {
                  const rowNumber = (page - 1) * limit + idx + 1;
                  return (
                    <tr
                      key={row.id || idx}
                      className="hover:bg-slate-900/90 transition-colors group"
                    >
                      <td className="p-3 text-center text-slate-600 border-r border-slate-900 select-none">
                        {rowNumber}
                      </td>
                      {tableData.meta.columns.map((col) => {
                        const val = row[col];
                        let renderedVal: React.ReactNode = String(val ?? "");

                        if (val === null || val === undefined) {
                          renderedVal = <span className="text-slate-600 italic">null</span>;
                        } else if (typeof val === "boolean") {
                          renderedVal = (
                            <span className={val ? "text-emerald-400" : "text-red-400"}>
                              {val ? "true" : "false"}
                            </span>
                          );
                        } else if (col === "riskStatus") {
                          const s = String(val).toUpperCase();
                          const color =
                            s === "RED"
                              ? "bg-red-950 text-red-300 border-red-700"
                              : s === "YELLOW"
                              ? "bg-amber-950 text-amber-300 border-amber-700"
                              : "bg-emerald-950 text-emerald-300 border-emerald-700";
                          renderedVal = (
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${color}`}>
                              {s}
                            </span>
                          );
                        } else if (col === "portableHealthId") {
                          renderedVal = (
                            <span className="font-extrabold text-emerald-300 tracking-wider">
                              {String(val)}
                            </span>
                          );
                        } else if (col.includes("date") || col.includes("At") || col === "dob") {
                          const dateObj = new Date(val);
                          renderedVal = !isNaN(dateObj.getTime()) ? (
                            <span className="text-slate-400">
                              {dateObj.toISOString().replace("T", " ").replace("Z", "")}
                            </span>
                          ) : (
                            String(val)
                          );
                        } else if (typeof val === "string" && val.length > 50) {
                          renderedVal = (
                            <span title={val} className="truncate max-w-xs block cursor-help">
                              {val}
                            </span>
                          );
                        }

                        return (
                          <td
                            key={col}
                            className="p-3 border-r border-slate-900 last:border-0 whitespace-nowrap text-slate-300"
                          >
                            {renderedVal}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {tableData?.meta && (
          <div className="p-3 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <div>
              <span>
                Showing <strong className="text-slate-200">{(page - 1) * limit + (tableData.data.length > 0 ? 1 : 0)}</strong> to{" "}
                <strong className="text-slate-200">{Math.min(page * limit, tableData.meta.totalCount)}</strong> of{" "}
                <strong className="text-emerald-400">{tableData.meta.totalCount}</strong> rows in <code className="text-slate-300">Prisma.{activeTable}</code>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page <= 1 || loading}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-200 font-bold transition flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>

              <span className="px-2 font-mono text-slate-300">
                Page {page} of {tableData.meta.totalPages || 1}
              </span>

              <button
                type="button"
                onClick={() => setPage((p) => Math.min(p + 1, tableData.meta.totalPages))}
                disabled={page >= tableData.meta.totalPages || loading}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-200 font-bold transition flex items-center gap-1"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
