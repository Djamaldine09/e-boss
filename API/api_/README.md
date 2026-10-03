# Educational Platform AI API

API Python avec FastAPI pour les services IA de la plateforme éducative.

## Installation

1. Installez les dépendances :
```bash
pip install -r requirements.txt
```

2. Lancez le serveur :
```bash
python main.py
```

L'API sera disponible sur `http://localhost:5000`

## Services IA

### 1. Chatbot IA
- Chatbot éducatif pour répondre aux questions
- Tutor IA pour vérifier les réponses des étudiants
- Suggestions de ressources et sujets

### 2. Détection de Fake News
- Analyse de contenu pour détecter les fausses informations
- Vérification de la fiabilité des sources
- Classification par niveau de risque

### 3. Analyse de Messages Éphémères
- Analyse des messages des étudiants
- Détection de priorité et sentiment
- File d'attente intelligente

### 4. Automatisation du Dashboard
- Génération d'insights automatiques
- Analytics en temps réel
- Actions d'automatisation personnalisées

## Endpoints

### Chatbot
- `POST /api/chatbot/chat` - Chat avec le bot
- `POST /api/chatbot/tutor` - Vérification de réponse
- `GET /api/chatbot/suggestions/{topic}` - Suggestions de ressources

### Fake News
- `POST /api/fake-news/detect` - Détection de fake news
- `POST /api/fake-news/batch-analyze` - Analyse batch
- `GET /api/fake-news/stats` - Statistiques

### Messages
- `POST /api/messages/analyze` - Analyse de message
- `GET /api/messages/priority-queue` - File d'attente prioritaire
- `POST /api/messages/mark-processed/{id}` - Marquer comme traité

### Dashboard
- `POST /api/dashboard/automate` - Action d'automatisation
- `GET /api/dashboard/insights` - Insights automatiques
- `GET /api/dashboard/analytics` - Analytics

### Monitoring
- `GET /api/health` - Vérification de santé
- `GET /api/metrics` - Métriques d'utilisation

## Configuration

Les services peuvent être configurés via les variables d'environnement ou directement dans le code.

## Développement

Pour ajouter de nouvelles fonctionnalités :
1. Créez une nouvelle classe de service
2. Ajoutez les endpoints correspondants dans `main.py`
3. Mettez à jour la documentation
