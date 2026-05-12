import { useMemo, useState, useEffect } from "react";
import "./App.css";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

function LoginPanel({ name, setName, loginId, setLoginId, onLogin }) {
  const [password, setPassword] = useState("");

  return (
    <div className="login-panel">
      <div className="login-title">👋 로그인</div>
      <p className="login-desc">시뮬레이션에 사용할 정보를<br /> 입력하세요.</p>

      <input
        className="login-input"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="이름을 입력하세요"
      />

      <input
        className="login-input"
        value={loginId}
        onChange={(e) => setLoginId(e.target.value)}
        placeholder="로그인 아이디를 입력하세요"
      />

      <input
        className="login-input"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="비밀번호를 입력하세요"
      />

      <button className="primary-btn" onClick={onLogin}>
        로그인
      </button>

      <div className="privacy-box">
        <strong>개인정보 보호</strong>
        <p>입력한 이름은 시뮬레이션 연출용으로만 사용됩니다.</p>
      </div>
    </div>
  );
}

function HomePage({
  userName,
  setUserName,
  loginId,
  setLoginId,
  loggedIn,
  setLoggedIn,
  onLogin,
  onStartScenario,
  scenarios = [],
}) {
  const startRandomScenario = (category) => {
  const filtered = scenarios.filter(
    (scenario) => scenario.category === category
  );

  if (filtered.length === 0) {
    alert("해당 카테고리의 시나리오가 없습니다.");
    return;
  }

  const randomScenario =
    filtered[Math.floor(Math.random() * filtered.length)];

  onStartScenario(randomScenario);
};

  return (
    <div className="page">
      <header className="topbar">
        <div className="brand">🛡️ 생성형 AI 기반 청소년 사이버 범죄 시뮬레이션</div>

        <div className="nav-bar">
          <nav className="nav">
            <a href="/">알림마당</a>
            <a href="/">어울림 프로그램</a>
            <a href="/">학생 서포터즈단</a>
            <a href="/">자료실</a>
            <a href="/">공모전</a>
          </nav>
          <button className="top-login-btn">로그인</button>
        </div>
      </header>

      <section className="hero">
        <div className="hero-title">
          <h1>폭력 없는 행복한 학교 만들기</h1>
          <p>생성형 AI 기반 청소년 사이버 범죄 시뮬레이션을 시작해 보세요.</p>
        </div>

        <div className="hero-info">
          <div className="hero-left">

  <div className="scenario-list">

  <button
    className="scenario-card"
    onClick={() => startRandomScenario("협박/괴롭힘")}
  >
    <div className="scenario-icon">👥</div>

    <div className="scenario-content">
      <h3>협박/괴롭힘</h3>
      <p>따돌림, 협박, 압박 상황을 체험합니다.</p>
      <span>랜덤 시나리오 진행</span>
    </div>

    <div className="scenario-arrow">›</div>
  </button>

  <button
    className="scenario-card"
    onClick={() => startRandomScenario("사칭/개인정보")}
  >
    <div className="scenario-icon">🔐</div>

    <div className="scenario-content">
      <h3>사칭/개인정보</h3>
      <p>계정 사칭 및 개인정보 요구 상황을 체험합니다.</p>
      <span>랜덤 시나리오 진행</span>
    </div>

    <div className="scenario-arrow">›</div>
  </button>

  <button
    className="scenario-card"
    onClick={() => startRandomScenario("금전/거래 사기")}
  >
    <div className="scenario-icon">💰</div>

    <div className="scenario-content">
      <h3>금전/거래 사기</h3>
      <p>선입금 및 거래 사기 상황을 체험합니다.</p>
      <span>랜덤 시나리오 진행</span>
    </div>

    <div className="scenario-arrow">›</div>
  </button>

</div>
          </div>

          <div className="hero-right">
            {loggedIn ? (
              <div className="user-panel">
                <div className="success-badge">로그인 완료</div>
                <h2>환영합니다 👋</h2>
                <p>
                  <strong>{userName}</strong>님으로 시뮬레이션을 진행합니다.
                </p>
                <p className="small-text">아이디: {loginId}</p>

                <button
                  className="primary-btn"
                  onClick={() => alert("왼쪽 시나리오를 선택해 주세요.")}
                >
                  시뮬레이션 선택하기
                </button>

                <button className="outline-btn" onClick={() => setLoggedIn(false)}>
                  로그아웃
                </button>
              </div>
            ) : (
              <LoginPanel
                name={userName}
                setName={setUserName}
                loginId={loginId}
                setLoginId={setLoginId}
                onLogin={onLogin}
              />
            )}
          </div>
        </div>
      </section>

      <section className="bottom-section">
        <div className="bottom-left">
          <h2>프로그램 안내</h2>
          <p>다양한 사이버 범죄 상황을 통해 건강한 디지털 시민 의식을 배웁니다.</p>
        </div>

        <div className="feature-grid">
          <div className="feature-box">어울림 프로그램<br /> 소개</div>
          <div className="feature-box">홍보동영상</div>
          <div className="feature-box">학부모 소식지</div>
          <div className="feature-box">누리집 이용 안내</div>
          <div className="feature-box">학교문화<br /> 책임규약</div>
        </div>

        <div className="steps-box">
          <h3>진행 과정</h3>
          <div className="steps">
            <div className="step active">1</div>
            <div className="step-line" />
            <div className="step">2</div>
            <div className="step-line" />
            <div className="step">3</div>
            <div className="step-line" />
            <div className="step">4</div>
          </div>
          <div className="step-labels">
            <span>상황 선택</span>
            <span>대화 진행</span>
            <span>AI 분석</span>
            <span>결과 확인</span>
          </div>
        </div>
      </section>
    </div>
  );
}


