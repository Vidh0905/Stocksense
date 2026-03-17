from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import yfinance as yf
import requests
import os

# Import routers
from routers import predict, sentiment

app = FastAPI(title="StockSense ML Service", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(predict.router, prefix="/predict", tags=["prediction"])
app.include_router(sentiment.router, prefix="/sentiment", tags=["sentiment"])

@app.get("/")
async def root():
    return {"message": "StockSense ML Service"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)