import React, { useState, useEffect } from "react";

const initialAuditData = [
  { id: 1, question: "Is food stored at the correct temperature?", status: "", comment: "" },
  { id: 2, question: "Are employees following handwashing protocols?", status: "", comment: "" },
  { id: 3, question: "Is the kitchen clean and sanitized?", status: "", comment: "" },
];

export default function AuditApp() {
  const [auditData, setAuditData] = useState(() => {
    const savedData = localStorage.getItem("auditData");
    return savedData ? JSON.parse(savedData) : initialAuditData;
  });

  useEffect(() => {
    localStorage.setItem("auditData", JSON.stringify(auditData));
  }, [auditData]);

  const handleChange = (id, field, value) => {
    setAuditData((prevData) =>
      prevData.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const exportToCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Question,Status,Comment"].concat(
        auditData.map((row) => `${row.question},${row.status},${row.comment}`)
      ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "audit_results.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Restaurant Audit Form</h1>
      {auditData.map((item) => (
        <div key={item.id} style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px', borderRadius: '5px' }}>
          <p style={{ fontWeight: 'bold' }}>{item.question}</p>
          <select
            value={item.status}
            onChange={(e) => handleChange(item.id, "status", e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
            <option value="N/A">N/A</option>
          </select>
          <textarea
            value={item.comment}
            onChange={(e) => handleChange(item.id, "comment", e.target.value)}
            placeholder="Add comments if necessary..."
            style={{ width: '100%', height: '50px', padding: '8px' }}
          />
        </div>
      ))}
      <button onClick={exportToCSV} style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
        Export Audit
      </button>
    </div>
  );
}

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then((registration) => {
      console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch((error) => {
      console.log('Service Worker registration failed:', error);
    });
}
