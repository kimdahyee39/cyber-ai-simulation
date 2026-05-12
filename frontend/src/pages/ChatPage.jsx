import { chatData } from "../data/chatData";

function ChatPage({ userName, scenarioId, onBack, onFinish }) {
  const scenario = chatData[scenarioId];

  if (!scenario) {
    return <div>시나리오를 찾을 수 없습니다.</div>;
  }

  return (
    <div style={{ background: "#b2c7da", minHeight: "100vh", padding: "20px" }}>
      <button
        onClick={onBack}
        style={{
          marginBottom: "20px",
          padding: "10px 16px",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer"
        }}
      >
        ← 뒤로가기
      </button>

      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>{scenario.title}</h2>

      <div style={{ maxWidth: "420px", margin: "0 auto" }}>
        {scenario.messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: "flex",
              justifyContent: msg.sender === "me" ? "flex-end" : "flex-start",
              marginBottom: "12px"
            }}
          >
            <div
              style={{
                backgroundColor: msg.sender === "me" ? "#ffeb3b" : "#ffffff",
                padding: "12px 16px",
                borderRadius: "16px",
                maxWidth: "70%",
                boxShadow: "0 1px 4px rgba(0,0,0,0.15)"
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatPage;