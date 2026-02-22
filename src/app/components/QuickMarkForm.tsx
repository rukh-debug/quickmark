'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Paper,
  Fade,
  Zoom,
  useTheme,
} from '@mui/material';
import {
  Language as LanguageIcon,
  Close as CloseIcon,
  Check as CheckIcon,
  ColorLens as ColorIcon,
} from '@mui/icons-material';
import { QuickMark, QuickMarkFormData } from '../types/quickmark';
import { quickMarkColors } from '../theme/gruvbox';
import { getFaviconUrls } from '../utils/favicon';

interface QuickMarkFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: QuickMarkFormData) => void;
  quickMark?: QuickMark | null;
}

export default function QuickMarkForm({
  open,
  onClose,
  onSubmit,
  quickMark,
}: QuickMarkFormProps) {
  const theme = useTheme();
  const isEditing = !!quickMark;
  
  const [formData, setFormData] = useState<QuickMarkFormData>({
    title: '',
    url: '',
    shadowColor: quickMarkColors[3].value,
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof QuickMarkFormData, string>>>({});
  const [faviconPreview, setFaviconPreview] = useState<string>('');
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Update favicon preview when URL changes
  const updateFaviconPreview = useCallback((url: string) => {
    if (!url.trim()) {
      setFaviconPreview('');
      return;
    }
    try {
      let normalizedUrl = url.trim();
      if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
        normalizedUrl = `https://${normalizedUrl}`;
      }
      new URL(normalizedUrl);
      const sources = getFaviconUrls(normalizedUrl);
      // Use the highest priority source for preview
      setFaviconPreview(sources.length > 0 ? sources[0].url : '');
    } catch {
      setFaviconPreview('');
    }
  }, []);

  // Reset form when dialog opens/closes or quickmark changes
  useEffect(() => {
    if (open) {
      if (quickMark) {
        setFormData({
          title: quickMark.title,
          url: quickMark.url,
          shadowColor: quickMark.shadowColor,
        });
        updateFaviconPreview(quickMark.url);
      } else {
        setFormData({
          title: '',
          url: '',
          shadowColor: quickMarkColors[3].value,
        });
        setFaviconPreview('');
      }
      setErrors({});
      setShowColorPicker(false);
    }
  }, [open, quickMark, updateFaviconPreview]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof QuickMarkFormData, string>> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.url.trim()) {
      newErrors.url = 'URL is required';
    } else {
      try {
        const url = formData.url.trim();
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          new URL(`https://${url}`);
        } else {
          new URL(url);
        }
      } catch {
        newErrors.url = 'Please enter a valid URL';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      // Normalize URL
      let url = formData.url.trim();
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = `https://${url}`;
      }
      
      onSubmit({
        ...formData,
        url,
      });
      onClose();
    }
  };

  const handleChange = (field: keyof QuickMarkFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (field === 'url') {
      updateFaviconPreview(value);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
        }
      }}
    >
      {/* Header with gradient background */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${formData.shadowColor}40 0%, ${formData.shadowColor}20 100%)`,
          p: 3,
          pb: 2,
          position: 'relative',
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: 'text.secondary',
          }}
        >
          <CloseIcon />
        </IconButton>

        <DialogTitle sx={{ p: 0, mb: 2, fontWeight: 600 }}>
          {isEditing ? 'Edit QuickMark' : 'Add New QuickMark'}
        </DialogTitle>

        {/* Live Preview Card */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            borderRadius: 2,
            bgcolor: 'background.paper',
            boxShadow: `0 4px 20px ${formData.shadowColor}30`,
            transition: 'box-shadow 0.3s ease',
          }}
        >
          {/* Favicon or Placeholder */}
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: faviconPreview ? 'transparent' : 'action.hover',
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            {faviconPreview ? (
              <Box
                component="img"
                src={faviconPreview}
                alt=""
                sx={{ width: 40, height: 40, objectFit: 'contain' }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <LanguageIcon sx={{ fontSize: 24, color: 'text.secondary' }} />
            )}
          </Box>

          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography
              variant="subtitle1"
              noWrap
              sx={{ fontWeight: 600, color: formData.title ? 'text.primary' : 'text.disabled' }}
            >
              {formData.title || 'QuickMark Title'}
            </Typography>
            <Typography
              variant="body2"
              noWrap
              sx={{ color: formData.url ? 'text.secondary' : 'text.disabled', fontSize: '0.8rem' }}
            >
              {formData.url.replace(/^https?:\/\//, '').replace(/^www\./, '') || 'example.com'}
            </Typography>
          </Box>
        </Paper>
      </Box>

      <DialogContent sx={{ p: 3, pt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* Title Field */}
          <TextField
            label="Title"
            fullWidth
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            error={!!errors.title}
            helperText={errors.title}
            placeholder="e.g., GitHub"
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />

          {/* URL Field */}
          <TextField
            label="URL"
            fullWidth
            value={formData.url}
            onChange={(e) => handleChange('url', e.target.value)}
            error={!!errors.url}
            helperText={errors.url}
            placeholder="e.g., github.com"
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />

          {/* Shadow Color Picker */}
          <Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                p: 1.5,
                borderRadius: 2,
                border: '1px solid',
                borderColor: showColorPicker ? 'primary.main' : 'divider',
                bgcolor: showColorPicker ? 'action.hover' : 'transparent',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
              onClick={() => setShowColorPicker(!showColorPicker)}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <ColorIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Glow Color
                </Typography>
              </Box>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  bgcolor: formData.shadowColor,
                  boxShadow: `0 0 8px ${formData.shadowColor}`,
                  border: '2px solid',
                  borderColor: 'background.paper',
                }}
              />
            </Box>

            {/* Color Palette - Expandable */}
            <Fade in={showColorPicker}>
              <Box
                sx={{
                  display: showColorPicker ? 'flex' : 'none',
                  flexWrap: 'wrap',
                  gap: 1,
                  mt: 1.5,
                  p: 1.5,
                  bgcolor: 'action.hover',
                  borderRadius: 2,
                }}
              >
                {quickMarkColors.map((color) => (
                  <Zoom key={color.value} in={showColorPicker} style={{ transitionDelay: '50ms' }}>
                    <IconButton
                      onClick={() => handleChange('shadowColor', color.value)}
                      sx={{
                        width: 36,
                        height: 36,
                        p: 0,
                        position: 'relative',
                      }}
                    >
                      <Box
                        sx={{
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          bgcolor: color.value,
                          boxShadow: formData.shadowColor === color.value
                            ? `0 0 12px ${color.value}, 0 0 0 2px ${theme.palette.background.paper}, 0 0 0 4px ${color.value}`
                            : `0 2px 4px ${color.value}40`,
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            transform: 'scale(1.1)',
                            boxShadow: `0 0 16px ${color.value}`,
                          },
                        }}
                      />
                      {formData.shadowColor === color.value && (
                        <CheckIcon
                          sx={{
                            position: 'absolute',
                            fontSize: 14,
                            color: '#fff',
                            filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))',
                          }}
                        />
                      )}
                    </IconButton>
                  </Zoom>
                ))}
              </Box>
            </Fade>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button 
          onClick={onClose}
          sx={{ 
            borderRadius: 2,
            px: 3,
            textTransform: 'none',
            fontWeight: 500,
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            borderRadius: 2,
            px: 4,
            textTransform: 'none',
            fontWeight: 600,
            background: `linear-gradient(135deg, ${formData.shadowColor} 0%, ${formData.shadowColor}dd 100%)`,
            boxShadow: `0 4px 14px ${formData.shadowColor}50`,
            '&:hover': {
              background: `linear-gradient(135deg, ${formData.shadowColor}ee 0%, ${formData.shadowColor} 100%)`,
              boxShadow: `0 6px 20px ${formData.shadowColor}60`,
            },
          }}
        >
          {isEditing ? 'Save Changes' : 'Add QuickMark'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
