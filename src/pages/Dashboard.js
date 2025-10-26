import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import StudentTable from "../components/StudentTable";

export default function Dashboard() {
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [batch, setBatch] = useState("");
  const [program, setProgram] = useState("");
  const [search, setSearch] = useState("");

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
  }, [batch, program, search, students]);

  return (
    <div>
      <div className="header">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135755.png"
            width="28"
            alt="icon"
          />
          <h2>CUI-ATD Students Information</h2>
        </div>
        <div>
          <button
            style={{ background: "red" }}
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="container">
        <select onChange={(e) => setBatch(e.target.value)}>
          <option value="">Batch</option>
          {[...new Set(students.map((s) => extractBatch(s.Batch)))].map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>

        <select onChange={(e) => setProgram(e.target.value)}>
          <option value="">Program</option>
          {[...new Set(students.map((s) => s.Program))].map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>

        <input
          placeholder="Search by name, ID, or father name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <StudentTable students={filtered} />
      </div>

      <footer>© All Rights Reserved | Contact: artbyzefa@.today</footer>
    </div>
  );
}
