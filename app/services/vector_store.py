import faiss
import numpy as np
from typing import List, Dict, Any, Optional
import os
import pickle
import json

class VectorStore:
    """
    Vector database for document similarity search using FAISS
    """
    def __init__(self, index_path: str = "data/vector_index", dimension: int = 768):
        self.dimension = dimension
        self.index_path = index_path
        self.index_file = os.path.join(index_path, "faiss_index.bin")
        self.metadata_file = os.path.join(index_path, "metadata.pkl")
        
        # Create directory if it doesn't exist
        os.makedirs(index_path, exist_ok=True)
        
        # Initialize or load index
        if os.path.exists(self.index_file) and os.path.exists(self.metadata_file):
            self.index = self._load_index()
            with open(self.metadata_file, 'rb') as f:
                self.metadata = pickle.load(f)
        else:
            self.index = faiss.IndexFlatL2(dimension)  # L2 distance
            self.metadata = {}  # document_id -> {metadata}
    
    def _load_index(self):
        """Load FAISS index from disk"""
        return faiss.read_index(self.index_file)
    
    def _save_index(self):
        """Save FAISS index to disk"""
        faiss.write_index(self.index, self.index_file)
        with open(self.metadata_file, 'wb') as f:
            pickle.dump(self.metadata, f)
    
    def add_document(self, document_id: str, embedding: np.ndarray, metadata: Dict[str, Any] = None):
        """
        Add a document embedding to the vector store
        
        Args:
            document_id: Unique identifier for the document
            embedding: Document embedding vector
            metadata: Additional metadata to store with the document
        """
        # Ensure embedding is the right shape
        if embedding.shape[0] != self.dimension:
            raise ValueError(f"Embedding dimension mismatch: expected {self.dimension}, got {embedding.shape[0]}")
        
        # Add to index
        embedding_normalized = embedding.reshape(1, -1).astype('float32')
        self.index.add(embedding_normalized)
        
        # Store metadata
        idx = self.index.ntotal - 1  # Index of the added vector
        self.metadata[document_id] = {
            "faiss_id": idx,
            "metadata": metadata or {}
        }
        
        # Save to disk
        self._save_index()
        
        return idx
    
    def search(self, query_embedding: np.ndarray, limit: int = 5) -> List[Dict[str, Any]]:
        """
        Search for similar documents
        
        Args:
            query_embedding: Query embedding vector
            limit: Maximum number of results to return
            
        Returns:
            List of similar documents with metadata and similarity scores
        """
        # Ensure embedding is the right shape
        if query_embedding.shape[0] != self.dimension:
            raise ValueError(f"Query dimension mismatch: expected {self.dimension}, got {query_embedding.shape[0]}")
        
        # Reshape for FAISS
        query_embedding = query_embedding.reshape(1, -1).astype('float32')
        
        # Search
        distances, indices = self.index.search(query_embedding, limit)
        
        # Prepare results
        results = []
        for i, (distance, idx) in enumerate(zip(distances[0], indices[0])):
            # Find document_id for this index
            document_id = None
            for doc_id, data in self.metadata.items():
                if data["faiss_id"] == idx:
                    document_id = doc_id
                    metadata = data["metadata"]
                    break
            
            if document_id:
                # Convert distance to similarity score (1 - normalized distance)
                similarity = 1.0 - min(distance / 100.0, 1.0)  # Simple normalization
                
                results.append({
                    "document_id": document_id,
                    "similarity": similarity,
                    "metadata": metadata,
                    "rank": i + 1
                })
        
        return results
    
    def delete_document(self, document_id: str) -> bool:
        """
        Remove a document from the vector store
        
        Args:
            document_id: ID of document to remove
            
        Returns:
            True if successful, False otherwise
        """
        if document_id not in self.metadata:
            return False
        
        # In a production system, you would need to rebuild the index
        # FAISS doesn't support direct deletion, so we'd need to rebuild
        # For this example, we'll just remove from metadata
        del self.metadata[document_id]
        self._save_index()
        
        return True
    
    def get_document_count(self) -> int:
        """Get the number of documents in the index"""
        return self.index.ntotal
