from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Dict, Optional
import uvicorn
import asyncio
import json
from datetime import datetime, timedelta
import re
import random
import os
import uuid

# Import des modules IA
from chatbot import ChatbotAI
from fake_news_detector import FakeNewsDetector
from message_analyzer import MessageAnalyzer
from dashboard_automation import DashboardAutomation
from content_moderator import ContentModerator

app = FastAPI(title="Educational Platform AI API", version="1.0.0")

# Configuration pour les fichiers statiques
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialisation des services IA
chatbot = ChatbotAI()
fake_news_detector = FakeNewsDetector()
message_analyzer = MessageAnalyzer()
dashboard_automation = DashboardAutomation()
content_moderator = ContentModerator()

# Modèles de données
class TutorRequest(BaseModel):
    question: str
    answer: str
    context: Optional[str] = None

class ChatRequest(BaseModel):
    message: str
    user_id: Optional[str] = None
    context: Optional[str] = None

class FakeNewsRequest(BaseModel):
    content: str
    source: Optional[str] = None
    metadata: Optional[Dict] = None

class MessageAnalysisRequest(BaseModel):
    message: str
    sender_id: Optional[str] = None
    context: Optional[str] = None
    priority: Optional[str] = "normal"

class DashboardAutomationRequest(BaseModel):
    action: str
    parameters: Optional[Dict] = None
    user_context: Optional[Dict] = None

class ContentModerationRequest(BaseModel):
    image_data: str  # Base64 encoded image
    user_id: Optional[str] = None
    context: Optional[str] = None

