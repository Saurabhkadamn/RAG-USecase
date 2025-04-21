# Generative AI Document Processing Application

A comprehensive application for automated document processing using modern AI frameworks. This system extracts, categorizes, and summarizes information from various document formats.

## Features

- **Document Upload**: Support for PDF, DOCX, TXT, and image-based documents
- **Text Extraction**: Extract text from various document formats including scanned PDFs
- **Document Classification**: Automatically categorize documents by type and content
- **Information Extraction**: Identify and extract key information from documents
- **Summarization**: Generate concise summaries of document content
- **Named Entity Recognition**: Identify people, organizations, dates, and other entities
- **Sentiment Analysis**: Analyze the sentiment and tone of documents
- **API Integration**: RESTful API for seamless integration with existing systems
- **Microservices Architecture**: Scalable and maintainable service-oriented design

## Technology Stack

- **Backend**: Python, FastAPI
- **AI/ML**: Hugging Face Transformers, OpenAI API integration
- **Document Processing**: PyPDF2, python-docx, Tesseract OCR
- **Vector Database**: FAISS for efficient document similarity search
- **Containerization**: Docker for consistent deployment
- **Frontend**: React with Material-UI for the admin dashboard
- **Authentication**: JWT-based authentication system
- **Storage**: AWS S3 integration for document storage

## Getting Started

### Prerequisites

- Python 3.8+
- Docker and Docker Compose
- Node.js 14+ (for frontend development)



1. Set up the environment:
```bash
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env file with your API keys and configuration
```

4. Run the application:
```bash
# Using Docker
docker-compose up -d

# Without Docker
python -m app.main
```

5. Access the application:
- API: http://localhost:8000
- Frontend: http://localhost:3000
- API Documentation: http://localhost:8000/docs

## Project Structure

```
generative-ai-doc-processor/
├── app/                    # Backend application
│   ├── api/                # API endpoints
│   ├── core/               # Core application logic
│   ├── models/             # Data models
│   ├── services/           # Business logic services
│   ├── utils/              # Utility functions
│   └── main.py             # Application entry point
├── frontend/               # React frontend application
├── tests/                  # Test suite
├── docker/                 # Docker configuration
├── docs/                   # Documentation
├── scripts/                # Utility scripts
├── .env.example            # Example environment variables
├── docker-compose.yml      # Docker Compose configuration
├── requirements.txt        # Python dependencies
└── README.md               # Project documentation
```

## API Documentation

The API documentation is available at `/docs` when the application is running. It provides detailed information about all available endpoints, request/response formats, and authentication requirements.

## Usage Examples

### Document Upload and Processing

```python
import requests

# Upload a document
files = {'file': open('example.pdf', 'rb')}
response = requests.post('http://localhost:8000/api/documents/upload', files=files)
document_id = response.json()['document_id']

# Get processing results
results = requests.get(f'http://localhost:8000/api/documents/{document_id}')
print(results.json())
```

### Document Summarization

```python
import requests

# Get a summary of a document
response = requests.get(f'http://localhost:8000/api/documents/{document_id}/summary')
summary = response.json()['summary']
print(summary)
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Hugging Face for their amazing transformers library
- OpenAI for their powerful language models
- All open-source projects that made this application possible
