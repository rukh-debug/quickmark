'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';

interface ImportExportDialogProps {
  open: boolean;
  onClose: () => void;
  mode: 'import' | 'export';
  data?: string;
  onImport?: (data: string) => boolean;
}


export default function ImportExportDialog({
  open,
  onClose,
  mode,
  data = '',
  onImport,
}: ImportExportDialogProps) {
  const [importData, setImportData] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const handleClose = () => {
    setImportData('');
    setError('');
    setSuccess('');
    onClose();
  };

  const handleImport = () => {
    setError('');
    setSuccess('');

    if (!importData.trim()) {
      setError('Please paste quickmark data to import');
      return;
    }

    if (onImport) {
      const result = onImport(importData);
      if (result) {
        setSuccess('QuickMarks imported successfully!');
        setTimeout(() => {
          handleClose();
        }, 1500);
      } else {
        setError('Failed to import quickmarks. Please check the data format.');
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(data);
    setSuccess('Copied to clipboard!');
    setTimeout(() => setSuccess(''), 2000);
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setImportData(text);
    } catch (err) {
      setError('Failed to read from clipboard');
    }
  };

  if (mode === 'export') {
    return (
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Export QuickMarks</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Copy the data below and save it to a file. You can import it later to restore your quickmarks.
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={10}
            value={data}
            InputProps={{
              readOnly: true,
            }}
            sx={{ mt: 1, fontFamily: 'monospace' }}
          />
          {success && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {success}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button variant="contained" onClick={handleCopy}>
            Copy to Clipboard
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Import QuickMarks
        <Button
          variant="outlined"
          size="small"
          startIcon={<ContentPasteIcon />}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handlePasteFromClipboard();
          }}
        >
          Paste
        </Button>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Paste your previously exported quickmark data below. This will replace all current quickmarks.
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={10}
          placeholder='Paste your exported QuickMarks here. You can paste the entire text including any comments - only the JSON array will be extracted.'
          value={importData}
          onChange={(e) => setImportData(e.target.value)}
          sx={{ mt: 1, fontFamily: 'monospace' }}
        />
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {success}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleImport}>
          Import
        </Button>
      </DialogActions>
    </Dialog>
  );
}