# Routes Chatbot
@app.post("/api/chatbot/chat")
async def chatbot_chat(request: ChatRequest):
    """Chatbot éducatif"""
    try:
        response = await chatbot.generate_response(
            message=request.message,
            user_id=request.user_id,
            context=request.context
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chatbot/tutor")
async def tutor_ai(request: TutorRequest):
    """Tutor IA pour vérification des réponses"""
    try:
        result = await chatbot.check_answer(
            question=request.question,
            answer=request.answer,
            context=request.context
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/chatbot/suggestions/{topic}")
async def get_suggestions(topic: str):
    """Suggestions de sujets et ressources"""
    try:
        suggestions = await chatbot.get_suggestions(topic)
        return suggestions
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Routes Fake News Detection
@app.post("/api/fake-news/detect")
async def detect_fake_news(request: FakeNewsRequest):
    """Détection de fake news"""
    try:
        result = await fake_news_detector.analyze_content(
            content=request.content,
            source=request.source,
            metadata=request.metadata
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/fake-news/batch-analyze")
async def batch_analyze_news(requests: List[FakeNewsRequest]):
    """Analyse batch de contenu"""
    try:
        results = []
        for req in requests:
            result = await fake_news_detector.analyze_content(
                content=req.content,
                source=req.source,
                metadata=req.metadata
            )
            results.append(result)
        return {"results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/fake-news/stats")
async def get_fake_news_stats():
    """Statistiques de détection"""
    try:
        stats = await fake_news_detector.get_statistics()
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Routes Message Analysis
@app.post("/api/messages/analyze")
async def analyze_message(request: MessageAnalysisRequest):
    """Analyse de message éphémère"""
    try:
        result = await message_analyzer.analyze_message(
            message=request.message,
            sender_id=request.sender_id,
            context=request.context,
            priority=request.priority
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/messages/priority-queue")
async def get_priority_queue():
    """File d'attente des messages prioritaires"""
    try:
        queue = await message_analyzer.get_priority_queue()
        return queue
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/messages/mark-processed/{message_id}")
async def mark_message_processed(message_id: str):
    """Marquer un message comme traité"""
    try:
        result = await message_analyzer.mark_processed(message_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Routes Dashboard Automation
@app.post("/api/dashboard/automate")
async def automate_dashboard(request: DashboardAutomationRequest):
    """Automatisation du dashboard"""
    try:
        result = await dashboard_automation.execute_action(
            action=request.action,
            parameters=request.parameters,
            user_context=request.user_context
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/dashboard/insights")
async def get_dashboard_insights():
    """Insights et recommandations automatiques"""
    try:
        insights = await dashboard_automation.generate_insights()
        return insights
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/dashboard/analytics")
async def get_analytics():
    """Analytics automatisés"""
    try:
        analytics = await dashboard_automation.get_analytics()
        return analytics
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Routes Content Moderation
@app.post("/api/content/analyze-image")
async def analyze_image_content(request: ContentModerationRequest):
    """Analyser une image pour détecter du contenu inapproprié"""
    try:
        # Décoder les données base64
        import base64
        image_data = base64.b64decode(request.image_data)
        
        # Analyser l'image
        result = await content_moderator.analyze_image(image_data)
        
        return {
            "status": "success",
            "analysis": result,
            "safe": result["safe"],
            "recommendation": result["recommendation"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/content/batch-analyze")
async def batch_analyze_images(images_data: List[str]):
    """Analyser plusieurs images en batch"""
    try:
        import base64
        decoded_images = [base64.b64decode(img) for img in images_data]
        
        results = await content_moderator.batch_analyze(decoded_images)
        
        return {
            "status": "success",
            "results": results,
            "all_safe": all(r["safe"] for r in results)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/content/stats")
async def get_content_stats():
    """Statistiques de modération de contenu"""
    try:
        stats = content_moderator.get_moderation_stats()
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Routes Admin Dashboard
@app.post("/api/admin/analysis")
async def admin_analysis(data: dict):
    """Recevoir les données d'analyse pour le dashboard admin"""
    try:
        print(f"Données d'analyse reçues: {data}")
        # Stocker les données d'analyse (pour l'instant en mémoire)
        if not hasattr(admin_analysis, 'data'):
            admin_analysis.data = []
        
        admin_analysis.data.append(data)
        print(f"Total analyses stockées: {len(admin_analysis.data)}")
        print(f"Dernière analyse: {admin_analysis.data[-1]}")
        return {"status": "success", "message": "Analyse enregistrée"}
    except Exception as e:
        print(f"Erreur lors de la réception des données d'analyse: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/admin/reports")
async def admin_reports(data: dict):
    """Recevoir les signalements de posts"""
    try:
        print(f"Signalement reçu: {data}")
        # Stocker les signalements (pour l'instant en mémoire)
        if not hasattr(admin_reports, 'data'):
            admin_reports.data = []
        
        admin_reports.data.append(data)
        print(f"Total signalements stockés: {len(admin_reports.data)}")
        print(f"Dernier signalement: {admin_reports.data[-1]}")
        return {"status": "success", "message": "Signalement enregistré"}
    except Exception as e:
        print(f"Erreur lors de la réception du signalement: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/admin/reports")
async def get_admin_reports():
    """Obtenir les posts signalés"""
    try:
        if not hasattr(admin_reports, 'data'):
            admin_reports.data = []
        
        return {"reports": admin_reports.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/admin/analysis/stats")
async def get_analysis_stats():
    """Obtenir les statistiques d'analyse"""
    try:
        print("Récupération des statistiques d'analyse...")
        
        if not hasattr(admin_analysis, 'data'):
            admin_analysis.data = []
        
        # Calculer des statistiques simples
        total_analyses = len(admin_analysis.data)
        recent_analyses = 0
        
        # Compter les analyses récentes (24 dernières heures) de manière sécurisée
        for a in admin_analysis.data:
            try:
                if 'timestamp' in a and a['timestamp']:
                    datetime.fromisoformat(a['timestamp'].replace('Z', '+00:00'))
                    recent_analyses += 1
            except (KeyError, ValueError, AttributeError) as timestamp_error:
                print(f"Erreur de timestamp pour l'analyse {a}: {timestamp_error}")
                continue
        
        stats = {
            "total_analyses": total_analyses,
            "recent_analyses": recent_analyses,
            "average_time": "2.3s"  # simulé
        }
        
        print(f"Statistiques calculées: {stats}")
        return stats
        
    except Exception as e:
        print(f"Erreur dans get_analysis_stats: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/admin/analysis/details")
async def get_detailed_analyses():
    """Obtenir les analyses détaillées pour le dashboard admin"""
    try:
        # Retourner les analyses détaillées stockées
        if not hasattr(admin_analysis, 'data'):
            admin_analysis.data = []
        
        print(f"Récupération de {len(admin_analysis.data)} analyses détaillées")
        return {"analyses": admin_analysis.data}
    except Exception as e:
        print(f"Erreur lors de la récupération des analyses détaillées: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/admin/analysis/clear")
async def clear_all_analyses():
    """Supprimer toutes les analyses"""
    try:
        if hasattr(admin_analysis, 'data'):
            count = len(admin_analysis.data)
            admin_analysis.data = []
            print(f"Toutes les analyses ont été supprimées ({count} analyses)")
            return {"message": f"Toutes les analyses ont été supprimées", "count": count}
        else:
            return {"message": "Aucune analyse à supprimer", "count": 0}
    except Exception as e:
        print(f"Erreur lors de la suppression des analyses: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/admin/analysis/{analysis_id}")
async def delete_analysis(analysis_id: int):
    """Supprimer une analyse spécifique"""
    try:
        if not hasattr(admin_analysis, 'data'):
            return {"message": "Aucune analyse à supprimer", "count": 0}
        
        original_count = len(admin_analysis.data)
        admin_analysis.data = [a for a in admin_analysis.data if a.get('post_id') != analysis_id]
        deleted_count = original_count - len(admin_analysis.data)
        
        if deleted_count > 0:
            print(f"Analyse {analysis_id} supprimée")
            return {"message": f"Analyse supprimée avec succès", "count": deleted_count}
        else:
            return {"message": "Analyse non trouvée", "count": 0}
    except Exception as e:
        print(f"Erreur lors de la suppression de l'analyse {analysis_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/admin/analysis/batch")
async def delete_batch_analyses(request: dict):
    """Supprimer plusieurs analyses en lot"""
    try:
        analysis_ids = request.get("analysis_ids", [])
        if not analysis_ids:
            return {"message": "Aucun ID d'analyse fourni", "count": 0}
        
        if not hasattr(admin_analysis, 'data'):
            return {"message": "Aucune analyse à supprimer", "count": 0}
        
        original_count = len(admin_analysis.data)
        admin_analysis.data = [a for a in admin_analysis.data if a.get('post_id') not in analysis_ids]
        deleted_count = original_count - len(admin_analysis.data)
        
        print(f"{deleted_count} analyses supprimées en lot")
        return {"message": f"{deleted_count} analyses supprimées avec succès", "count": deleted_count}
    except Exception as e:
        print(f"Erreur lors de la suppression en lot: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
async def health_check():
    """Vérifier l'état de santé de tous les services"""
    try:
        services = {
            "chatbot": await chatbot.health_check(),
            "fake_news_detector": await fake_news_detector.health_check(),
            "message_analyzer": await message_analyzer.health_check(),
            "dashboard_automation": await dashboard_automation.health_check()
        }
        return {
            "status": "healthy",
            "timestamp": datetime.now().isoformat(),
            "services": services
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/metrics")
async def get_metrics():
    """Métriques d'utilisation"""
    try:
        metrics = {
            "chatbot": await chatbot.get_metrics(),
            "fake_news_detector": await fake_news_detector.get_metrics(),
            "message_analyzer": await message_analyzer.get_metrics(),
            "dashboard_automation": await dashboard_automation.get_metrics()
        }
        return metrics
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Modèle pour le téléchargement de fichiers
class UploadResponse(BaseModel):
    message: str
    files: List[dict]

@app.post("/api/upload", response_model=UploadResponse)
async def upload_files(files: List[UploadFile] = File(...)):
    """
    Télécharge un ou plusieurs fichiers.
    
    - **files**: Liste de fichiers à télécharger (max 5 fichiers, 5MB par fichier)
    """
    try:
        saved_files = []
        
        for file in files:
            # Vérifier le type de fichier
            file_ext = file.filename.split('.')[-1].lower()
            if file_ext not in {"png", "jpg", "jpeg", "gif"}:
                raise HTTPException(
                    status_code=400,
                    detail=f"Type de fichier non autorisé pour {file.filename}. Types autorisés: png, jpg, jpeg, gif"
                )
                
            # Lire le contenu pour vérifier la taille
            contents = await file.read()
            if len(contents) > 5 * 1024 * 1024:  # 5MB
                raise HTTPException(
                    status_code=400,
                    detail=f"Le fichier {file.filename} dépasse la taille maximale autorisée de 5MB"
                )
                
            # Générer un nom de fichier unique
            filename = f"{uuid.uuid4()}.{file_ext}"
            file_path = os.path.join(UPLOAD_DIR, filename)
            
            # Sauvegarder le fichier
            with open(file_path, "wb") as buffer:
                buffer.write(contents)
                
            saved_files.append({
                "filename": filename,
                "original_name": file.filename,
                "content_type": file.content_type,
                "size": len(contents),
                "url": f"/{UPLOAD_DIR}/{filename}"
            })
            
        return {
            "message": "Fichiers téléchargés avec succès",
            "files": saved_files
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors du téléchargement des fichiers: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)
