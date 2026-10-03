import asyncio
import json
import re
from datetime import datetime, timedelta
from typing import Dict, List, Optional
from collections import defaultdict

class MessageAnalyzer:
    def __init__(self):
        self.message_queue = []
        self.priority_queue = []
        self.processed_messages = []
        
        # Catégories de messages
        self.categories = {
            "question": ["?", "comment", "pourquoi", "quoi", "comment", "aide", "besoin"],
            "urgent": ["urgent", "urgence", "rapidement", "vite", "immédiatement", "asap"],
            "technical": ["erreur", "bug", "problème", "ne fonctionne pas", "erreur", "exception"],
            "academic": ["cours", "exercice", "devoir", "examen", "note", "professeur"],
            "administrative": ["inscription", "paiement", "document", "certificat", "admin"],
            "social": ["bonjour", "merci", "salut", "au revoir", "bravo", "félicitations"]
        }
        
        # Mots-clés pour la priorité
        self.urgency_keywords = {
            "high": ["urgent", "urgence", "critique", "bloqué", "panique", "perdu"],
            "medium": ["important", "nécessaire", "aide", "problème", "question"],
            "low": ["info", "question", "curiosité", "général", "discussion"]
        }
        
        self.metrics = {
            "total_messages": 0,
            "processed_messages": 0,
            "priority_messages": 0,
            "categories_detected": defaultdict(int),
            "response_times": [],
            "average_processing_time": 0
        }
    
    async def analyze_message(self, message: str, sender_id: Optional[str] = None, context: Optional[str] = None, priority: Optional[str] = "normal") -> Dict:
        """Analyse un message éphémère"""
        start_time = datetime.now()
        
        try:
            self.metrics["total_messages"] += 1
            
            # Analyse du message
            analysis = self._perform_text_analysis(message)
            
            # Détection de la catégorie
            category = self._detect_category(message)
            analysis["category"] = category
            
            # Calcul de la priorité
            calculated_priority = self._calculate_priority(message, priority)
            analysis["priority"] = calculated_priority
            
            # Détection du sentiment
            sentiment = self._detect_sentiment(message)
            analysis["sentiment"] = sentiment
            
            # Extraction d'entités
            entities = self._extract_entities(message)
            analysis["entities"] = entities
            
            # Détection des actions requises
            required_actions = self._detect_required_actions(message, category)
            analysis["required_actions"] = required_actions
            
            # Création de l'objet message
            message_obj = {
                "id": f"msg_{datetime.now().strftime('%Y%m%d_%H%M%S_%f')}",
                "message": message,
                "sender_id": sender_id,
                "context": context,
                "timestamp": datetime.now().isoformat(),
                "analysis": analysis,
                "status": "pending",
                "priority": calculated_priority
            }
            
            # Ajout à la file d'attente
            self._add_to_queue(message_obj)
            
            # Mise à jour des métriques
            self.metrics["categories_detected"][category] += 1
            if calculated_priority in ["high", "critical"]:
                self.metrics["priority_messages"] += 1
            
            processing_time = (datetime.now() - start_time).total_seconds()
            self.metrics["response_times"].append(processing_time)
            
            return {
                "message_id": message_obj["id"],
                "analysis": analysis,
                "queue_position": self._get_queue_position(message_obj["id"]),
                "estimated_processing_time": self._estimate_processing_time(calculated_priority),
                "recommendations": self._generate_recommendations(analysis),
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            return {
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }
    
    def _perform_text_analysis(self, message: str) -> Dict:
        """Effectue l'analyse textuelle du message"""
        # Caractéristiques de base
        basic_features = {
            "length": len(message),
            "word_count": len(message.split()),
            "sentence_count": len(re.split(r'[.!?]+', message)),
            "exclamation_count": message.count("!"),
            "question_count": message.count("?"),
            "uppercase_ratio": sum(1 for c in message if c.isupper()) / len(message) if message else 0
        }
        
        # Détection de patterns
        patterns = {
            "has_emoji": bool(re.search(r'[\U0001F600-\U0001F64F\U0001F300-\U0001F5FF\U0001F680-\U0001F6FF\U0001F1E0-\U0001F1FF]', message)),
            "has_url": bool(re.search(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', message)),
            "has_email": bool(re.search(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', message)),
            "has_phone": bool(re.search(r'\b\d{10,}\b|\+?\d{1,3}[-.\s]?\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b', message))
        }
        
        # Analyse linguistique simple
        linguistic_features = {
            "language": self._detect_language(message),
            "complexity_score": self._calculate_complexity(message),
            "formality_score": self._calculate_formality(message)
        }
        
        return {
            **basic_features,
            **patterns,
            **linguistic_features
        }
    
    def _detect_category(self, message: str) -> str:
        """Détecte la catégorie du message"""
        message_lower = message.lower()
        category_scores = {}
        
        for category, keywords in self.categories.items():
            score = sum(1 for keyword in keywords if keyword in message_lower)
            category_scores[category] = score
        
        if category_scores:
            return max(category_scores, key=category_scores.get)
        return "general"
    
    def _calculate_priority(self, message: str, user_priority: str) -> str:
        """Calcule la priorité du message"""
        message_lower = message.lower()
        
        # Priorité basée sur les mots-clés
        for priority, keywords in self.urgency_keywords.items():
            if any(keyword in message_lower for keyword in keywords):
                return priority
        
        # Priorité basée sur la longueur et les caractéristiques
        if len(message) > 200 or message.count("!") > 2:
            return "high"
        elif len(message) > 100 or message.count("?") > 1:
            return "medium"
        
        # Priorité de l'utilisateur
        return user_priority
    
    def _detect_sentiment(self, message: str) -> Dict:
        """Détecte le sentiment du message"""
        positive_words = ["bon", "bien", "excellent", "merci", "super", "génial", "bravo", "félicitations"]
        negative_words = ["mauvais", "problème", "erreur", "difficile", "urgent", "bloqué", "perdu", "échec"]
        neutral_words = ["info", "question", "comment", "pourquoi", "quoi", "où"]
        
        message_lower = message.lower()
        
        positive_count = sum(1 for word in positive_words if word in message_lower)
        negative_count = sum(1 for word in negative_words if word in message_lower)
        neutral_count = sum(1 for word in neutral_words if word in message_lower)
        
        total = positive_count + negative_count + neutral_count
        
        if total == 0:
            return {"sentiment": "neutral", "confidence": 0.5}
        
        # Calcul du sentiment
        if positive_count > negative_count and positive_count > neutral_count:
            sentiment = "positive"
            confidence = positive_count / total
        elif negative_count > positive_count and negative_count > neutral_count:
            sentiment = "negative"
            confidence = negative_count / total
        else:
            sentiment = "neutral"
            confidence = neutral_count / total
        
        return {
            "sentiment": sentiment,
            "confidence": min(0.9, confidence + 0.1),
            "scores": {
                "positive": positive_count,
                "negative": negative_count,
                "neutral": neutral_count
            }
        }
    
    def _extract_entities(self, message: str) -> List[Dict]:
        """Extrait les entités du message"""
        entities = []
        
        # Extraction des URLs
        urls = re.findall(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', message)
        for url in urls:
            entities.append({"type": "url", "value": url})
        
        # Extraction des emails
        emails = re.findall(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', message)
        for email in emails:
            entities.append({"type": "email", "value": email})
        
        # Extraction des nombres
        numbers = re.findall(r'\b\d+(?:\.\d+)?\b', message)
        for number in numbers:
            entities.append({"type": "number", "value": number})
        
        # Extraction des dates (simple)
        dates = re.findall(r'\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b|\b\d{4}[/-]\d{1,2}[/-]\d{1,2}\b', message)
        for date in dates:
            entities.append({"type": "date", "value": date})
        
        return entities
    
    def _detect_required_actions(self, message: str, category: str) -> List[str]:
        """Détecte les actions requises"""
        actions = []
        
        # Actions basées sur la catégorie
        category_actions = {
            "question": ["answer", "provide_information"],
            "urgent": ["immediate_response", "escalate"],
            "technical": ["technical_support", "troubleshoot"],
            "academic": ["academic_guidance", "resource_provision"],
            "administrative": ["admin_support", "documentation"],
            "social": ["acknowledge", "friendly_response"]
        }
        
        if category in category_actions:
            actions.extend(category_actions[category])
        
        # Actions basées sur les mots-clés
        message_lower = message.lower()
        
        if any(word in message_lower for word in ["aide", "help", "support"]):
            actions.append("provide_help")
        
        if any(word in message_lower for word in ["contact", "appeler", "téléphone"]):
            actions.append("contact_support")
        
        if any(word in message_lower for word in ["rendez-vous", "meeting", "disponibilité"]):
            actions.append("schedule_meeting")
        
        return list(set(actions))  # Éliminer les doublons
    
    def _add_to_queue(self, message_obj: Dict):
        """Ajoute un message à la file d'attente appropriée"""
        priority = message_obj["priority"]
        
        if priority in ["high", "critical"]:
            self.priority_queue.append(message_obj)
            self.priority_queue.sort(key=lambda x: self._priority_order[x["priority"]])
        else:
            self.message_queue.append(message_obj)
    
    def _priority_order(self, priority: str) -> int:
        """Ordre de priorité"""
        order = {"critical": 0, "high": 1, "medium": 2, "low": 3, "normal": 2}
        return order.get(priority, 2)
    
    def _get_queue_position(self, message_id: str) -> int:
        """Obtient la position dans la file d'attente"""
        for i, msg in enumerate(self.priority_queue):
            if msg["id"] == message_id:
                return i + 1
        
        for i, msg in enumerate(self.message_queue):
            if msg["id"] == message_id:
                return len(self.priority_queue) + i + 1
        
        return -1
    
    def _estimate_processing_time(self, priority: str) -> int:
        """Estime le temps de traitement en secondes"""
        times = {
            "critical": 30,
            "high": 60,
            "medium": 180,
            "low": 300,
            "normal": 180
        }
        return times.get(priority, 180)
    
    def _generate_recommendations(self, analysis: Dict) -> List[str]:
        """Génère des recommandations basées sur l'analyse"""
        recommendations = []
        
        # Recommandations basées sur la catégorie
        category = analysis.get("category", "general")
        if category == "urgent":
            recommendations.append("Traitement immédiat requis")
        elif category == "technical":
            recommendations.append("Transférer au support technique")
        elif category == "academic":
            recommendations.append("Contacter un tuteur académique")
        
        # Recommandations basées sur le sentiment
        sentiment = analysis.get("sentiment", {})
        if sentiment.get("sentiment") == "negative":
            recommendations.append("Réponse empathique requise")
        
        # Recommandations basées sur la complexité
        complexity = analysis.get("complexity_score", 0)
        if complexity > 0.7:
            recommendations.append("Message complexe - Analyse détaillée requise")
        
        # Recommandations basées sur les entités
        entities = analysis.get("entities", [])
        if any(e["type"] == "url" for e in entities):
            recommendations.append("Vérifier les URLs fournies")
        
        return recommendations
    
    def _detect_language(self, message: str) -> str:
        """Détecte la langue du message (simple)"""
        french_indicators = ["é", "è", "ê", "à", "ù", "ç", "œ", "â", "î", "ô", "û"]
        english_indicators = ["th", "he", "in", "er", "on", "re", "ed"]
        
        french_count = sum(1 for char in french_indicators if char in message.lower())
        english_count = sum(1 for word in english_indicators if word in message.lower())
        
        if french_count > english_count:
            return "french"
        elif english_count > french_count:
            return "english"
        else:
            return "unknown"
    
    def _calculate_complexity(self, message: str) -> float:
        """Calcule un score de complexité"""
        words = message.split()
        if not words:
            return 0.0
        
        # Longueur moyenne des mots
        avg_word_length = sum(len(word) for word in words) / len(words)
        
        # Nombre de phrases
        sentences = re.split(r'[.!?]+', message)
        avg_sentence_length = len(words) / len(sentences) if sentences else 0
        
        # Score de complexité (0-1)
        complexity = (avg_word_length / 10 + avg_sentence_length / 20) / 2
        
        return min(1.0, complexity)
    
    def _calculate_formality(self, message: str) -> float:
        """Calcule un score de formalité"""
        informal_indicators = ["lol", "mdr", "slt", "bjr", "stp", "merci", "bisous"]
        formal_indicators = ["bonjour", "monsieur", "madame", "cordialement", "sincèrement"]
        
        message_lower = message.lower()
        
        informal_count = sum(1 for word in informal_indicators if word in message_lower)
        formal_count = sum(1 for word in formal_indicators if word in message_lower)
        
        total = informal_count + formal_count
        if total == 0:
            return 0.5  # Neutre
        
        return formal_count / total
    
    async def get_priority_queue(self) -> Dict:
        """Obtient la file d'attente prioritaire"""
        return {
            "priority_messages": len(self.priority_queue),
            "normal_messages": len(self.message_queue),
            "total_pending": len(self.priority_queue) + len(self.message_queue),
            "priority_queue": [
                {
                    "id": msg["id"],
                    "sender_id": msg["sender_id"],
                    "priority": msg["priority"],
                    "category": msg["analysis"]["category"],
                    "timestamp": msg["timestamp"],
                    "queue_position": i + 1
                }
                for i, msg in enumerate(self.priority_queue[:10])  # Limiter à 10
            ],
            "normal_queue": [
                {
                    "id": msg["id"],
                    "sender_id": msg["sender_id"],
                    "priority": msg["priority"],
                    "category": msg["analysis"]["category"],
                    "timestamp": msg["timestamp"]
                }
                for msg in self.message_queue[:5]  # Limiter à 5
            ]
        }
    
    async def mark_processed(self, message_id: str) -> Dict:
        """Marque un message comme traité"""
        # Rechercher dans les files d'attente
        message_to_process = None
        
        for i, msg in enumerate(self.priority_queue):
            if msg["id"] == message_id:
                message_to_process = self.priority_queue.pop(i)
                break
        
        if not message_to_process:
            for i, msg in enumerate(self.message_queue):
                if msg["id"] == message_id:
                    message_to_process = self.message_queue.pop(i)
                    break
        
        if message_to_process:
            message_to_process["status"] = "processed"
            message_to_process["processed_at"] = datetime.now().isoformat()
            self.processed_messages.append(message_to_process)
            self.metrics["processed_messages"] += 1
            
            return {
                "success": True,
                "message_id": message_id,
                "processed_at": message_to_process["processed_at"]
            }
        
        return {
            "success": False,
            "error": "Message non trouvé"
        }
    
    async def health_check(self) -> Dict:
        """Vérification de santé"""
        return {
            "status": "healthy",
            "pending_messages": len(self.priority_queue) + len(self.message_queue),
            "processed_messages": len(self.processed_messages),
            "categories_loaded": len(self.categories) > 0
        }
    
    async def get_metrics(self) -> Dict:
        """Obtient les métriques"""
        avg_processing_time = sum(self.metrics["response_times"]) / len(self.metrics["response_times"]) if self.metrics["response_times"] else 0
        
        return {
            **self.metrics,
            "average_processing_time": avg_processing_time,
            "processing_rate": self.metrics["processed_messages"] / self.metrics["total_messages"] if self.metrics["total_messages"] > 0 else 0,
            "categories_distribution": dict(self.metrics["categories_detected"])
        }
