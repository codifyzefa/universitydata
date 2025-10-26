import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import StudentTable from "../components/StudentTable";
import "../index.css";

export default function Dashboard() {
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [batch, setBatch] = useState("");
  const [program, setProgram] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 50;

  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn");
    if (!loggedIn) window.location.href = "/";

    fetch("/data.xlsx")
      .then((res) => res.arrayBuffer())
      .then((ab) => {
        const wb = XLSX.read(ab, { type: "array" });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet);
        setStudents(data);
        setFiltered(data);
      });
  }, []);

  const extractBatch = (b) => (b ? b.split("-")[0].trim() : "");

  useEffect(() => {
    let result = students.filter((s) => {
      const matchBatch = batch ? extractBatch(s.Batch) === batch : true;
      const matchProg = program ? s.Program === program : true;
      const matchSearch =
        s.Name?.toLowerCase().includes(search.toLowerCase()) ||
        s.Student_ID?.toLowerCase().includes(search.toLowerCase()) ||
        s.Father_Name?.toLowerCase().includes(search.toLowerCase());
      return matchBatch && matchProg && matchSearch;
    });
    setFiltered(result);
    setCurrentPage(1); // Reset pagination on new search/filter
  }, [batch, program, search, students]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = filtered.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="header">
        <div className="header-left">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135755.png"
            width="28"
            alt="icon"
          />
          <h2>CUI-ATD Students Information</h2>
        </div>
        <button
          className="logout-btn"
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
        >
          Logout
        </button>
      </div>

      {/* Filters */}
      <div className="filters">
        <select value={batch} onChange={(e) => setBatch(e.target.value)}>
          <option value="">Batch</option>
          {[...new Set(students.map((s) => extractBatch(s.Batch)))].map(
            (b, i) => (
              <option key={i}>{b}</option>
            )
          )}
        </select>

        <select value={program} onChange={(e) => setProgram(e.target.value)}>
          <option value="">Program</option>
          {[...new Set(students.map((s) => s.Program))].map((p, i) => (
            <option key={i}>{p}</option>
          ))}
        </select>

        <input
          placeholder="Search by name, ID, or father name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="table-container">
        <StudentTable students={currentData} />
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button
          className="page-btn"
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          ◀ Prev
        </button>

        <span className="page-info">
          Page {currentPage} of {totalPages}
        </span>

        <button
          className="page-btn"
          onClick={() =>
            setCurrentPage((p) => (p < totalPages ? p + 1 : p))
          }
          disabled={currentPage === totalPages}
        >
          Next ▶
        </button>
      </div>
    </div>
  );
}
