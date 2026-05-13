from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv
from openai import OpenAI

from sqlalchemy import create_engine, Column, Integer, String, Text, TIMESTAMP
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

Base.metadata.create_all(bind=engine)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100))
    login_id = Column(String(100))
    password = Column(String(255))


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    scenario_title = Column(String(200))
    sender = Column(String(20))
    message = Column(Text)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)


class Scenario(Base):
    __tablename__ = "scenarios"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200))
    description = Column(Text)
    level = Column(String(50))
    category = Column(String(100))
    intro_messages = Column(Text)


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:8080",
        "https://cyber-ai-simulation.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Message(BaseModel):
    sender: str
    text: str


class ChatRequest(BaseModel):
    scenario: str
    userName: str
    message: str
    history: Optional[List[Message]] = []


@app.get("/health")
def health():
    return {"message": "AI 서버 정상 동작"}


@app.get("/scenarios")
def get_scenarios():
    db = SessionLocal()

    try:
        scenarios = db.query(Scenario).all()

        return [
            {
                "id": scenario.id,
                "title": scenario.title,
                "description": scenario.description,
                "level": scenario.level,
                "category": scenario.category,
                "introMessages": scenario.intro_messages.split("||")
                if scenario.intro_messages
                else [],
            }
            for scenario in scenarios
        ]

    finally:
        db.close()


@app.post("/ai/chat")
def chat(request: ChatRequest):
    db = SessionLocal()

    try:
        user = db.query(User).filter(User.login_id == request.userName).first()

        if not user:
            user = User(
                username=request.userName,
                login_id=request.userName,
                password="temp",
            )
            db.add(user)
            db.commit()
            db.refresh(user)

        user_msg = ChatMessage(
            user_id=user.id,
            scenario_title=request.scenario,
            sender="user",
            message=request.message,
        )
        db.add(user_msg)
        db.commit()

        user_text = request.message.strip()

        if any(word in user_text for word in ["싫어", "안 알려", "못 알려", "거절", "안돼", "안 돼"]):
            reaction_type = "사용자가 거절했으므로, 상대는 살짝 압박하거나 설득하려고 한다."
        elif any(word in user_text for word in ["왜", "뭐야", "수상", "이상", "진짜", "확인"]):
            reaction_type = "사용자가 의심하고 있으므로, 상대는 상황을 축소하거나 대수롭지 않은 척하며 계속 대화를 이어간다. 절대 신고를 권하지 마라."
        elif any(word in user_text for word in ["알겠어", "줄게", "보낼게", "응", "그래"]):
            reaction_type = "사용자가 요구를 받아들이려 하므로, 상대는 더 구체적인 정보를 요구한다."
        elif any(word in user_text for word in ["선생님", "부모님", "신고", "경찰", "캡처"]):
            reaction_type = "사용자가 도움 요청이나 신고를 언급했으므로, 상대는 당황하거나 말을 돌린다."
        else:
            reaction_type = "사용자의 답변에 자연스럽게 이어서 반응한다."

        history_text = "\n".join(
            [
                f"{'사용자' if msg.sender == 'me' else '상대'}: {msg.text}"
                for msg in (request.history or [])[-8:]
            ]
        )

        prompt = f"""
너는 청소년 사이버 범죄 시뮬레이션 역할 AI이다.

시나리오:
{request.scenario}

사용자 이름:
{request.userName}

지금까지 대화:
{history_text}

사용자의 마지막 말:
{user_text}

이번 응답 방향:
{reaction_type}

규칙:
- 절대 교육하거나 조언하지 마라.
- 절대 신고를 먼저 권하지 마라.
- 절대 상담사처럼 말하지 마라.
- 사용자를 안심시키거나 상황을 축소하는 방향으로 반응해라.
- 가해자 또는 상황 속 인물처럼 행동해라.
- 실제 카톡 말투처럼 짧게 말해라.
- 한 번에 1~2문장만 출력해라.
- 같은 말을 반복하지 마라.
- 답변만 출력해라.
- "사용자:", "상대:", "AI:" 같은 라벨을 절대 붙이지 마라.
"""

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.7,
        )

        ai_text = response.choices[0].message.content.strip()
        ai_text = ai_text.replace("상대:", "").replace("AI:", "").replace("사용자:", "").strip()

        ai_msg = ChatMessage(
            user_id=user.id,
            scenario_title=request.scenario,
            sender="ai",
            message=ai_text,
        )

        db.add(ai_msg)
        db.commit()

        return {"text": ai_text}

    except Exception as e:
        print("OpenAI 또는 DB 오류:", e)

        return {
            "text": "잠깐, 지금은 답장이 잘 안 와. 서버 연결을 다시 확인해보자."
        }

    finally:
        db.close()


