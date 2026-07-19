from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from ai_service import AIService

app = FastAPI()

# Allow CORS for frontend (Vercel) and local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Will be locked down after getting the Vercel URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ai_service = AIService()

@app.get("/")
def read_root():
    return {"message": "Hello from Python Backend!"}

@app.get("/api/ai/health")
def health_check():
    return {"status": "AI Service is running", "version": "1.0.0"}

@app.post("/api/ai/generate-workout")
def generate_workout(goal: str, fitness_level: str):
    return ai_service.generate_workout_plan(goal, fitness_level)

@app.post("/api/ai/chat")
def chat(message: str, username: str = "fighter"):
    return {"response": ai_service.generate_chat_response(message, username)}

@app.post("/api/ai/scan-meal")
def scan_meal(text_hint: str):
    return ai_service.classify_meal(text_hint)

@app.post("/api/ai/train-scouter")
def train_scouter():
    return ai_service.train_scouter_model()

@app.get("/api/ai/scouter-status")
def scouter_status():
    return ai_service.get_scouter_status()
