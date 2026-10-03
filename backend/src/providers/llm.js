const OpenAI = require('openai');
const axios = require('axios');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// HuggingFace fallback
const huggingFaceApi = axios.create({
  baseURL: 'https://api-inference.huggingface.co/models',
  headers: {
    'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
  },
});

/**
 * Generate tutor feedback with streaming
 */
async function generateTutorFeedback(params, onChunk) {
  const { question, answer, context } = params;
  
  try {
    // Try OpenAI first
    const stream = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `Tu es un tuteur pédagogique expert. Fournis des feedbacks constructifs sur les réponses des étudiants. Sois encourageant mais précis. ${context ? `Contexte: ${context}` : ''}`
        },
        {
          role: 'user',
          content: `Question: ${question}\n\nRéponse de l'étudiant: ${answer}\n\nFournis un feedback détaillé.`
        }
      ],
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        onChunk(content);
      }
    }
  } catch (error) {
    console.warn('OpenAI failed, trying HuggingFace fallback:', error.message);
    
    // Fallback to HuggingFace
    try {
      const response = await huggingFaceApi.post('microsoft/DialoGPT-medium', {
        inputs: `Question: ${question}\nAnswer: ${answer}\nFeedback:`,
        parameters: {
          max_length: 500,
          temperature: 0.7,
        },
      });
      
      const feedback = response.data[0]?.generated_text || 'Feedback unavailable';
      onChunk(feedback);
    } catch (fallbackError) {
      throw new Error('Both OpenAI and HuggingFace failed');
    }
  }
}

/**
 * Generate quiz questions
 */
async function generateQuizQuestions(params) {
  const { topic, difficulty, questionCount, language, mode = 'generate' } = params;
  
  if (mode === 'validation') {
    const { questions, answers } = params;
    return validateQuizAnswers(questions, answers);
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `Génère des questions de quiz sur le sujet demandé. Format JSON requis:
          {
            "questions": [
              {
                "question": "texte de la question",
                "options": ["option A", "option B", "option C", "option D"],
                "correct": 0,
                "explanation": "explication de la réponse"
              }
            ]
          }`
        },
        {
          role: 'user',
          content: `Sujet: ${topic}\nDifficulté: ${difficulty}\nNombre de questions: ${questionCount}\nLangue: ${language}`
        }
      ],
      temperature: 0.7,
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    throw new Error('Failed to generate quiz questions');
  }
}

/**
 * Validate quiz answers
 */
function validateQuizAnswers(questions, answers) {
  return questions.map((q, index) => ({
    question: q.question,
    userAnswer: answers[index],
    correct: q.correct === answers[index],
    explanation: q.explanation,
  }));
}

/**
 * Generate AI-powered planning
 */
async function generatePlanning(params) {
  const { 
    subject, 
    duration, 
    objectives, 
    level, 
    language, 
    preferences,
    existingPlanning,
    constraints,
    goals,
    mode = 'generate'
  } = params;

  try {
    const systemPrompt = mode === 'optimize' 
      ? `Optimise un plan d'étude existant en tenant compte des contraintes et objectifs. Format JSON requis.`
      : `Crée un plan d'étude détaillé. Format JSON requis:
      {
        "title": "Titre du plan",
        "duration": "durée totale",
        "sessions": [
          {
            "title": "titre de la session",
            "duration": "durée en minutes",
            "objectives": ["objectif 1", "objectif 2"],
            "activities": ["activité 1", "activité 2"],
            "resources": ["ressource 1", "ressource 2"]
          }
        ]
      }`;

    const userPrompt = mode === 'optimize'
      ? `Plan existant: ${JSON.stringify(existingPlanning)}\nContraintes: ${JSON.stringify(constraints)}\nObjectifs: ${JSON.stringify(goals)}`
      : `Sujet: ${subject}\nDurée: ${duration}\nObjectifs: ${objectives}\nNiveau: ${level}\nLangue: ${language}\nPréférences: ${JSON.stringify(preferences)}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    throw new Error('Failed to generate planning');
  }
}

module.exports = {
  generateTutorFeedback,
  generateQuizQuestions,
  generatePlanning,
};
