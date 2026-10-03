import asyncio
import json
import random
from datetime import datetime
from typing import Dict, List, Optional

class ChatbotAI:
    def __init__(self):
        self.conversation_history = {}
        self.knowledge_base = self._load_knowledge_base()
        self.metrics = {
            "total_requests": 0,
            "successful_responses": 0,
            "topics_discussed": {},
            "response_times": []
        }
    
    def _load_knowledge_base(self) -> Dict:
        """Base de connaissances éducatives"""
        return {
            "mathematics": {
                "algebra": [
                    "Pour résoudre une équation linéaire, isolez la variable",
                    "La factorisation aide à simplifier les expressions algébriques",
                    "Les identités remarquables sont utiles pour les développements"
                ],
                "calculus": [
                    "La dérivée représente le taux de variation instantanée",
                    "L'intégrale permet de calculer l'aire sous une courbe",
                    "Les limites sont fondamentales en analyse"
                ]
            },
            "programming": {
                "python": [
                    "Python utilise l'indentation pour définir les blocs de code",
                    "Les listes en Python sont des collections ordonnées modifiables",
                    "Les fonctions permettent de réutiliser du code"
                ],
                "javascript": [
                    "JavaScript est un langage de programmation web côté client",
                    "Les fonctions fléchées permettent une syntaxe concise",
                    "Les promesses gèrent les opérations asynchrones"
                ]
            },
            "science": {
                "physics": [
                    "La deuxième loi de Newton: F = ma",
                    "L'énergie cinétique: E = 1/2 * m * v²",
                    "La loi d'Ohm: V = R * I"
                ],
                "chemistry": [
                    "La mole est l'unité de quantité de matière",
                    "Les réactions chimiques respectent la conservation de la masse",
                    "Le pH mesure l'acidité ou la basicité"
                ]
            }
        }
    
    async def generate_response(self, message: str, user_id: Optional[str] = None, context: Optional[str] = None) -> Dict:
        """Génère une réponse du chatbot"""
        start_time = datetime.now()
        
        try:
            self.metrics["total_requests"] += 1
            
            # Analyse du message
            message_lower = message.lower()
            
            # Détection du sujet
            topic = self._detect_topic(message_lower)
            
            # Génération de la réponse
            if self._is_question(message_lower):
                response = await self._answer_question(message, topic)
            elif self._is_help_request(message_lower):
                response = await self._provide_help(topic)
            else:
                response = await self._general_conversation(message, topic)
            
            # Mise à jour de l'historique
            if user_id:
                if user_id not in self.conversation_history:
                    self.conversation_history[user_id] = []
                self.conversation_history[user_id].append({
                    "timestamp": datetime.now().isoformat(),
                    "user_message": message,
                    "bot_response": response["text"],
                    "topic": topic
                })
            
            # Mise à jour des métriques
            self.metrics["successful_responses"] += 1
            if topic not in self.metrics["topics_discussed"]:
                self.metrics["topics_discussed"][topic] = 0
            self.metrics["topics_discussed"][topic] += 1
            
            response_time = (datetime.now() - start_time).total_seconds()
            self.metrics["response_times"].append(response_time)
            
            return {
                "text": response["text"],
                "topic": topic,
                "confidence": response.get("confidence", 0.8),
                "suggestions": response.get("suggestions", []),
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            return {
                "text": "Désolé, je n'ai pas pu traiter votre demande. Veuillez réessayer.",
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }
    
    async def check_answer(self, question: str, answer: str, context: Optional[str] = None) -> Dict:
        """Vérifie la réponse d'un étudiant"""
        try:
            # Analyse de la réponse
            analysis = self._analyze_answer(question, answer, context)
            
            # Génération des feedbacks
            feedback = self._generate_feedback(analysis)
            
            return {
                "status": analysis["status"],
                "confidence": analysis["confidence"],
                "feedback": feedback,
                "hint": analysis.get("hint"),
                "next_step": analysis.get("next_step"),
                "score": analysis.get("score", 0),
                "improvements": analysis.get("improvements", [])
            }
            
        except Exception as e:
            return {
                "status": "error",
                "error": str(e),
                "feedback": "Erreur lors de l'analyse de votre réponse"
            }
    
    async def get_suggestions(self, topic: str) -> Dict:
        """Obtient des suggestions pour un sujet"""
        try:
            suggestions = []
            
            # Suggestions basées sur la base de connaissances
            if topic in self.knowledge_base:
                for subtopic, facts in self.knowledge_base[topic].items():
                    suggestions.extend(facts)
            
            # Suggestions de ressources
            resources = self._get_resources_for_topic(topic)
            
            return {
                "topic": topic,
                "suggestions": suggestions[:5],  # Limiter à 5 suggestions
                "resources": resources,
                "related_topics": self._get_related_topics(topic)
            }
            
        except Exception as e:
            return {
                "error": str(e),
                "suggestions": [],
                "resources": []
            }
    
    def _detect_topic(self, message: str) -> str:
        """Détecte le sujet du message"""
        topic_keywords = {
            "mathematics": ["math", "calcul", "équation", "algèbre", "géométrie", "dérivée", "intégrale"],
            "programming": ["code", "programmation", "python", "javascript", "fonction", "variable", "algorithme"],
            "science": ["physique", "chimie", "biologie", "science", "molécule", "force", "énergie"],
            "general": ["aide", "question", "comment", "pourquoi", "explique"]
        }
        
        message_words = message.split()
        topic_scores = {}
        
        for topic, keywords in topic_keywords.items():
            score = sum(1 for word in message_words if any(keyword in word for keyword in keywords))
            topic_scores[topic] = score
        
        return max(topic_scores, key=topic_scores.get) if topic_scores else "general"
    
    def _is_question(self, message: str) -> bool:
        """Vérifie si le message est une question"""
        question_words = ["?", "comment", "pourquoi", "quoi", "où", "quand", "qui", "combien"]
        return any(word in message for word in question_words)
    
    def _is_help_request(self, message: str) -> bool:
        """Vérifie si c'est une demande d'aide"""
        help_words = ["aide", "help", "explique", "montre", "comment faire", "besoin d'aide"]
        return any(word in message for word in help_words)
    
    async def _answer_question(self, message: str, topic: str) -> Dict:
        """Répond à une question"""
        if topic in self.knowledge_base:
            facts = self._get_all_facts_for_topic(topic)
            if facts:
                fact = random.choice(facts)
                return {
                    "text": fact,
                    "confidence": 0.9,
                    "suggestions": self._get_related_questions(topic)
                }
        
        return {
            "text": "Je peux vous aider avec cette question. Pouvez-vous me donner plus de détails ?",
            "confidence": 0.6,
            "suggestions": ["Précisez votre question", "Donnez-moi le contexte"]
        }
    
    async def _provide_help(self, topic: str) -> Dict:
        """Fournit de l'aide sur un sujet"""
        if topic in self.knowledge_base:
            facts = self._get_all_facts_for_topic(topic)
            return {
                "text": f"Voici de l'aide pour {topic}: {random.choice(facts)}",
                "confidence": 0.8,
                "suggestions": facts[:3]
            }
        
        return {
            "text": "Je peux vous aider avec les mathématiques, la programmation et les sciences. Quel sujet vous intéresse ?",
            "confidence": 0.7,
            "suggestions": ["Mathématiques", "Programmation", "Sciences"]
        }
    
    async def _general_conversation(self, message: str, topic: str) -> Dict:
        """Conversation générale"""
        responses = [
            "C'est intéressant ! Pouvez-vous me dire plus à ce sujet ?",
            "Je comprends. Comment puis-je vous aider davantage ?",
            "Merci pour votre message. Y a-t-il quelque chose de spécifique que vous aimeriez savoir ?"
        ]
        
        return {
            "text": random.choice(responses),
            "confidence": 0.5,
            "suggestions": ["Posez une question spécifique", "Demandez de l'aide sur un sujet"]
        }
    
    def _analyze_answer(self, question: str, answer: str, context: Optional[str]) -> Dict:
        """Analyse une réponse"""
        # Simulation d'analyse (remplacer par vraie logique IA)
        answer_lower = answer.lower()
        
        # Critères simples de vérification
        if len(answer) < 10:
            return {
                "status": "incorrect",
                "confidence": 0.8,
                "hint": "Votre réponse semble trop courte. Essayez de développer davantage.",
                "next_step": "Ajoutez plus de détails à votre réponse",
                "score": 0.3
            }
        elif any(word in answer_lower for word in ["correct", "bon", "juste"]):
            return {
                "status": "correct",
                "confidence": 0.9,
                "score": 0.9,
                "improvements": ["Excellent travail !"]
            }
        else:
            return {
                "status": "partially_correct",
                "confidence": 0.6,
                "hint": "Vous êtes sur la bonne voie, mais vérifiez certains détails.",
                "next_step": "Revoyez les concepts clés",
                "score": 0.6
            }
    
    def _generate_feedback(self, analysis: Dict) -> str:
        """Génère des feedbacks personnalisés"""
        status = analysis["status"]
        
        feedback_messages = {
            "correct": [
                "Excellent travail ! Votre réponse est correcte.",
                "Parfait ! Vous avez bien compris le concept.",
                "Bravo ! C'est exactement ça."
            ],
            "incorrect": [
                "Ce n'est pas tout à fait correct. Révoyez la leçon et essayez encore.",
                "Votre réponse a besoin d'être corrigée. Pensez différemment.",
                "Pas encore. Essayez une autre approche."
            ],
            "partially_correct": [
                "Vous êtes sur la bonne voie ! Ajoutez quelques précisions.",
                "Bon début ! Peaufinez votre réponse.",
                "Presque ! Revoyez certains détails."
            ]
        }
        
        return random.choice(feedback_messages.get(status, ["Réessayez."]))
    
    def _get_all_facts_for_topic(self, topic: str) -> List[str]:
        """Obtient tous les faits pour un sujet"""
        facts = []
        if topic in self.knowledge_base:
            for subtopic_facts in self.knowledge_base[topic].values():
                facts.extend(subtopic_facts)
        return facts
    
    def _get_resources_for_topic(self, topic: str) -> List[Dict]:
        """Obtient des ressources pour un sujet"""
        resources = {
            "mathematics": [
                {"type": "video", "title": "Introduction à l'algèbre", "url": "#"},
                {"type": "exercise", "title": "Exercices pratiques", "url": "#"}
            ],
            "programming": [
                {"type": "tutorial", "title": "Tutoriel Python", "url": "#"},
                {"type": "documentation", "title": "Documentation officielle", "url": "#"}
            ],
            "science": [
                {"type": "simulation", "title": "Simulations physiques", "url": "#"},
                {"type": "experiment", "title": "Expériences virtuelles", "url": "#"}
            ]
        }
        return resources.get(topic, [])
    
    def _get_related_topics(self, topic: str) -> List[str]:
        """Obtient des sujets connexes"""
        related = {
            "mathematics": ["physics", "programming"],
            "programming": ["mathematics", "science"],
            "science": ["mathematics", "programming"]
        }
        return related.get(topic, [])
    
    def _get_related_questions(self, topic: str) -> List[str]:
        """Obtient des questions connexes"""
        questions = {
            "mathematics": [
                "Comment résoudre une équation quadratique ?",
                "Quelle est la différence entre dérivée et intégrale ?"
            ],
            "programming": [
                "Comment créer une fonction en Python ?",
                "Qu'est-ce qu'une boucle for ?"
            ],
            "science": [
                "Comment calculer la force ?",
                "Qu'est-ce qu'une réaction chimique ?"
            ]
        }
        return questions.get(topic, ["Posez-moi une question spécifique !"])
    
    async def health_check(self) -> Dict:
        """Vérification de santé"""
        return {
            "status": "healthy",
            "active_conversations": len(self.conversation_history),
            "knowledge_base_loaded": len(self.knowledge_base) > 0
        }
    
    async def get_metrics(self) -> Dict:
        """Obtient les métriques"""
        avg_response_time = sum(self.metrics["response_times"]) / len(self.metrics["response_times"]) if self.metrics["response_times"] else 0
        
        return {
            **self.metrics,
            "average_response_time": avg_response_time,
            "success_rate": self.metrics["successful_responses"] / self.metrics["total_requests"] if self.metrics["total_requests"] > 0 else 0
        }
