import React from "react";

export default function StudentTable({ students }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Batch</th>
          <th>Student ID</th>
          <th>Name</th>
          <th>Father Name</th>
          <th>Program</th>
          <th>Department</th>
        </tr>
      </thead>
      <tbody>
        {students.map((s, i) => (
          <tr key={i}>
            <td>{s.Batch}</td>
            <td>{s.Student_ID}</td>
            <td>{s.Name}</td>
            <td>{s.Father_Name}</td>
            <td>{s.Program}</td>
            <td>{s.Dept_Name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
