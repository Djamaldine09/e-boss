import io
from PIL import Image
import numpy as np
from typing import Dict, List

class ContentModerator:
    """Modération prudente des images.

    Cette implémentation utilise des heuristiques simples et ne doit pas
    transformer la couleur de peau, le format ou la résolution d'une image
    en preuve de nudité.
    """

    def __init__(self):
        self.nudity_threshold = 0.85
        self.violence_threshold = 0.8

    async def analyze_image(self, image_data: bytes) -> Dict:
        try:
            image = Image.open(io.BytesIO(image_data)).convert("RGB")
            return await self._analyze_image(image)
        except Exception as e:
            return {
                "safe": False,
                "error": f"Erreur lors de l'analyse: {str(e)}",
                "recommendation": "reject"
            }

    async def _analyze_image(self, image: Image.Image) -> Dict:
        pixels = np.asarray(image)

        skin_ratio = self._calculate_skin_ratio(pixels)
        large_skin_ratio = self._detect_large_skin_areas(pixels)

        # Ces métriques seules ne suffisent pas à conclure à la nudité.
        # Elles servent uniquement à signaler une image nécessitant une
        # vérification plus poussée. Les dimensions, la luminosité et le
        # contraste ne sont volontairement plus utilisés.
        nudity_score = min(
            1.0,
            (skin_ratio * 0.55) + (large_skin_ratio * 0.45)
        )

        # Une image n'est bloquée que lorsque les deux indicateurs sont
        # exceptionnellement élevés. Aucun aléatoire n'est utilisé afin que
        # la même image donne toujours le même résultat.
        is_likely_nude = (
            skin_ratio >= 0.55 and
            large_skin_ratio >= 0.70
        )

        violence_score = 0.0

        if is_likely_nude:
            reason = (
                f"Contenu potentiellement inapproprié - "
                f"forte présence de zones de peau (score: {nudity_score:.2f})"
            )
            recommendation = "reject"
            safe = False
        else:
            reason = "Image appropriée"
            recommendation = "approve"
            safe = True

        return {
            "safe": safe,
            "nudity_score": round(nudity_score, 2),
            "violence_score": violence_score,
            "adult_content": is_likely_nude,
            "reason": reason,
            "recommendation": recommendation
        }

    def _calculate_skin_ratio(self, pixels: np.ndarray) -> float:
        # Détection approximative de couleurs proches de la peau.
        # Ce ratio ne constitue pas une détection de nudité.
        r = pixels[:, :, 0].astype(np.int16)
        g = pixels[:, :, 1].astype(np.int16)
        b = pixels[:, :, 2].astype(np.int16)

        skin_mask = (
            (r > 95) &
            (g > 40) &
            (b > 20) &
            (r > g) &
            (r > b) &
            ((r - g) > 10)
        )

        return float(np.mean(skin_mask))

    def _detect_large_skin_areas(self, pixels: np.ndarray) -> float:
        skin_ratio = self._calculate_skin_ratio(pixels)

        # Approximation conservatrice : une grande zone n'est considérée
        # comme significative que lorsque la proportion globale de pixels
        # proches de la peau est déjà élevée.
        if skin_ratio < 0.35:
            return 0.0

        return min(1.0, skin_ratio / 0.70)

    async def batch_analyze(self, images_data: List[bytes]) -> List[Dict]:
        results = []
        for image_data in images_data:
            results.append(await self.analyze_image(image_data))
        return results

    def get_moderation_stats(self) -> Dict:
        return {
            "total_analyzed": 0,
            "blocked_images": 0,
            "approved_images": 0,
            "average_nudity_score": 0.0,
            "average_violence_score": 0.0
        }
