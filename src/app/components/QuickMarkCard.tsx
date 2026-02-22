'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Paper,
  LinearProgress,
  Fade,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Backdrop,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  PushPin as PinIcon,
  MoreVert as MoreIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { QuickMark } from '../types/quickmark';
import { getFaviconUrls, getDomain, getFallbackEmoji, preloadImage, isDefaultFavicon } from '../utils/favicon';
import { quickMarkColors } from '../theme/gruvbox';

interface QuickMarkCardProps {
  quickMark: QuickMark;
  onEdit: (quickMark: QuickMark) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
}

const HOLD_DURATION = 1000; // 1 second hold to delete

export default function QuickMarkCard({ quickMark, onEdit, onDelete, onTogglePin }: QuickMarkCardProps) {
  const [faviconError, setFaviconError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null);

  // Try multiple favicon sources when URL changes
  useEffect(() => {
    setFaviconError(false);
    setImageLoaded(false);
    setFaviconUrl(null);

    const tryFaviconSources = async () => {
      const sources = getFaviconUrls(quickMark.url);
      
      for (const source of sources) {
        const img = await preloadImage(source.url);
        if (img) {
          // Skip Google's default globe icon
          if (isDefaultFavicon(img)) {
            continue;
          }
          setFaviconUrl(source.url);
          return;
        }
      }
      
      // If no working favicon found, mark as error
      setFaviconError(true);
    };

    tryFaviconSources();
  }, [quickMark.url]);
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPressing, setIsPressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  
  const pressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pressStartTimeRef = useRef<number>(0);

  const accentColor = quickMark.shadowColor || quickMarkColors[3].value;
  const isMenuOpen = Boolean(menuAnchorEl);

  const handleEdit = () => {
    handleMenuClose();
    onEdit(quickMark);
  };

  const handleDeleteClick = () => {
    handleMenuClose();
    setIsDeleting(true);
  };

  const handleDeleteConfirm = useCallback(() => {
    onDelete(quickMark.id);
    setIsDeleting(false);
    setIsPressing(false);
    setProgress(0);
  }, [quickMark.id, onDelete]);

  const handleCancelDelete = () => {
    setIsDeleting(false);
    setIsPressing(false);
    setProgress(0);
    cancelPress();
  };

  const startPress = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    
    setIsPressing(true);
    pressStartTimeRef.current = Date.now();
    setProgress(0);

    // Start progress animation
    const updateInterval = 16; // ~60fps
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - pressStartTimeRef.current;
      const newProgress = Math.min((elapsed / HOLD_DURATION) * 100, 100);
      setProgress(newProgress);
    }, updateInterval);

    // Set timer for actual deletion
    pressTimerRef.current = setTimeout(() => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      handleDeleteConfirm();
    }, HOLD_DURATION);
  }, [handleDeleteConfirm]);

  const cancelPress = useCallback((event?: React.MouseEvent | React.TouchEvent) => {
    if (event) {
      event.preventDefault();
    }
    
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    setIsPressing(false);
    setProgress(0);
  }, []);

  const handleTogglePin = (event: React.MouseEvent) => {
    event.stopPropagation();
    onTogglePin(quickMark.id);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleOpen = () => {
    window.open(quickMark.url, '_blank', 'noopener,noreferrer');
  };

  const domain = getDomain(quickMark.url);
  const showFavicon = faviconUrl && !faviconError;

  return (
    <>
      <Paper
        onClick={handleOpen}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        elevation={0}
        sx={{
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 3,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: quickMark.pinned 
            ? `${accentColor}50`
            : 'divider',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isHovered ? 'translateY(-4px) scale(1.01)' : 'translateY(0) scale(1)',
          boxShadow: quickMark.pinned
            ? `0 0 0 1.5px ${accentColor}60, 0 8px 32px ${accentColor}25`
            : isHovered
              ? `0 0 0 1px ${accentColor}40, 0 12px 40px -12px ${accentColor}35`
              : '0 2px 8px rgba(0, 0, 0, 0.04)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            bgcolor: accentColor,
            opacity: quickMark.pinned ? 1 : isHovered ? 0.8 : 0,
            transition: 'opacity 0.3s ease',
          },
        }}
      >
        {/* Pin Badge */}
        {quickMark.pinned && !isHovered && (
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              zIndex: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              px: 1,
              py: 0.25,
              borderRadius: 1,
              bgcolor: `${accentColor}15`,
              border: '1px solid',
              borderColor: `${accentColor}30`,
            }}
          >
            <PinIcon sx={{ fontSize: 12, color: accentColor }} />
            <Typography
              variant="caption"
              sx={{
                fontSize: '0.65rem',
                fontWeight: 700,
                color: accentColor,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Pinned
            </Typography>
          </Box>
        )}

        {/* Main Content */}
        <Box sx={{ p: 2.5, display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          {/* Icon Container */}
          <Box
            sx={{
              position: 'relative',
              flexShrink: 0,
              width: 48,
              height: 48,
              borderRadius: 2.5,
              overflow: 'hidden',
              bgcolor: showFavicon ? 'transparent' : `${accentColor}15`,
              border: '1px solid',
              borderColor: showFavicon ? 'divider' : `${accentColor}30`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {showFavicon ? (
              <>
                <Box
                  component="img"
                  src={faviconUrl || ''}
                  alt={quickMark.title}
                  onError={() => setFaviconError(true)}
                  onLoad={() => setImageLoaded(true)}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    opacity: imageLoaded ? 1 : 0,
                    transition: 'opacity 0.2s ease',
                  }}
                />
                {!imageLoaded && (
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: `${accentColor}15`,
                      color: accentColor,
                      fontSize: '1.25rem',
                      fontWeight: 600,
                    }}
                  >
                    {getFallbackEmoji(quickMark.url, quickMark.title)}
                  </Box>
                )}
              </>
            ) : (
              <Typography
                sx={{
                  color: accentColor,
                  fontSize: '1.5rem',
                  lineHeight: 1,
                }}
              >
                {getFallbackEmoji(quickMark.url, quickMark.title)}
              </Typography>
            )}
          </Box>

          {/* Text Content */}
          <Box sx={{ flexGrow: 1, minWidth: 0, pt: 0.25 }}>
            <Typography
              variant="subtitle1"
              noWrap
              sx={{
                fontWeight: 600,
                fontSize: '0.95rem',
                lineHeight: 1.4,
                color: 'text.primary',
                pr: quickMark.pinned ? 5 : 0,
              }}
            >
              {quickMark.title}
            </Typography>
            
            <Typography
              variant="body2"
              noWrap
              sx={{
                fontSize: '0.8rem',
                color: 'text.secondary',
                mt: 0.25,
              }}
            >
              {domain}
            </Typography>
          </Box>
        </Box>

        {/* Action Overlay - Only Pin + Menu on hover */}
        <Fade in={isHovered}>
          <Box
            sx={{
              position: 'absolute',
              right: 12,
              top: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              zIndex: 3,
            }}
          >
            {/* Pin Button */}
            <Tooltip title={quickMark.pinned ? 'Unpin' : 'Pin'} placement="top">
              <IconButton
                size="small"
                onClick={handleTogglePin}
                sx={{
                  width: 32,
                  height: 32,
                  color: quickMark.pinned ? accentColor : 'text.secondary',
                  bgcolor: quickMark.pinned ? `${accentColor}20` : 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(4px)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                  '&:hover': {
                    bgcolor: quickMark.pinned ? `${accentColor}30` : 'background.paper',
                  },
                }}
              >
                <PinIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>

            {/* Menu Button */}
            <Tooltip title="More options" placement="top">
              <IconButton
                size="small"
                onClick={handleMenuOpen}
                sx={{
                  width: 32,
                  height: 32,
                  color: 'text.secondary',
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(4px)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                  '&:hover': {
                    bgcolor: 'background.paper',
                    color: accentColor,
                  },
                }}
              >
                <MoreIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Fade>

      </Paper>

      {/* Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={isMenuOpen}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        slotProps={{
          paper: {
            elevation: 3,
            sx: {
              minWidth: 140,
              borderRadius: 2,
              mt: 0.5,
              '& .MuiMenuItem-root': {
                gap: 1.5,
                py: 1,
                px: 1.5,
                fontSize: '0.875rem',
              },
            },
          },
        }}
      >
        <MenuItem onClick={handleEdit}>
          <EditIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
          Edit
        </MenuItem>
        <MenuItem 
          onClick={handleDeleteClick}
          sx={{
            color: 'error.main',
            '&:hover': {
              bgcolor: 'error.lighter',
            },
          }}
        >
          <DeleteIcon sx={{ fontSize: 18 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Hold to Delete Dialog with Backdrop */}
      <Dialog
        open={isDeleting}
        onClose={handleCancelDelete}
        onClick={(e) => e.stopPropagation()}
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 300,
        }}
        PaperProps={{
          elevation: 0,
          sx: {
            borderRadius: 3,
            maxWidth: 360,
            width: '90%',
            overflow: 'hidden',
          },
        }}
      >
        {/* Progress Bar at Top */}
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            bgcolor: 'transparent',
            '& .MuiLinearProgress-bar': {
              bgcolor: 'error.main',
              transition: 'none',
            },
          }}
        />

        <DialogTitle
          sx={{
            textAlign: 'center',
            pt: 4,
            pb: 1,
            fontSize: '1.25rem',
            fontWeight: 600,
            color: 'text.primary',
          }}
        >
          Delete QuickMark?
        </DialogTitle>

        <DialogContent sx={{ textAlign: 'center', pb: 3 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 3, fontSize: '0.9rem' }}
          >
            Are you sure you want to delete &quot;{quickMark.title}&quot;?
            This action cannot be undone.
          </Typography>

          {/* Hold to Delete Button */}
          <Button
            fullWidth
            variant="contained"
            color="error"
            disableElevation
            onMouseDown={startPress}
            onMouseUp={cancelPress}
            onMouseLeave={() => {
              if (isPressing) cancelPress();
            }}
            onTouchStart={startPress}
            onTouchEnd={cancelPress}
            sx={{
              py: 1.5,
              borderRadius: 2,
              fontSize: '0.9rem',
              fontWeight: 600,
              textTransform: 'none',
              position: 'relative',
              overflow: 'hidden',
              bgcolor: isPressing ? 'error.dark' : 'error.main',
              transition: 'all 0.15s ease',
              '&:hover': {
                bgcolor: 'error.dark',
              },
            }}
          >
            {/* Fill Animation */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '100%',
                bgcolor: 'error.dark',
                transform: `scaleX(${progress / 100})`,
                transformOrigin: 'left',
                transition: 'transform 0.05s linear',
                zIndex: 0,
              }}
            />
            
            <Box
              sx={{
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
              }}
            >
              <WarningIcon sx={{ fontSize: 20 }} />
              {isPressing ? 'Deleting...' : 'Hold to Delete'}
            </Box>
          </Button>

          {/* Cancel Button */}
          <Button
            fullWidth
            variant="text"
            onClick={handleCancelDelete}
            sx={{
              mt: 1,
              py: 1,
              fontSize: '0.85rem',
              color: 'text.secondary',
              textTransform: 'none',
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            Cancel
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
