import React, { useState, useEffect } from "react";
import "./style.css";

const categories = ["Total", "Exterior", "Dining Room", "Service Line", "Kitchen", "Back of House", "Walk-In Cooler", "Administrative"];

const initialAuditData = [
  { id: 1, category: "Exterior", question: "Parking lot is clean and free of debris", points: 2, status: "", comment: "" },
  { id: 2, category: "Exterior", question: "Building exterior is in good repair", points: 2, status: "", comment: "" },
  { id: 3, category: "Exterior", question: "Dumpster area is clean and organized", points: 2, status: "", comment: "" },
  { id: 4, category: "Dining Room", question: "Tables and chairs are clean and in good condition", points: 3, status: "", comment: "" },
];

export default function AuditApp() {
  const [page, setPage] = useState("home");
  const [restaurantNumber, setRestaurantNumber] = useState("");
  const [auditHistory, setAuditHistory] = useState([]);
  const [currentAudit, setCurrentAudit] = useState(null);

  useEffect(() => {
    localStorage.setItem("auditHistory", JSON.stringify(auditHistory));
  }, [auditHistory]);

  const handleStartAudit = () => {
    const newAudit = {
      id: Date.now(),
      restaurant: restaurantNumber,
      date: new Date().toLocaleDateString(),
      data: JSON.parse(JSON.stringify(initialAuditData)),
    };
    setAuditHistory([...auditHistory, newAudit]);
    setCurrentAudit(newAudit);
    setPage("audit");
  };

  const handleEditAudit = (audit) => {
    setCurrentAudit(audit);
    setPage("audit");
  };

  const handleDeleteAudit = (auditId) => {
    if (window.confirm("Are you sure you want to delete this audit?")) {
      setAuditHistory(auditHistory.filter(audit => audit.id !== auditId));
    }
  };

  const handleStatusChange = (id, value) => {
    setCurrentAudit((prevAudit) => {
      const updatedData = prevAudit.data.map((item) =>
        item.id === id ? { ...item, status: value } : item
      );
      const updatedAudit = { ...prevAudit, data: updatedData };
      setAuditHistory((prevHistory) =>
        prevHistory.map((audit) => (audit.id === updatedAudit.id ? updatedAudit : audit))
      );
      return updatedAudit;
    });
  };

  const calculateScore = () => {
    const totalPoints = currentAudit?.data.reduce((sum, item) => sum + (item.status === "Yes" ? item.points : 0), 0) || 0;
    const possiblePoints = currentAudit?.data.reduce((sum, item) => sum + (item.status !== "N/A" ? item.points : 0), 0) || 0;
    return possiblePoints ? ((totalPoints / possiblePoints) * 100).toFixed(1) : "N/A";
  };

  const calculateCompleted = () => {
    const answered = currentAudit?.data.filter(item => item.status).length || 0;
    return `${answered}/${currentAudit?.data.length || 0}`;
  };

  if (page === "home") {
    return (
      <div className="home-container">
        <h1>Welcome to Bolay's Quality of Operations Audit</h1>
        <button className="primary-button" onClick={() => setPage("restaurantSelect")}>Enter</button>
      </div>
    );
  }

  if (page === "audit") {
    return (
      <div className="audit-container">
        <div className="audit-header">
          <p><strong>Restaurant:</strong> {currentAudit?.restaurant}</p>
          <p><strong>Date:</strong> {currentAudit?.date}</p>
          <p><strong>Score:</strong> {calculateScore()}%</p>
          <p><strong>Completed:</strong> {calculateCompleted()}</p>
        </div>
        {currentAudit?.data.map((item) => (
          <div key={item.id} className="audit-item">
            <p><strong>{item.category}</strong></p>
            <p>{item.question} ({item.points} pts)</p>
            <div>
              {["Yes", "No", "N/A"].map((option) => (
                <button
                  key={option}
                  className={`option-button ${item.status === option ? "selected-button" : ""}`}
                  onClick={() => handleStatusChange(item.id, option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}
        <button className="secondary-button" onClick={() => setPage("restaurantSelect")}>Back</button>
      </div>
    );
  }

  return (
    <div className="restaurant-select-container">
      <h1>Select Restaurant</h1>
      <select value={restaurantNumber} onChange={(e) => setRestaurantNumber(e.target.value)}>
        <option value="">-- Select --</option>
        {[...Array(10)].map((_, i) => (
          <option key={i + 201} value={i + 201}>{i + 201}</option>
        ))}
      </select>
      <button className="secondary-button" onClick={() => setPage("home")}>Back</button>
      {restaurantNumber && (
        <table className="audit-table">
          <thead>
            <tr>
              <th>Edit</th>
              <th>Rest. #</th>
              <th>Date</th>
              <th>Score</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {auditHistory.filter(a => a.restaurant === restaurantNumber).map((audit) => (
              <tr key={audit.id}>
                <td><button className="edit-button" onClick={() => handleEditAudit(audit)}>Edit</button></td>
                <td>{audit.restaurant}</td>
                <td>{audit.date}</td>
                <td>{calculateScore()}%</td>
                <td><button className="delete-button" onClick={() => handleDeleteAudit(audit.id)}>Delete</button></td>
              </tr>
            ))}
            <tr>
              <td><button className="new-button" onClick={handleStartAudit}>New</button></td>
              <td colSpan={4}></td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}
