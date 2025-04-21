import os
from typing import List, Dict, Any, Optional
import PyPDF2
from docx import Document as DocxDocument
import pytesseract
from PIL import Image
import io
import re
import json
from transformers import pipeline

class DocumentProcessor:
    """
    Core service for processing documents using AI
    """
    def __init__(self, models_dir: str = "models"):
        self.models_dir = models_dir
        os.makedirs(models_dir, exist_ok=True)
        
        # Initialize AI pipelines
        self.summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
        self.ner = pipeline("ner", model="dbmdz/bert-large-cased-finetuned-conll03-english")
        self.classifier = pipeline("text-classification", model="distilbert-base-uncased-finetuned-sst-2-english")
        self.sentiment_analyzer = pipeline("sentiment-analysis")
        
        # Supported file types
        self.supported_types = {
            "application/pdf": self._process_pdf,
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": self._process_docx,
            "text/plain": self._process_txt,
            "image/jpeg": self._process_image,
            "image/png": self._process_image,
            "image/tiff": self._process_image
        }
    
    def process_document(self, file_path: str, content_type: str) -> Dict[str, Any]:
        """
        Process a document and extract information
        """
        if content_type not in self.supported_types:
            raise ValueError(f"Unsupported file type: {content_type}")
        
        # Extract text from document
        text = self.supported_types[content_type](file_path)
        
        # Process the text
        result = {
            "text": text[:1000] + "..." if len(text) > 1000 else text,  # Truncated text preview
            "word_count": len(text.split()),
            "character_count": len(text),
            "summary": self._generate_summary(text),
            "entities": self._extract_entities(text),
            "classification": self._classify_document(text),
            "sentiment": self._analyze_sentiment(text)
        }
        
        return result
    
    def _process_pdf(self, file_path: str) -> str:
        """Extract text from PDF"""
        text = ""
        with open(file_path, "rb") as f:
            pdf_reader = PyPDF2.PdfReader(f)
            for page_num in range(len(pdf_reader.pages)):
                page = pdf_reader.pages[page_num]
                text += page.extract_text() + "\n"
        
        # If PDF is scanned (text extraction yields little text), use OCR
        if len(text.strip()) < 100:
            return self._process_scanned_pdf(file_path)
        
        return text
    
    def _process_scanned_pdf(self, file_path: str) -> str:
        """Process scanned PDF using OCR"""
        # In a real implementation, this would convert PDF pages to images and use OCR
        # For this example, we'll return a placeholder
        return "This appears to be a scanned document. OCR processing would extract text here."
    
    def _process_docx(self, file_path: str) -> str:
        """Extract text from DOCX"""
        doc = DocxDocument(file_path)
        return "\n".join([paragraph.text for paragraph in doc.paragraphs])
    
    def _process_txt(self, file_path: str) -> str:
        """Extract text from TXT"""
        with open(file_path, "r", encoding="utf-8") as f:
            return f.read()
    
    def _process_image(self, file_path: str) -> str:
        """Extract text from image using OCR"""
        # In a real implementation, this would use pytesseract
        # For this example, we'll return a placeholder
        return "This is an image document. OCR processing would extract text here."
    
    def _generate_summary(self, text: str) -> str:
        """Generate a summary of the text"""
        # For long texts, chunk and summarize each part
        if len(text) > 1000:
            text = text[:1000]  # For this example, just use the first 1000 chars
        
        try:
            summary = self.summarizer(text, max_length=150, min_length=30, do_sample=False)
            return summary[0]['summary_text']
        except Exception as e:
            return f"Could not generate summary: {str(e)}"
    
    def _extract_entities(self, text: str) -> Dict[str, List[str]]:
        """Extract named entities from text"""
        # For long texts, just use the first part
        if len(text) > 1000:
            text = text[:1000]
        
        try:
            entities_raw = self.ner(text)
            
            # Group entities by type
            entities = {}
            for entity in entities_raw:
                entity_type = entity['entity']
                entity_text = entity['word']
                
                if entity_type not in entities:
                    entities[entity_type] = []
                
                if entity_text not in entities[entity_type]:
                    entities[entity_type].append(entity_text)
            
            return entities
        except Exception as e:
            return {"ERROR": [f"Could not extract entities: {str(e)}"]}
    
    def _classify_document(self, text: str) -> Dict[str, Any]:
        """Classify the document"""
        # For long texts, just use the first part
        if len(text) > 1000:
            text = text[:1000]
        
        try:
            classification = self.classifier(text)
            return {
                "category": classification[0]['label'],
                "confidence": classification[0]['score']
            }
        except Exception as e:
            return {"category": "Unknown", "confidence": 0, "error": str(e)}
    
    def _analyze_sentiment(self, text: str) -> Dict[str, Any]:
        """Analyze the sentiment of the text"""
        # For long texts, just use the first part
        if len(text) > 1000:
            text = text[:1000]
        
        try:
            sentiment = self.sentiment_analyzer(text)
            return {
                "sentiment": sentiment[0]['label'],
                "confidence": sentiment[0]['score']
            }
        except Exception as e:
            return {"sentiment": "Unknown", "confidence": 0, "error": str(e)}
