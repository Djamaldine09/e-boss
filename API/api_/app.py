from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import uvicorn
from datetime import datetime
import json
from chatbot import ChatbotAI

app = FastAPI()

# Initialisation du chatbot
chatbot = ChatbotAI()

# Stockage en mémoire (à remplacer par une base de données réelle)
analysis_data_store = []
reports_store = []

class TutorRequest(BaseModel):
    question: str
    answer: str

class AnalysisData(BaseModel):
    post_id: int
    post_content: str
    post_author: str
    analysis: Dict[str, Any]
    timestamp: str
    type: str

class ReportData(BaseModel):
    post_id: int
    post_content: str
    post_author: str
    reason: str
    analysis_data: Optional[Dict[str, Any]] = None
    timestamp: str
    type: str

class ChatRequest(BaseModel):
    message: str
    user_id: Optional[str] = None
    context: Optional[str] = None

@app.post("/tutor")
def tutor(data: TutorRequest):
    return {
        "status": "incorrect",
        "hint": "essaie de factoriser",
        "next_step": "isoler le terme commun"
    }

# Endpoints pour l'analyse et les signalements admin
@app.post("/api/admin/analysis")
async def receive_analysis_data(data: AnalysisData):
    """Reçoit les données d'analyse du frontend"""
    try:
        analysis_data_store.append(data.dict())
        return {
            "status": "success",
            "message": "Données d'analyse reçues avec succès",
            "total_analyses": len(analysis_data_store)
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"Erreur lors de la réception des données: {str(e)}"
        }

@app.get("/api/admin/analysis/stats")
async def get_analysis_stats():
    """Retourne les statistiques d'analyse pour le dashboard admin"""
    try:
        if not analysis_data_store:
            return {
                "total_analyses": 0,
                "sentiment_distribution": {},
                "fake_news_count": 0,
                "recent_analyses": []
            }
        
        # Calculer les statistiques
        sentiment_counts = {"positive": 0, "negative": 0, "neutral": 0}
        fake_news_count = 0
        
        for analysis in analysis_data_store:
            # Compter les sentiments
            if "sentiment" in analysis.get("analysis", {}):
                sentiment = analysis["analysis"]["sentiment"].get("analysis", {}).get("sentiment", {}).get("sentiment", "neutral")
                if sentiment in sentiment_counts:
                    sentiment_counts[sentiment] += 1
            
            # Compter les fake news
            if "fake_news" in analysis.get("analysis", {}):
                status = analysis["analysis"]["fake_news"].get("status", "")
                if status in ["fake", "suspicious"]:
                    fake_news_count += 1
        
        # Obtenir les analyses récentes
        recent_analyses = sorted(
            analysis_data_store, 
            key=lambda x: x.get("timestamp", ""), 
            reverse=True
        )[:5]
        
        return {
            "total_analyses": len(analysis_data_store),
            "sentiment_distribution": sentiment_counts,
            "fake_news_count": fake_news_count,
            "recent_analyses": recent_analyses
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"Erreur lors de la récupération des statistiques: {str(e)}"
        }

@app.post("/api/admin/reports")
async def receive_report(data: ReportData):
    """Reçoit un signalement de post"""
    try:
        reports_store.append(data.dict())
        return {
            "status": "success",
            "message": "Signalement reçu avec succès",
            "total_reports": len(reports_store)
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"Erreur lors de la réception du signalement: {str(e)}"
        }

@app.get("/api/admin/reports")
async def get_reports():
    """Retourne la liste des posts signalés"""
    try:
        return {
            "status": "success",
            "reports": sorted(reports_store, key=lambda x: x.get("timestamp", ""), reverse=True),
            "total_reports": len(reports_store)
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"Erreur lors de la récupération des signalements: {str(e)}"
        }

# Endpoints pour le chatbot
@app.post("/api/chatbot/chat")
async def chat_with_bot(request: ChatRequest):
    """Chat avec le bot"""
    try:
        response = await chatbot.generate_response(
            message=request.message,
            user_id=request.user_id,
            context=request.context
        )
        return response
    except Exception as e:
        return {
            "text": "Désolé, je n'ai pas pu traiter votre demande. Veuillez réessayer.",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }

@app.post("/api/chatbot/tutor")
async def tutor_check_answer(request: TutorRequest):
    """Vérifie la réponse d'un étudiant"""
    try:
        response = await chatbot.check_answer(
            question=request.question,
            answer=request.answer,
            context=request.context
        )
        return response
    except Exception as e:
        return {
            "status": "error",
            "error": str(e),
            "feedback": "Erreur lors de l'analyse de votre réponse"
        }

@app.get("/api/chatbot/suggestions/{topic}")
async def get_suggestions(topic: str):
    """Obtient des suggestions pour un sujet"""
    try:
        response = await chatbot.get_suggestions(topic)
        return response
    except Exception as e:
        return {
            "error": str(e),
            "suggestions": [],
            "resources": []
        }

@app.get("/api/health")
async def health_check():
    """Vérification de santé du service"""
    try:
        chatbot_health = await chatbot.health_check()
        return {
            "status": "healthy",
            "chatbot": chatbot_health,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }

@app.get("/api/metrics")
async def get_metrics():
    """Obtient les métriques du chatbot"""
    try:
        metrics = await chatbot.get_metrics()
        return metrics
    except Exception as e:
        return {
            "error": str(e),
            "total_requests": 0,
            "successful_responses": 0,
            "average_response_time": 0,
            "success_rate": 0
        }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)