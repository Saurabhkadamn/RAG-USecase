import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Paper, 
  Grid,
  CircularProgress,
  Snackbar,
  Alert,
  Card,
  CardContent,
  CardActions,
  Divider,
  Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DescriptionIcon from '@mui/icons-material/Description';
import SummarizeIcon from '@mui/icons-material/Summarize';
import CategoryIcon from '@mui/icons-material/Category';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import DateRangeIcon from '@mui/icons-material/DateRange';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';

const Input = styled('input')({
  display: 'none',
});

function Dashboard() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documentData, setDocumentData] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  useEffect(() => {
    // Fetch documents on component mount
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      // For this demo, we'll use mock data
      setTimeout(() => {
        const mockDocuments = [
          {
            document_id: "123e4567-e89b-12d3-a456-426614174000",
            filename: "business_report.pdf",
            content_type: "application/pdf",
            upload_time: "2025-04-15T10:30:00",
            status: "processed"
          },
          {
            document_id: "223e4567-e89b-12d3-a456-426614174001",
            filename: "technical_specification.docx",
            content_type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            upload_time: "2025-04-16T14:45:00",
            status: "processed"
          },
          {
            document_id: "323e4567-e89b-12d3-a456-426614174002",
            filename: "meeting_notes.txt",
            content_type: "text/plain",
            upload_time: "2025-04-17T09:15:00",
            status: "processed"
          }
        ];
        setDocuments(mockDocuments);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching documents:", error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch documents',
        severity: 'error'
      });
      setLoading(false);
    }
  };

  const handleFileChange = (event) => {
    setFiles(Array.from(event.target.files));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setSnackbar({
        open: true,
        message: 'Please select a file to upload',
        severity: 'warning'
      });
      return;
    }

    setUploading(true);
    try {
      // In a real app, this would be an API call to upload the file
      // For this demo, we'll simulate a successful upload
      setTimeout(() => {
        setSnackbar({
          open: true,
          message: 'Document uploaded successfully',
          severity: 'success'
        });
        setUploading(false);
        setFiles([]);
        
        // Add the uploaded document to the list
        const newDocument = {
          document_id: "423e4567-e89b-12d3-a456-426614174003",
          filename: files[0].name,
          content_type: files[0].type,
          upload_time: new Date().toISOString(),
          status: "processing"
        };
        setDocuments([newDocument, ...documents]);
        
        // Simulate processing completion after 3 seconds
        setTimeout(() => {
          setDocuments(docs => docs.map(doc => 
            doc.document_id === newDocument.document_id 
              ? {...doc, status: "processed"} 
              : doc
          ));
        }, 3000);
      }, 2000);
    } catch (error) {
      console.error("Error uploading file:", error);
      setSnackbar({
        open: true,
        message: 'Failed to upload document',
        severity: 'error'
      });
      setUploading(false);
    }
  };

  const handleDocumentSelect = async (document) => {
    setSelectedDocument(document);
    
    // In a real app, this would fetch document details from the API
    // For this demo, we'll use mock data
    setTimeout(() => {
      const mockData = {
        document_id: document.document_id,
        filename: document.filename,
        content_type: document.content_type,
        upload_time: document.upload_time,
        status: document.status,
        summary: "This document discusses the implementation of generative AI in document processing systems. It covers various techniques for text extraction, classification, and summarization using transformer-based models. The document highlights the benefits of using AI for automating document workflows and provides case studies of successful implementations.",
        entities: {
          "PERSON": ["John Smith", "Jane Doe"],
          "ORG": ["Acme Corporation", "TechCorp Inc."],
          "DATE": ["January 15, 2025", "Q2 2025"],
          "LOCATION": ["New York", "San Francisco"]
        },
        classification: {
          category: "Technical Report",
          confidence: 0.92,
          alternative_categories: [
            {category: "Research Paper", confidence: 0.78},
            {category: "User Manual", confidence: 0.45}
          ]
        },
        sentiment: {
          sentiment: "Positive",
          confidence: 0.85
        },
        word_count: 2500,
        page_count: 5
      };
      setDocumentData(mockData);
    }, 500);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({...snackbar, open: false});
  };

  const getFileIcon = (contentType) => {
    if (contentType.includes('pdf')) {
      return <DescriptionIcon color="error" />;
    } else if (contentType.includes('word')) {
      return <DescriptionIcon color="primary" />;
    } else if (contentType.includes('text')) {
      return <DescriptionIcon color="action" />;
    } else {
      return <DescriptionIcon />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'processed':
        return 'success';
      case 'processing':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Document Processing Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Upload Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Upload Document
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <label htmlFor="contained-button-file">
                <Input
                  accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,image/*"
                  id="contained-button-file"
                  multiple
                  type="file"
                  onChange={handleFileChange}
                />
                <Button
                  variant="contained"
                  component="span"
                  startIcon={<CloudUploadIcon />}
                >
                  Select File
                </Button>
              </label>
              <Box sx={{ ml: 2 }}>
                {files.length > 0 && (
                  <Typography variant="body2">
                    {files.length} file(s) selected: {files.map(f => f.name).join(', ')}
                  </Typography>
                )}
              </Box>
              <Box sx={{ ml: 'auto' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpload}
                  disabled={uploading || files.length === 0}
                >
                  {uploading ? <CircularProgress size={24} /> : 'Upload'}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>
        
        {/* Document List */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 500, overflow: 'auto' }}>
            <Typography variant="h6" gutterBottom>
              Documents
            </Typography>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              documents.map((doc) => (
                <Box
                  key={doc.document_id}
                  sx={{
                    p: 2,
                    mb: 1,
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    cursor: 'pointer',
                    backgroundColor: selectedDocument?.document_id === doc.document_id ? '#f5f5f5' : 'transparent',
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                    },
                  }}
                  onClick={() => handleDocumentSelect(doc)}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {getFileIcon(doc.content_type)}
                    <Typography variant="body1" sx={{ ml: 1, fontWeight: 'medium' }}>
                      {doc.filename}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(doc.upload_time).toLocaleString()}
                    </Typography>
                    <Chip
                      label={doc.status}
                      size="small"
                      color={getStatusColor(doc.status)}
                    />
                  </Box>
                </Box>
              ))
            )}
          </Paper>
        </Grid>
        
        {/* Document Details */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 500, overflow: 'auto' }}>
            {selectedDocument && documentData ? (
              <>
                <Typography variant="h6" gutterBottom>
                  Document Details
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {documentData.filename}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 1 }}>
                    <Chip label={`${documentData.page_count} pages`} size="small" />
                    <Chip label={`${documentData.word_count} words`} size="small" />
                    <Chip 
                      label={documentData.sentiment.sentiment} 
                      size="small"
                      color={documentData.sentiment.sentiment === "Positive" ? "success" : 
                             documentData.sentiment.sentiment === "Negative" ? "error" : "default"}
                    />
                    <Chip 
                      label={documentData.classification.category} 
                      size="small"
                      color="primary"
                    />
                  </Box>
                </Box>
                
                <Typography variant="subtitle1" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
                  <SummarizeIcon sx={{ mr: 1 }} /> Summary
                </Typography>
                <Typography variant="body2" paragraph sx={{ ml: 4 }}>
                  {documentData.summary}
                </Typography>
                
                <Typography variant="subtitle1" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                  <CategoryIcon sx={{ mr: 1 }} /> Classification
                </Typography>
                <Box sx={{ ml: 4, mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" fontWeight="medium">
                      {documentData.classification.category}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      ({Math.round(documentData.classification.confidence * 100)}% confidence)
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Alternative categories: 
                    {documentData.classification.alternative_categories.map((cat, index) => (
                      <span key={index}> {cat.category} ({Math.round(cat.confidence * 100)}%){index < documentData.classification.alternative_categories.length - 1 ? ',' : ''}</span>
                    ))}
                  </Typography>
                </Box>
                
                <Typography variant="subtitle1" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                  <PeopleIcon sx={{ mr: 1 }} /> Named Entities
                </Typography>
                <Grid container spacing={2} sx={{ ml: 2, mt: 0.5 }}>
                  {Object.entries(documentData.entities).map(([entityType, entities]) => (
                    <Grid item xs={6} key={entityType}>
                      <Card variant="outlined" sx={{ mb: 1 }}>
                        <CardContent sx={{ py: 1 }}>
                          <Typography variant="body2" fontWeight="medium" color="text.secondary">
                            {entityType}
                          </Typography>
                          <Box sx={{ mt: 1 }}>
                            {entities.map((entity, index) => (
                              <Chip 
                                key={index} 
                                label={entity} 
                                size="small" 
                                sx={{ mr: 0.5, mb: 0.5 }}
                                icon={
                                  entityType === "PERSON" ? <PeopleIcon fontSize="small" /> :
                                  entityType === "ORG" ? <BusinessIcon fontSize="small" /> :
                                  entityType === "DATE" ? <DateRangeIcon fontSize="small" /> :
                                  entityType === "LOCATION" ? <LocationOnIcon fontSize="small" /> :
                                  undefined
                                }
                              />
                            ))}
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <DescriptionIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Select a document to view details
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Dashboard;
