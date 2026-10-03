# Educational Platform AI API
# This package contains all AI services for the educational platform

__version__ = "1.0.0"
__author__ = "Educational Platform Team"

from .chatbot import ChatbotAI
from .fake_news_detector import FakeNewsDetector
from .message_analyzer import MessageAnalyzer
from .dashboard_automation import DashboardAutomation

__all__ = [
    "ChatbotAI",
    "FakeNewsDetector", 
    "MessageAnalyzer",
    "DashboardAutomation"
]
