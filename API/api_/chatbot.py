import re
import time
from datetime import datetime
from typing import Dict, List, Optional


class ChatbotAI:
    """Assistant pédagogique conversationnel léger et contextuel."""

    def __init__(self):
        self.conversation_history: Dict[str, List[Dict]] = {}
        self.metrics = {
            "total_requests": 0,
            "successful_responses": 0,
            "topics_discussed": {},
            "response_times": []
        }

        self.topic_config = {
            "react": {
                "keywords": [
                    "react", "jsx", "hook", "hooks", "component", "composant",
                    "props", "state", "usestate", "useeffect", "usememo",
                    "usecallback", "context"
                ],
                "label": "React"
            },
            "express": {
                "keywords": [
                    "express", "expressjs", "route", "routes", "middleware",
                    "req", "res", "api", "rest", "cors", "node", "jwt"
                ],
                "label": "Express.js / Node.js"
            },
            "javascript": {
                "keywords": [
                    "javascript", "js", "promise", "async", "await", "array",
                    "tableau", "object", "objet", "function", "fonction",
                    "fetch", "axios", "dom", "event"
                ],
                "label": "JavaScript"
            },
            "python": {
                "keywords": [
                    "python", "fastapi", "django", "flask", "pip", "list",
                    "dict", "tuple", "class", "asyncio"
                ],
                "label": "Python"
            },
            "database": {
                "keywords": [
                    "sql", "mysql", "postgres", "postgresql", "mongodb",
                    "database", "base de données", "table", "query", "requête"
                ],
                "label": "Bases de données"
            },
            "web": {
                "keywords": [
                    "html", "css", "responsive", "frontend", "backend", "web",
                    "http", "url", "browser", "navigateur", "vercel", "render"
                ],
                "label": "Développement web"
            }
        }

    async def generate_response(
        self,
        message: str,
        user_id: Optional[str] = None,
        context: Optional[str] = None
    ) -> Dict:
        started = time.perf_counter()
        cleaned = re.sub(r"\s+", " ", (message or "").strip())
        self.metrics["total_requests"] += 1

        if not cleaned:
            return self._build_response(
                "Je suis prêt à vous aider. Posez-moi votre question et je vous répondrai avec une explication claire, un exemple si nécessaire et les prochaines étapes.",
                "general",
                0.99,
                [
                    "Explique-moi useState",
                    "Aide-moi avec Express",
                    "Analyse mon erreur",
                    "Donne-moi un exercice"
                ]
            )

        history = self.conversation_history.setdefault(user_id, []) if user_id else []
        topic = self._detect_topic(cleaned, history)
        intent = self._detect_intent(cleaned)

        response_text, confidence, suggestions = self._compose_response(
            cleaned, topic, intent, context, history
        )

        if user_id:
            history.append({
                "timestamp": datetime.now().isoformat(),
                "user_message": cleaned,
                "bot_response": response_text,
                "topic": topic,
                "intent": intent
            })
            self.conversation_history[user_id] = history[-14:]

        self.metrics["successful_responses"] += 1
        self.metrics["topics_discussed"][topic] = (
            self.metrics["topics_discussed"].get(topic, 0) + 1
        )
        self.metrics["response_times"].append(
            round(time.perf_counter() - started, 4)
        )

        return self._build_response(response_text, topic, confidence, suggestions)

    def _build_response(
        self,
        text: str,
        topic: str,
        confidence: float,
        suggestions: List[str]
    ) -> Dict:
        return {
            "text": text.strip(),
            "topic": topic,
            "confidence": confidence,
            "suggestions": suggestions[:4],
            "timestamp": datetime.now().isoformat()
        }

    def _detect_topic(self, message: str, history: List[Dict]) -> str:
        lower = message.lower()
        scores = {name: 0 for name in self.topic_config}

        for topic, config in self.topic_config.items():
            for keyword in config["keywords"]:
                if re.search(rf"\b{re.escape(keyword)}\b", lower):
                    scores[topic] += 2
                elif keyword in lower:
                    scores[topic] += 1

        best = max(scores, key=scores.get) if scores else "general"
        if scores.get(best, 0) > 0:
            return best

        if history:
            recent = history[-1].get("topic")
            if recent in self.topic_config:
                return recent

        return "general"

    def _detect_intent(self, message: str) -> str:
        lower = message.lower()

        if re.search(r"\b(bonjour|salut|hello|hey|coucou)\b", lower):
            return "greeting"
        if re.search(r"\b(merci|thanks|thank you)\b", lower):
            return "thanks"
        if re.search(r"\b(au revoir|bye|à bientôt)\b", lower):
            return "goodbye"
        if any(
            term in lower
            for term in [
                "corrige", "bug", "erreur", "ça ne marche",
                "ne marche pas", "debug", "problème", "exception"
            ]
        ):
            return "debug"
        if any(
            term in lower
            for term in ["différence", "compare", "comparaison", " vs ", "versus"]
        ):
            return "compare"
        if any(
            term in lower
            for term in ["code", "exemple", "snippet", "montre-moi", "montre moi"]
        ):
            return "code"
        if any(
            term in lower
            for term in [
                "étape", "étapes", "comment faire", "comment créer",
                "guide-moi", "guide moi", "comment utiliser"
            ]
        ):
            return "howto"
        if "?" in lower or re.search(
            r"\b(comment|pourquoi|quoi|qu'est-ce|quel|quelle|quand|où|combien|est-ce que)\b",
            lower
        ):
            return "question"
        if any(
            term in lower for term in ["explique", "définition", "c'est quoi", "signifie"]
        ):
            return "explain"

        return "conversation"

    def _compose_response(
        self,
        message: str,
        topic: str,
        intent: str,
        context: Optional[str],
        history: List[Dict]
    ):
        lower = message.lower()

        if intent == "greeting":
            return (
                "Bonjour 👋\n\n"
                "Je suis votre assistant IA pédagogique. Je peux expliquer un concept, "
                "analyser une erreur, écrire un exemple de code ou vous guider étape par étape.\n\n"
                "Dites-moi simplement ce que vous essayez de faire.",
                0.99,
                ["Explique-moi useState", "Aide-moi avec Express", "Analyse mon erreur"]
            )

        if intent == "thanks":
            return (
                "Avec plaisir 😊\n\n"
                "Vous pouvez continuer avec une question plus précise, un extrait de code "
                "ou une erreur : je garderai le contexte de notre échange.",
                0.99,
                ["Donne-moi un exemple", "Propose-moi un exercice", "Explique un concept avancé"]
            )

        if intent == "goodbye":
            return (
                "À bientôt 👋\n\n"
                "Bon apprentissage ! Nous pourrons reprendre la conversation là où nous nous sommes arrêtés.",
                0.99,
                ["Reprendre mon apprentissage", "Faire un exercice", "Poser une autre question"]
            )

        if topic == "react":
            return self._react_response(message, intent, history)
        if topic == "express":
            return self._express_response(message, intent, history)
        if topic == "javascript":
            return self._javascript_response(message, intent)
        if topic == "python":
            return self._python_response(message, intent)
        if topic == "database":
            return self._database_response(message, intent)
        if topic == "web":
            return self._web_response(message, intent)

        if history and any(
            x in lower for x in ["et ", "aussi", "encore", "celui-là", "celle-là", "ça", "ce sujet"]
        ):
            previous = history[-1].get("topic", "ce sujet")
            return (
                f"Oui, on peut continuer sur **{self.topic_config.get(previous, {}).get('label', previous)}**.\n\n"
                "Précisez ce que vous voulez approfondir et je m'appuierai sur votre message précédent "
                "au lieu de repartir de zéro.",
                0.88,
                ["Donne-moi un exemple", "Explique plus simplement", "Passe au niveau avancé"]
            )

        if context:
            return (
                "Je comprends votre demande.\n\n"
                f"Contexte reçu : {context}\n\n"
                "Pour éviter une réponse générique, donnez-moi l'objectif exact ou l'erreur que vous rencontrez. "
                "Je pourrai ensuite vous proposer une solution ciblée.",
                0.82,
                ["Explique-moi avec un exemple", "Analyse mon erreur", "Donne-moi les étapes"]
            )

        return (
            "Je peux vous aider sur la programmation, les études et le développement web.\n\n"
            "Décrivez votre objectif, votre code ou votre problème. Plus vous donnez de contexte, "
            "plus ma réponse sera précise.",
            0.84,
            ["Analyser mon code", "Expliquer un concept", "Créer un exemple"]
        )

    def _react_response(self, message: str, intent: str, history: List[Dict]):
        lower = message.lower()

        if "usestate" in lower:
            return (
                "### useState en React\n\n"
                "useState permet à un composant de conserver une donnée entre ses rendus et de déclencher "
                "un nouveau rendu lorsque cette donnée change.\n\n"
                "~~~jsx\n"
                "import { useState } from 'react';\n\n"
                "function Counter() {\n"
                "  const [count, setCount] = useState(0);\n\n"
                "  return (\n"
                "    <button onClick={() => setCount(prev => prev + 1)}>\n"
                "      {count}\n"
                "    </button>\n"
                "  );\n"
                "}\n"
                "~~~\n\n"
                "À retenir : count est la valeur actuelle et setCount est la fonction de mise à jour. "
                "Quand la nouvelle valeur dépend de l'ancienne, utilisez la forme setCount(prev => ...).",
                0.99,
                ["Explique useEffect", "useState vs props", "Créer un formulaire React"]
            )

        if "useeffect" in lower or "effet" in lower:
            return (
                "### useEffect\n\n"
                "useEffect sert à exécuter une logique après le rendu, par exemple un appel API, "
                "un abonnement ou une synchronisation avec une source externe.\n\n"
                "~~~jsx\n"
                "useEffect(() => {\n"
                "  fetch('/api/users')\n"
                "    .then(res => res.json())\n"
                "    .then(data => setUsers(data));\n"
                "}, []);\n"
                "~~~\n\n"
                "Avec [] l'effet est lancé après le premier rendu. Avec [userId], il est relancé lorsque "
                "userId change. Pour un effet avec abonnement, pensez à retourner une fonction de nettoyage.",
                0.99,
                ["useEffect avec cleanup", "useEffect et appels API", "useEffect vs useMemo"]
            )

        if "props" in lower:
            return (
                "### Props et State\n\n"
                "**Props** : données reçues par un composant depuis son parent. Elles sont en lecture seule.\n\n"
                "**State** : données internes que le composant peut modifier et qui influencent son affichage.\n\n"
                "~~~jsx\n"
                "function Welcome({ name }) {\n"
                "  return <h2>Bonjour {name}</h2>;\n"
                "}\n\n"
                "<Welcome name=\"Djamaldine\" />\n"
                "~~~\n\n"
                "Un bon réflexe : utilisez les props pour transmettre des informations et le state pour gérer "
                "une donnée qui évolue dans le composant.",
                0.98,
                ["Props vs Context", "Comment partager un state ?", "Explique les composants"]
            )

        if intent == "debug":
            return (
                "### Diagnostic React\n\n"
                "Pour trouver rapidement un bug React, vérifiez dans cet ordre :\n"
                "1. l'erreur exacte dans la console du navigateur ;\n"
                "2. les props réellement reçues ;\n"
                "3. les changements de state ;\n"
                "4. les dépendances des hooks ;\n"
                "5. la réponse de l'API si le composant charge des données.\n\n"
                "Collez l'erreur et le composant concerné : je pourrai identifier la cause probable et proposer la correction.",
                0.95,
                ["Analyser mon erreur React", "Bug useEffect", "Bug API React"]
            )

        return (
            "### React\n\n"
            "Je peux vous aider sur JSX, composants, props, state, hooks, formulaires, appels API, "
            "performances et architecture.\n\n"
            "Indiquez le concept ou le problème précis et je vous donnerai une explication progressive "
            "avec un exemple concret.",
            0.94,
            ["Explique useState", "Explique useEffect", "React + API REST"]
        )

    def _express_response(self, message: str, intent: str, history: List[Dict]):
        lower = message.lower()

        if "middleware" in lower:
            return (
                "### Middleware Express\n\n"
                "Un middleware intercepte une requête avant la route finale. Il peut vérifier l'authentification, "
                "valider les données, journaliser la requête ou gérer une erreur.\n\n"
                "~~~js\n"
                "app.use((req, res, next) => {\n"
                "  console.log(req.method, req.url);\n"
                "  next();\n"
                "});\n"
                "~~~\n\n"
                "Le point essentiel est next(). Si vous ne l'appelez pas et que vous n'envoyez pas de réponse, "
                "la requête reste bloquée.",
                0.99,
                ["Middleware JWT", "Créer une API Express", "Gestion des erreurs"]
            )

        if "route" in lower or "api" in lower or "rest" in lower:
            return (
                "### Route Express / API REST\n\n"
                "Une route relie une méthode HTTP et une URL à une logique serveur.\n\n"
                "~~~js\n"
                "app.get('/api/users/:id', async (req, res, next) => {\n"
                "  try {\n"
                "    const user = await getUser(req.params.id);\n"
                "    res.json(user);\n"
                "  } catch (error) {\n"
                "    next(error);\n"
                "  }\n"
                "});\n"
                "~~~\n\n"
                "GET sert généralement à lire, POST à créer, PUT/PATCH à modifier et DELETE à supprimer. "
                "Une API fiable valide les entrées et renvoie des codes HTTP cohérents.",
                0.98,
                ["GET vs POST", "Créer une route POST", "Sécuriser avec JWT"]
            )

        if "cors" in lower:
            return (
                "### CORS\n\n"
                "CORS contrôle les origines autorisées à appeler votre serveur depuis un navigateur. "
                "En production, définissez les domaines autorisés plutôt que d'ouvrir inutilement l'API.\n\n"
                "~~~js\n"
                "app.use(cors({\n"
                "  origin: ['https://mon-site.vercel.app']\n"
                "}));\n"
                "~~~\n\n"
                "Le fait d'avoir le frontend et le backend sur deux domaines différents est normal : "
                "CORS permet justement de contrôler cette communication.",
                0.98,
                ["Configurer CORS en production", "CORS avec JWT", "Résoudre une erreur CORS"]
            )

        if intent == "debug":
            return (
                "### Diagnostic Express\n\n"
                "Pour une erreur backend, regardez d'abord le statut HTTP, le message exact dans les logs Render, "
                "la route appelée, les variables d'environnement et la connexion à la base de données.\n\n"
                "Envoyez-moi l'URL de la route, le statut HTTP et le message d'erreur : je pourrai isoler la cause.",
                0.96,
                ["Erreur 500 Express", "Erreur de base de données", "Erreur JWT"]
            )

        return (
            "### Express.js / Node.js\n\n"
            "Je peux vous aider avec les routes, middleware, JWT, validation, CORS, fichiers, "
            "connexion SQL et architecture d'API.\n\n"
            "Décrivez ce que vous construisez ou collez l'erreur exacte pour une réponse ciblée.",
            0.94,
            ["Créer une API REST", "Expliquer middleware", "JWT avec Express"]
        )

    def _javascript_response(self, message: str, intent: str):
        lower = message.lower()

        if "async" in lower or "await" in lower or "promise" in lower:
            return (
                "### async / await\n\n"
                "async transforme une fonction en fonction qui retourne une Promise. await permet d'attendre "
                "son résultat tout en gardant une lecture proche du code synchrone.\n\n"
                "~~~js\n"
                "async function loadUser() {\n"
                "  try {\n"
                "    const res = await fetch('/api/user');\n"
                "    if (!res.ok) throw new Error('Erreur HTTP');\n"
                "    return await res.json();\n"
                "  } catch (error) {\n"
                "    console.error(error);\n"
                "  }\n"
                "}\n"
                "~~~\n\n"
                "Avec fetch, pensez à vérifier res.ok : une réponse HTTP 404 ou 500 ne déclenche pas automatiquement catch.",
                0.99,
                ["Promise.all()", "fetch vs axios", "Gérer une erreur async"]
            )

        if "array" in lower or "tableau" in lower:
            return (
                "### Tableaux JavaScript\n\n"
                "map transforme les éléments, filter sélectionne, find cherche un élément et reduce "
                "calcule une valeur cumulée.\n\n"
                "~~~js\n"
                "const prices = [10, 20, 30];\n"
                "const doubled = prices.map(price => price * 2);\n"
                "const expensive = prices.filter(price => price >= 20);\n"
                "~~~",
                0.98,
                ["map vs forEach", "filter vs find", "Exercice JavaScript"]
            )

        return (
            "### JavaScript\n\n"
            "Je peux vous aider sur les fonctions, objets, tableaux, DOM, événements, Promises, "
            "async/await, fetch, modules et bonnes pratiques modernes.",
            0.93,
            ["Explique async/await", "map/filter/reduce", "Créer une fonction JavaScript"]
        )

    def _python_response(self, message: str, intent: str):
        lower = message.lower()

        if "fastapi" in lower:
            return (
                "### FastAPI\n\n"
                "FastAPI permet de créer des API Python avec validation des données, documentation automatique "
                "et prise en charge de l'asynchrone.\n\n"
                "~~~python\n"
                "from fastapi import FastAPI\n\n"
                "app = FastAPI()\n\n"
                "@app.get('/api/health')\n"
                "async def health():\n"
                "    return {'status': 'ok'}\n"
                "~~~\n\n"
                "En production, pensez aux exceptions, à CORS, aux variables d'environnement et aux logs.",
                0.98,
                ["Créer une route POST", "FastAPI + MySQL", "CORS FastAPI"]
            )

        return (
            "### Python\n\n"
            "Je peux vous aider avec les listes, dictionnaires, classes, fonctions, async, FastAPI "
            "et l'organisation d'un projet Python.",
            0.92,
            ["Créer une API FastAPI", "Listes vs dictionnaires", "Python async"]
        )

    def _database_response(self, message: str, intent: str):
        return (
            "### Base de données\n\n"
            "Pour diagnostiquer un problème, il faut séparer trois éléments : le schéma, la requête et la connexion.\n\n"
            "Envoyez-moi le moteur utilisé (MySQL, PostgreSQL, MongoDB...), la requête concernée et l'erreur exacte. "
            "Je pourrai alors déterminer si le problème vient du modèle, de la requête, des permissions ou de la connexion.",
            0.95,
            ["Corriger une requête SQL", "MySQL avec Node.js", "Erreur de connexion DB"]
        )

    def _web_response(self, message: str, intent: str):
        return (
            "### Développement web\n\n"
            "Je peux vous aider sur HTML, CSS, JavaScript, frontend/backend, HTTP, responsive design, "
            "déploiement et communication avec une API.\n\n"
            "Donnez-moi votre objectif et votre stack technique : je proposerai une solution adaptée plutôt qu'une réponse générique.",
            0.93,
            ["Frontend vs backend", "Comprendre HTTP", "Connecter frontend et API"]
        )

    async def check_answer(self, question: str, answer: str, context: Optional[str] = None) -> Dict:
        text = (answer or "").strip()
        if not text:
            return {
                "status": "incorrect",
                "confidence": 0.98,
                "feedback": "La réponse est vide. Essayez d'expliquer votre raisonnement, même brièvement.",
                "hint": "Commencez par définir le concept ou donner la première étape.",
                "next_step": "Écrivez une réponse de 2 à 4 phrases.",
                "score": 0.0,
                "improvements": ["Ajouter une explication", "Donner un exemple"]
            }

        if len(text.split()) < 8:
            return {
                "status": "partially_correct",
                "confidence": 0.72,
                "feedback": "Votre idée peut être pertinente, mais la réponse manque de contexte pour être évaluée précisément.",
                "hint": "Expliquez pourquoi votre réponse est correcte et ajoutez un exemple.",
                "next_step": "Développez votre raisonnement en quelques phrases.",
                "score": 0.5,
                "improvements": ["Préciser le concept", "Ajouter un exemple"]
            }

        return {
            "status": "partially_correct",
            "confidence": 0.63,
            "feedback": "Votre réponse contient des éléments pertinents. Pour une vérification fiable, comparez-la aux notions clés demandées dans la question.",
            "hint": "Identifiez la définition, le mécanisme et, si possible, un exemple.",
            "next_step": "Reformulez votre réponse en justifiant votre raisonnement.",
            "score": 0.65,
            "improvements": ["Justifier la réponse", "Ajouter un exemple concret"]
        }

    async def get_suggestions(self, topic: str) -> Dict:
        topic = (topic or "general").lower()
        suggestions = {
            "react": [
                "Comment fonctionne useState ?",
                "Quelle est la différence entre props et state ?",
                "Quand utiliser useEffect ?"
            ],
            "express": [
                "Comment créer une route Express ?",
                "À quoi sert un middleware ?",
                "Comment sécuriser une API avec JWT ?"
            ],
            "javascript": [
                "Comment fonctionne async/await ?",
                "Quelle différence entre map et filter ?",
                "Comment gérer une erreur avec fetch ?"
            ],
            "python": [
                "Comment créer une API FastAPI ?",
                "Liste ou dictionnaire : quelle différence ?",
                "Comment organiser un projet Python ?"
            ],
            "database": [
                "Comment écrire une requête SELECT ?",
                "Comment connecter MySQL à Node.js ?",
                "Comment diagnostiquer une erreur SQL ?"
            ],
            "web": [
                "Comment fonctionne HTTP ?",
                "Comment rendre une interface responsive ?",
                "Frontend et backend : quelle différence ?"
            ],
            "general": [
                "Explique-moi un concept de programmation",
                "Analyse mon erreur",
                "Donne-moi un exemple de code"
            ]
        }

        return {
            "topic": topic,
            "suggestions": suggestions.get(topic, suggestions["general"]),
            "resources": [],
            "related_topics": ["react", "javascript", "express"]
        }

    async def health_check(self) -> Dict:
        return {
            "status": "healthy",
            "active_conversations": len(self.conversation_history),
            "knowledge_base_loaded": bool(self.topic_config)
        }

    async def get_metrics(self) -> Dict:
        average = (
            sum(self.metrics["response_times"]) / len(self.metrics["response_times"])
            if self.metrics["response_times"] else 0
        )
        return {
            **self.metrics,
            "average_response_time": round(average, 4),
            "success_rate": (
                self.metrics["successful_responses"] / self.metrics["total_requests"]
                if self.metrics["total_requests"] else 0
            )
        }
