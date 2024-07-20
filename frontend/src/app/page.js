'use client';

import { useState } from 'react';
import { Container, Typography, Button, Box, Divider } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { uploadFile } from '../utils/api'; // Import from the utility file

const VisuallyHiddenInput = styled('input')({
  display: 'none',
});

const UploadButton = styled(Button)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '10px 20px',
  borderRadius: '8px',
  color: '#fff',
  backgroundColor: '#007bff',
  '&:hover': {
    backgroundColor: '#0056b3',
  },
});

const HistoryContainer = styled(Box)({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '20%',
  height: '100%',
  backgroundColor: '#f8f9fa',
  boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
  padding: '10px',
  overflowY: 'auto',
});

const ContentContainer = styled(Container)({
  marginLeft: '20%',
  padding: '20px',
});

const HistoryItem = styled(Box)({
  padding: '10px',
  borderBottom: '1px solid #ddd',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '#f1f1f1',
  },
});

export default function Page() {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState('');
  const [history, setHistory] = useState([]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      const data = await uploadFile(file);
      setSummary(data.summary);

      // Update history
      setHistory([...history, { id: Date.now(), summary: data.summary }]);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <HistoryContainer>
        <Typography variant="h6" gutterBottom>
          Upload History
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {history.map((item) => (
          <HistoryItem key={item.id} onClick={() => setSummary(item.summary)}>
            {item.summary.slice(0, 50)}...
          </HistoryItem>
        ))}
      </HistoryContainer>
      <ContentContainer>
        <Typography variant="h4" gutterBottom>
          AI-Powered Content Summarization
        </Typography>
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <UploadButton component="label">
            <CloudUploadIcon sx={{ mr: 1 }} />
            Upload file
            <VisuallyHiddenInput type="file" onChange={handleFileChange} />
          </UploadButton>
          <Button variant="contained" color="primary" onClick={handleUpload} sx={{ mt: 2 }}>
            Summarize
          </Button>
        </Box>
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Summary:</Typography>
          <Typography>{summary}</Typography>
        </Box>
      </ContentContainer>
    </Box>
  );
}
