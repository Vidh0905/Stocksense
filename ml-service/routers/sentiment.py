from fastapi import APIRouter
import numpy as np
import re

router = APIRouter()

# Mock sentiment words for fallback
POSITIVE_WORDS = [
    'surge', 'growth', 'profit', 'bullish', 'gain', 'rise', 'jump', 'boost',
    'increase', 'climb', 'soar', 'advance', 'rally', 'up', 'positive', 'strong',
    'excellent', 'outperform', 'beat', 'exceed', 'success', 'win', 'breakthrough'
]

NEGATIVE_WORDS = [
    'crash', 'loss', 'decline', 'bearish', 'drop', 'fall', 'plunge', 'slump',
    'decrease', 'sink', 'tumble', 'retreat', 'down', 'negative', 'weak',
    'disappoint', 'miss', 'fail', 'lose', 'trouble', 'problem', 'concern'
]

def simple_sentiment_analysis(text):
    """Simple keyword-based sentiment analysis"""
    if not isinstance(text, str):
        text = str(text)

    text_lower = text.lower()
    positive_count = sum(1 for word in POSITIVE_WORDS if word in text_lower)
    negative_count = sum(1 for word in NEGATIVE_WORDS if word in text_lower)

    # Calculate sentiment score (-1 to 1)
    if positive_count + negative_count == 0:
        return 0

    sentiment_score = (positive_count - negative_count) / (positive_count + negative_count)
    return sentiment_score

@router.post("/analyze")
async def analyze_sentiment(payload: dict):
    """Analyze sentiment of text"""
    text = payload.get("text", "")

    if not text:
        return {
            "sentiment": 0,
            "confidence": 0
        }

    try:
        # Try to use transformers library for FinBERT
        from transformers import AutoTokenizer, AutoModelForSequenceClassification
        import torch

        tokenizer = AutoTokenizer.from_pretrained("ProsusAI/finbert")
        model = AutoModelForSequenceClassification.from_pretrained("ProsusAI/finbert")

        inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=512)
        outputs = model(**inputs)
        predictions = torch.nn.functional.softmax(outputs.logits, dim=-1)

        # Extract sentiment scores (positive, negative, neutral)
        positive_score = predictions[0][0].item()
        negative_score = predictions[0][1].item()
        neutral_score = predictions[0][2].item()

        # Convert to single sentiment score (-1 to 1)
        sentiment_score = positive_score - negative_score
        confidence = max(positive_score, negative_score, neutral_score)

        return {
            "sentiment": round(sentiment_score, 4),
            "confidence": round(confidence, 4)
        }
    except Exception as e:
        print(f"FinBERT error, using fallback method: {e}")
        # Fallback to simple keyword analysis
        sentiment_score = simple_sentiment_analysis(text)
        confidence = 0.7  # Fixed confidence for fallback

        return {
            "sentiment": round(sentiment_score, 4),
            "confidence": round(confidence, 4)
        }

@router.post("/aggregate")
async def aggregate_sentiment(payload: dict):
    """Aggregate sentiment from multiple texts"""
    texts = payload.get("texts", [])

    if not texts:
        return {
            "sentiment": 0,
            "confidence": 0
        }

    sentiments = []
    confidences = []

    for text in texts:
        result = await analyze_sentiment({"text": text})
        sentiments.append(result["sentiment"])
        confidences.append(result["confidence"])

    if not sentiments:
        return {
            "sentiment": 0,
            "confidence": 0
        }

    # Weighted average
    weighted_sum = sum(s * c for s, c in zip(sentiments, confidences))
    total_confidence = sum(confidences)

    if total_confidence == 0:
        avg_sentiment = 0
        avg_confidence = 0
    else:
        avg_sentiment = weighted_sum / total_confidence
        avg_confidence = total_confidence / len(confidences)

    return {
        "sentiment": round(avg_sentiment, 4),
        "confidence": round(avg_confidence, 4)
    }