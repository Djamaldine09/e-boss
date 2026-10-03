import asyncio
import json
import re
from datetime import datetime
from typing import Dict, List, Optional
import numpy as np
import pandas as pd

class FakeNewsDetector:
    def __init__(self):
        self.suspicious_keywords = [
            "gratuit", "miracle", "garanti", "immédiat", "secret", "révolutionnaire",
            "100%", "jamais vu", "incroyable", "étonnant", "choc", "alerte",
            "urgent", "dernière chance", "offre limitée", "fraude", "arnaque"
        ]
        
        self.reliable_sources = [
            "lemonde.fr", "figaro.fr", "liberation.fr", "france24.com",
            "rfi.fr", "inserm.fr", "education.gouv.fr", "who.int"
        ]
        
        self.unreliable_patterns = [
            r".*\.com$",
            r".*\.net$",
            r".*\.org$",
            r".*fake.*",
            r".*hoax.*",
            r".*buzz.*"
        ]
        
        self.metrics = {
            "total_analyzed": 0,
            "fake_detected": 0,
            "suspicious_detected": 0,
            "reliable_detected": 0,
            "analysis_times": []
        }
    
    async def analyze_content(self, content: str, source: Optional[str] = None, metadata: Optional[Dict] = None) -> Dict:
        """Analyse un contenu pour détecter les fake news"""
        start_time = datetime.now()
        
        try:
            self.metrics["total_analyzed"] += 1
            
            # Analyse du contenu
            content_analysis = self._analyze_text(content)
            
            # Analyse de la source
            source_analysis = self._analyze_source(source) if source else {"reliability": "unknown"}
            
            # Calcul du score global
            risk_score = self._calculate_risk_score(content_analysis, source_analysis)
            
            # Détermination du statut
            status = self._determine_status(risk_score)
            
            # Génération des recommandations
            recommendations = self._generate_recommendations(content_analysis, source_analysis, risk_score)
            
            # Mise à jour des métriques
            if status == "fake":
                self.metrics["fake_detected"] += 1
            elif status == "suspicious":
                self.metrics["suspicious_detected"] += 1
            elif status == "reliable":
                self.metrics["reliable_detected"] += 1
            
            analysis_time = (datetime.now() - start_time).total_seconds()
            self.metrics["analysis_times"].append(analysis_time)
            
            return {
                "status": status,
                "risk_score": risk_score,
                "confidence": min(0.95, 0.5 + abs(risk_score - 0.5)),
                "content_analysis": content_analysis,
                "source_analysis": source_analysis,
                "recommendations": recommendations,
                "keywords_found": content_analysis["suspicious_keywords"],
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            return {
                "status": "error",
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }
    
    def _analyze_text(self, content: str) -> Dict:
        """Analyse le texte du contenu"""
        content_lower = content.lower()
        
        # Recherche de mots-clés suspects
        found_keywords = [kw for kw in self.suspicious_keywords if kw in content_lower]
        
        # Analyse des caractéristiques du texte
        text_features = {
            "length": len(content),
            "exclamation_count": content.count("!"),
            "question_count": content.count("?"),
            "uppercase_ratio": sum(1 for c in content if c.isupper()) / len(content) if content else 0,
            "suspicious_keywords": found_keywords,
            "keyword_density": len(found_keywords) / len(content.split()) if content else 0
        }
        
        # Détection de patterns suspects
        suspicious_patterns = [
            r"!\s*!",
            r"\?\s*\?",
            r"[A-Z]{3,}",
            r"\.{3,}",
            r"\$+\s*\d+"
        ]
        
        pattern_matches = []
        for pattern in suspicious_patterns:
            matches = re.findall(pattern, content)
            if matches:
                pattern_matches.append({"pattern": pattern, "count": len(matches)})
        
        # Calcul du score de suspicion du texte
        suspicion_score = (
            text_features["keyword_density"] * 0.3 +
            text_features["exclamation_count"] * 0.1 +
            text_features["uppercase_ratio"] * 0.2 +
            len(pattern_matches) * 0.15
        )
        
        return {
            **text_features,
            "pattern_matches": pattern_matches,
            "suspicion_score": min(1.0, suspicion_score),
            "readability_score": self._calculate_readability(content)
        }
    
    def _analyze_source(self, source: str) -> Dict:
        """Analyse la fiabilité de la source"""
        if not source:
            return {"reliability": "unknown", "reason": "Source non spécifiée"}
        
        source_lower = source.lower()
        
        # Vérification des sources fiables
        for reliable in self.reliable_sources:
            if reliable in source_lower:
                return {
                    "reliability": "high",
                    "trust_score": 0.9,
                    "reason": f"Source reconnue comme fiable: {reliable}"
                }
        
        # Vérification des patterns suspects
        for pattern in self.unreliable_patterns:
            if re.match(pattern, source_lower):
                return {
                    "reliability": "low",
                    "trust_score": 0.2,
                    "reason": f"Pattern suspect détecté: {pattern}"
                }
        
        # Analyse par défaut
        domain_indicators = self._analyze_domain(source)
        
        return {
            "reliability": "medium",
            "trust_score": 0.5,
            "domain_analysis": domain_indicators,
            "reason": "Source non vérifiée"
        }
    
    def _analyze_domain(self, source: str) -> Dict:
        """Analyse les caractéristiques du domaine"""
        try:
            # Extraction du domaine
            domain = source.split("//")[-1].split("/")[0] if "//" in source else source.split("/")[0]
            
            indicators = {
                "has_https": source.startswith("https://"),
                "domain_length": len(domain),
                "has_numbers": bool(re.search(r'\d', domain)),
                "has_subdomains": domain.count(".") > 1,
                "suspicious_tld": domain.endswith((".info", ".biz", ".click", ".xyz"))
            }
            
            return indicators
        except:
            return {"error": "Impossible d'analyser le domaine"}
    
    def _calculate_risk_score(self, content_analysis: Dict, source_analysis: Dict) -> float:
        """Calcule le score de risque global"""
        content_weight = 0.6
        source_weight = 0.4
        
        # Score de contenu (plus élevé = plus suspect)
        content_risk = content_analysis.get("suspicion_score", 0)
        
        # Score de source (plus élevé = plus suspect)
        source_trust = source_analysis.get("trust_score", 0.5)
        source_risk = 1 - source_trust
        
        # Score combiné
        total_risk = (content_risk * content_weight) + (source_risk * source_weight)
        
        return min(1.0, max(0.0, total_risk))
    
    def _determine_status(self, risk_score: float) -> str:
        """Détermine le statut basé sur le score de risque"""
        if risk_score >= 0.8:
            return "fake"
        elif risk_score >= 0.6:
            return "suspicious"
        elif risk_score >= 0.3:
            return "questionable"
        else:
            return "reliable"
    
    def _generate_recommendations(self, content_analysis: Dict, source_analysis: Dict, risk_score: float) -> List[str]:
        """Génère des recommandations"""
        recommendations = []
        
        if risk_score >= 0.8:
            recommendations.extend([
                "Contenu très suspect - Vérification urgente requise",
                "Signaler immédiatement aux administrateurs",
                "Bloquer la source si possible"
            ])
        elif risk_score >= 0.6:
            recommendations.extend([
                "Contenu suspect - Investigation nécessaire",
                "Vérifier les faits mentionnés",
                "Consulter des sources fiables"
            ])
        elif risk_score >= 0.3:
            recommendations.extend([
                "Contenu à vérifier",
                "Croiser avec d'autres sources",
                "Mettre en surveillance"
            ])
        else:
            recommendations.extend([
                "Contenu apparemment fiable",
                "Continuer la surveillance habituelle"
            ])
        
        # Recommandations spécifiques basées sur l'analyse
        if content_analysis.get("suspicious_keywords"):
            recommendations.append(f"Mots-clés suspects détectés: {', '.join(content_analysis['suspicious_keywords'][:3])}")
        
        if source_analysis.get("reliability") == "low":
            recommendations.append("La source n'est pas fiable - Vérification externe requise")
        
        return recommendations
    
    def _calculate_readability(self, content: str) -> float:
        """Calcule un score de lisibilité simplifié"""
        if not content:
            return 0.0
        
        words = content.split()
        sentences = content.split(".")
        
        if not sentences:
            return 0.0
        
        avg_words_per_sentence = len(words) / len(sentences)
        
        # Score simplifié (plus élevé = plus lisible)
        readability = max(0, 1 - (avg_words_per_sentence - 15) / 30)
        
        return min(1.0, readability)
    
    async def get_statistics(self) -> Dict:
        """Obtient les statistiques de détection"""
        total = self.metrics["total_analyzed"]
        
        if total == 0:
            return {
                "total_analyzed": 0,
                "fake_rate": 0,
                "suspicious_rate": 0,
                "reliable_rate": 0,
                "average_analysis_time": 0
            }
        
        avg_analysis_time = sum(self.metrics["analysis_times"]) / len(self.metrics["analysis_times"]) if self.metrics["analysis_times"] else 0
        
        return {
            "total_analyzed": total,
            "fake_detected": self.metrics["fake_detected"],
            "suspicious_detected": self.metrics["suspicious_detected"],
            "reliable_detected": self.metrics["reliable_detected"],
            "fake_rate": self.metrics["fake_detected"] / total,
            "suspicious_rate": self.metrics["suspicious_detected"] / total,
            "reliable_rate": self.metrics["reliable_detected"] / total,
            "average_analysis_time": avg_analysis_time
        }
    
    async def health_check(self) -> Dict:
        """Vérification de santé"""
        return {
            "status": "healthy",
            "keywords_loaded": len(self.suspicious_keywords) > 0,
            "reliable_sources_loaded": len(self.reliable_sources) > 0,
            "total_analyzed": self.metrics["total_analyzed"]
        }
    
    async def get_metrics(self) -> Dict:
        """Obtient les métriques"""
        return await self.get_statistics()