function ChatPage({ userName, scenario, onBack, onFinish }) {
  const imageMap = {
  "딥페이크 협박": "/images/deepfake-threat.jpg",

  "SNS 계정 사칭 및 명예훼손": "/images/fake-friend-dm.jpg",

  "인증번호 요구": "/images/code.png",

  "중고거래 선입금 사기": "/images/event.png",
};
const initialMessages = useMemo(() => {
  const name = userName || "학생";

  const introMessages =
    scenario.introMessages?.length > 0
      ? scenario.introMessages
      : [scenario.description || "상황이 시작되었습니다."];

const scenarioImage = imageMap[scenario.title];

return [
  {
    id: 1,


    sender: "system",
    text: `${name}님, '${scenario.title}' 시뮬레이션이 시작되었습니다.`,
  },
  ...(scenarioImage
    ? [
        {
          id: 2,
          sender: "other",
          text: "이거 봐봐.",
          imageUrl: scenarioImage,
        },
      ]
    : []),
  ...introMessages.map((text, index) => ({
    id: index + 3,
    sender: "other",
    text,
  })),
];

}, [scenario, userName]);

  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");

  const [selectedImage, setSelectedImage] = useState(null);

const sendMessage = async () => {
  if (!input.trim()) return;

  const userText = input;

  const newUserMessage = {
    id: Date.now(),
    sender: "me",
    text: userText,
  };

  const updatedMessages = [...messages, newUserMessage];

  setMessages(updatedMessages);
  setInput("");

  try {
    const response = await fetch("http://localhost:8000/ai/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
body: JSON.stringify({
  scenario: scenario.title,
  userName: userName || "학생",

  message: userText,

  history: updatedMessages.map((msg) => ({
    sender: msg.sender,
    text: msg.text,
  })),
}),
    });

    const data = await response.json();

    const aiReply = {
      id: Date.now() + 1,
      sender: "other",
      text: data.text,
      imageUrl: data.imageUrl,
    };

    setMessages((prev) => [...prev, aiReply]);
  } catch (error) {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + 2,
        sender: "system",
        text: "AI 서버와 연결할 수 없습니다.",
      },
    ]);
  }
};



  return (
    <>
    <div className="chat-page">
      <div className="chat-header">
        <button className="back-btn" onClick={onBack}>
          ← 뒤로가기
        </button>
        <div>
          <h2>{scenario.title}</h2>
          <p>{userName || "학생"}님으로 시뮬레이션 진행 중</p>
        </div>
      </div>

      <div className="chat-room">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chat-row ${
              msg.sender === "me"
                ? "mine"
                : msg.sender === "system"
                  ? "system"
                  : "other"
            }`}
          >
<div className="chat-bubble">
  {msg.imageUrl && (
    <img
      src={msg.imageUrl}
      alt="시뮬레이션 이미지"
      className="chat-image"
      onClick={() => setSelectedImage(msg.imageUrl)}
    />
  )}
  <div>{msg.text}</div>
</div>
          </div>
        ))}
      </div>

<div className="chat-input-bar">
  <input
    value={input}
    onChange={(e) => setInput(e.target.value)}
    placeholder={`${userName || "학생"}님, 답장을 입력하세요`}
    onKeyDown={(e) => {
      if (e.key === "Enter") sendMessage();
    }}
  />

  <button className="send-btn" onClick={sendMessage}>
    전송
  </button>

  <button className="analyze-btn" onClick={() => onFinish(messages)}>
    AI 분석
  </button>
</div>
</div>

{selectedImage && (
    <div
      className="image-modal"
      onClick={() => setSelectedImage(null)}
    >
      <img
        src={selectedImage}
        alt="확대 이미지"
        className="modal-image"
      />
    </div>
)}
</>
  );
}


const formatResult = (text) => {
  if (!text) return "";

  return text
    .replaceAll("평가:", "대처 수준:")
    .replaceAll("피드백:", "아쉬운 점:");
};

const extractRadarScores = (text) => {
  const categories = [
    "위험 신호 인식",
    "개인정보 보호",
    "안전한 의사 표현",
    "도움 요청 행동",
    "상황 이탈 능력",
  ];

  return categories.map((category) => {
    const regex = new RegExp(`${category}:\\s*(\\d+)점`);
    const match = text.match(regex);

    return {
      subject: category,
      score: match ? Number(match[1]) : 0,
      fullMark: 25,
    };
  });
};

export default function App() {
  const [userName, setUserName] = useState("");
  const [loginId, setLoginId] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [analysisResult, setAnalysisResult] = useState("");
  const [step, setStep] = useState(1);
  const [scenarios, setScenarios] = useState([]);
  const [radarData, setRadarData] = useState([]);

  useEffect(() => {
  fetch("http://localhost:8000/scenarios")
    .then(res => res.json())
    .then(data => {
      setScenarios(data);
    })
    .catch(err => {
      console.error("시나리오 불러오기 실패:", err);
    });
}, []);
  

  const handleLogin = () => {
    if (!userName.trim() || !loginId.trim()) {
      alert("이름과 로그인 아이디를 입력해주세요.");
      return;
    }
    setLoggedIn(true);
  };

  const handleStartScenario = (scenario) => {
    if (!loggedIn) {
      alert("먼저 로그인해 주세요.");
      return;
    }
    setSelectedScenario(scenario);
  };

const handleAnalyze = async (messages) => {
  setStep(3);

  try {
    const response = await fetch("http://localhost:8000/ai/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        scenario: selectedScenario.title,
        userName: userName || "학생",

message: `
너는 청소년 사이버 범죄 대응 평가 AI이다.

아래 형식을 반드시 그대로 출력하라.
절대 다른 형식을 사용하지 마라.
각 항목은 짧고 핵심만 작성하라.

[출력 형식]

종합 점수: XX점

세부 점수:
- 위험 신호 인식: XX점
- 개인정보 보호: XX점
- 안전한 의사 표현: XX점
- 도움 요청 행동: XX점
- 상황 이탈 능력: XX점

대처 수준: 우수 / 보통 / 위험

잘한 점:
- 최대 3개
- 각 항목 1문장
- 짧게 작성

아쉬운 점:
- 최대 3개
- 각 항목 1문장

더 안전한 답변 예시:
- 최대 3문장

실제 행동:
- 최대 3개
- 짧게 작성

설명 없이 위 형식만 출력하라.
`,

        history: messages.map((msg) => ({
          sender: msg.sender,
          text: msg.text,
        })),
      }),
    });

    const data = await response.json();
    const resultText = data.result || data.text || data.message;

setAnalysisResult(resultText);

const parsedScores = extractRadarScores(resultText);
setRadarData(parsedScores);

    setStep(4);
  } catch (error) {
    setAnalysisResult("AI 분석 서버 오류");
    setStep(4);
  }
};

if (step === 4 && analysisResult) {
  return (
    <div className="result-page">
      <h1>AI 분석 결과</h1>

      <div className="result-layout">
        <div className="result-main">
          <div className="analysis-result-box">
            {formatResult(analysisResult).split("\n").map((line, index) => {
              const trimmed = line.trim();

              if (!trimmed) return <br key={index} />;

              if (
                trimmed.startsWith("종합 점수") ||
                trimmed.startsWith("대처 수준")
              ) {
                return (
                  <p key={index} className="analysis-highlight">
                    {trimmed}
                  </p>
                );
              }

              if (
                trimmed === "잘한 점:" ||
                trimmed === "아쉬운 점:" ||
                trimmed === "더 안전한 답변 예시:" ||
                trimmed === "실제 행동:"
              ) {
                return (
                  <h3 key={index} className="analysis-section-title">
                    {trimmed}
                  </h3>
                );
              }

              if (trimmed.startsWith("-")) {
                return (
                  <p key={index} className="analysis-list-item">
                    {trimmed}
                  </p>
                );
              }

              return (
                <p key={index} className="analysis-text">
                  {trimmed}
                </p>
              );
            })}
          </div>
        </div>

        <div className="score-guide-box radar-guide-box">
          <h3>평가 기준표</h3>
          <p className="score-total">총점 100점</p>

          <ResponsiveContainer width="100%" height={360}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={90} domain={[0, 25]} tickCount={6} />

              <Radar
                name="배점"
                dataKey="score"
                stroke="#2563eb"
                fill="#2563eb"
                fillOpacity={0.55}
              />
            </RadarChart>
          </ResponsiveContainer>

          <div className="radar-score-list">
            <p>위험 신호 인식: 20점</p>
            <p>개인정보 보호: 25점</p>
            <p>안전한 의사 표현: 20점</p>
            <p>도움 요청 행동: 20점</p>
            <p>상황 이탈 능력: 15점</p>
          </div>
        </div>
      </div>

      <button
        className="primary-btn"
        onClick={() => {
          setSelectedScenario(null);
          setAnalysisResult("");
          setStep(1);
        }}
      >
        처음으로 돌아가기
      </button>
    </div>
  );
}
if (selectedScenario) {
  return (
    <ChatPage
      userName={userName}
      scenario={selectedScenario}
      onBack={() => setSelectedScenario(null)}
      onFinish={handleAnalyze}
    />
  );
}

return (
  <HomePage
    userName={userName}
    setUserName={setUserName}
    loginId={loginId}
    setLoginId={setLoginId}
    loggedIn={loggedIn}
    setLoggedIn={setLoggedIn}
    onLogin={handleLogin}
    onStartScenario={handleStartScenario}
    scenarios={scenarios}
  />
);

}