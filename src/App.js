import React, { useState, useEffect } from "react";

const initialAuditData = [
  { id: 1, category: "Exterior", question: "Parking lot is clean and free of debris", points: 2, status: "", comment: "" },
  { id: 2, category: "Exterior", question: "Building exterior is in good repair", points: 2, status: "", comment: "" },
  { id: 3, category: "Exterior", question: "Dumpster area is clean and organized", points: 2, status: "", comment: "" },
  { id: 4, category: "Dining Room", question: "Tables and chairs are clean and in good condition", points: 3, status: "", comment: "" },
  { id: 5, category: "Dining Room", question: "Floor is clean and free of spills", points: 3, status: "", comment: "" },
  { id: 6, category: "Dining Room", question: "Restrooms are stocked and clean", points: 4, status: "", comment: "" },
  { id: 7, category: "Kitchen", question: "Food is stored at the correct temperature", points: 5, status: "", comment: "" },
  { id: 8, category: "Kitchen", question: "Employees are wearing proper protective gear", points: 4, status: "", comment: "" },
  { id: 9, category: "Kitchen", question: "Work surfaces are properly sanitized", points: 3, status: "", comment: "" },
];

export default function AuditApp() {
  const [auditData, setAuditData] = useState(() => {
    const savedData = localStorage.getItem("auditData");
    return savedData ? JSON.parse(savedData) : initialAuditData;
  });

  useEffect(() => {
    localStorage.setItem("auditData", JSON.stringify(auditData));
  }, [auditData]);

  const handleStatusChange = (id, value) => {
    setAuditData((prevData) =>
      prevData.map((item) => (item.id === id ? { ...item, status: value } : item))
    );
  };

  const handleCommentChange = (id, value) => {
    setAuditData((prevData) =>
      prevData.map((item) => (item.id === id ? { ...item, comment: value } : item))
    );
  };

  const exportToCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Category,Question,Points,Status,Comment"].concat(
        auditData.map((row) => `${row.category},${row.question},${row.points},${row.status},${row.comment}`)
      ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "audit_results.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ fontSize: '26px', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px', color: '#333' }}>Restaurant Audit Form</h1>
      {auditData.map((item) => (
        <div key={item.id} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '12px', borderRadius: '8px', backgroundColor: '#f9f9f9', display: 'flex', alignItems: 'center' }}>
          <div style={{ flex: 2 }}>
            <p style={{ fontWeight: 'bold', color: '#333', marginBottom: '5px' }}>{item.category}</p>
            <p style={{ fontSize: '16px', color: '#555' }}>{item.question} ({item.points} pts)</p>
          </div>
          <div style={{ flex: 1, display: 'flex', gap: '5px', justifyContent: 'center' }}>
            {["Yes", "No", "N/A"].map((option) => (
              <button
                key={option}
                onClick={() => handleStatusChange(item.id, option)}
                style={{
                  padding: '10px',
                  borderRadius: '5px',
                  border: item.status === option ? '2px solid #007bff' : '1px solid #ccc',
                  backgroundColor: item.status === option ? '#007bff' : '#f8f8f8',
                  color: item.status === option ? 'white' : 'black',
                  cursor: 'pointer',
                  minWidth: '50px',
                }}
              >
                {option}
              </button>
            ))}
          </div>
          <div style={{ flex: 2 }}>
            <textarea
              value={item.comment}
              onChange={(e) => handleCommentChange(item.id, e.target.value)}
              placeholder="Add comments if necessary..."
              style={{ width: '100%', height: '40px', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
          </div>
        </div>
      ))}
      <button onClick={exportToCSV} style={{ width: '100%', padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}>
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