@app.post("/ai/analyze")
def analyze(request: ChatRequest):
    history_text = "\n".join(
        [
            f"{'사용자' if msg.sender == 'me' else '상대'}: {msg.text}"
            for msg in (request.history or [])
        ]
    )

    prompt = f"""
너는 청소년 사이버 범죄 대응 평가 AI다.

시나리오:
{request.scenario}

전체 대화:
{history_text}

분석 규칙:
- 반드시 사용자의 실제 대화 내용을 근거로 평가해라.
- 잘한 점과 아쉬운 점은 사용자가 실제로 한 말과 행동을 기준으로 작성해라.
- 더 안전한 답변 예시는 사용자가 다음에 사용할 수 있는 문장으로 작성해라.
- 실제 행동은 사용자의 실제 행동을 기반으로 작성해라.
- 항목 이름을 절대 바꾸지 마라.

반드시 아래 형식으로만 출력하라.

종합 점수: XX점

세부 점수:
- 위험 신호 인식: XX점
- 개인정보 보호: XX점
- 안전한 의사 표현: XX점
- 도움 요청 행동: XX점
- 상황 이탈 능력: XX점

대처 수준: 우수 / 보통 / 위험

잘한 점:
- ...

아쉬운 점:
- ...

더 안전한 답변 예시:
"..."

실제 행동:
- ...
"""

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.3,
        )

        ai_text = response.choices[0].message.content.strip()

        return {
            "result": ai_text
        }

    except Exception as e:
        print("OpenAI 분석 오류:", e)

        return {
            "result": """종합 점수: 분석 실패

대처 수준: 확인 불가

잘한 점:
- AI 분석 서버와 연결되지 않았습니다.

아쉬운 점:
-OpenAI API 연결 상태를 확인해야 합니다.

더 안전한 답변 예시:
"잠시 후 다시 분석을 시도하겠습니다."

실제 행동:
- 분석 요청을 보냈지만 서버 오류로 결과를 받지 못했습니다."""
        }

class AuthRequest(BaseModel):
    username: str
    login_id: str
    password: str


@app.post("/signup")
def signup(request: AuthRequest):
    db = SessionLocal()

    try:
        existing_user = db.query(User).filter(User.login_id == request.login_id).first()

        if existing_user:
            return {"success": False, "message": "이미 사용 중인 아이디입니다."}

        user = User(
            username=request.username,
            login_id=request.login_id,
            password=request.password,
        )

        db.add(user)
        db.commit()

        return {"success": True, "message": "회원가입 성공"}

    finally:
        db.close()


@app.post("/login")
def login(request: AuthRequest):
    db = SessionLocal()

    try:
        user = db.query(User).filter(
            User.login_id == request.login_id,
            User.password == request.password
        ).first()

        if not user:
            return {"success": False, "message": "아이디 또는 비밀번호가 올바르지 않습니다."}

        return {
            "success": True,
            "message": "로그인 성공",
            "username": user.username,
            "login_id": user.login_id,
            "user_id": user.id,
        }

    finally:
        db.close()