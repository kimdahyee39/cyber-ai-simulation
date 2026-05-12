import { useEffect, useState } from "react";

function ScenarioListPage({ onSelect }) {
  const [scenarios, setScenarios] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/scenarios")
      .then((res) => res.json())
      .then((data) => setScenarios(data));
  }, []);

  return (
    <div style={{ padding: "30px" }}>
      <h1 style={{ textAlign: "center" }}>사이버 시뮬레이션</h1>

      {scenarios.map((s) => (
        <div
          key={s.id}
          onClick={() => onSelect(s.id)}
          style={{
            border: "1px solid #ccc",
            margin: "10px 0",
            padding: "20px",
            cursor: "pointer",
            borderRadius: "12px",
            backgroundColor: "#fff"
          }}
        >
          <h2 style={{ textAlign: "center" }}>{s.title}</h2>
          <p style={{ textAlign: "center" }}>{s.description}</p>
          <p style={{ textAlign: "center" }}>상황: {s.level}</p>
        </div>
      ))}
    </div>
  );
}

export default ScenarioListPage;