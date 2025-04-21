from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os

from app.api import documents, auth, vector_search

# Create FastAPI app
app = FastAPI(
    title="Generative AI Document Processor",
    description="API for processing documents using generative AI",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(documents.router)
app.include_router(auth.router)
app.include_router(vector_search.router)

@app.get("/")
async def root():
    return {"message": "Welcome to the Generative AI Document Processing API"}

# Run the application
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
