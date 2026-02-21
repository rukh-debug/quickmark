import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Tooltip,
  useMediaQuery,
  useTheme,
  Zoom,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Dialog,
  DialogContent,
  Link,
  Paper,
} from '@mui/material';
import {
  Brightness4 as DarkIcon,
  Brightness7 as LightIcon,
  Add as AddIcon,
  UploadFile as ImportIcon,
  FileUpload as ExportIcon,
  BookmarkRounded as QuickMarkIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  MoreVert as MoreIcon,
  Info as InfoIcon,
  GitHub as GitHubIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useRef, useEffect, useState } from 'react';

interface HeaderProps {
  onAddClick: () => void;
  onExportClick: () => void;
  onImportClick: () => void;
  quickMarkCount?: number;
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchResultCount?: number;
}

// Modern minimalist date-time component
function DateTimeDisplay() {
  const [now, setNow] = useState<Date | null>(null);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!now) return null;

  const rawHours = now.getHours();
  const hours = (rawHours % 12 || 12).toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const ampm = rawHours >= 12 ? 'PM' : 'AM';
  const dayName = now.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  const dayNum = now.getDate().toString().padStart(2, '0');
  const month = now.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1.5,
        minWidth: { xs: 200, sm: 240 },
        height: { xs: 48, sm: 56 },
        px: { xs: 2.5, sm: 3 },
        borderRadius: 3,
        bgcolor: isDark ? 'rgba(131, 165, 152, 0.08)' : 'rgba(37, 99, 235, 0.04)',
        border: '2px solid',
        borderColor: isDark ? 'rgba(131, 165, 152, 0.25)' : 'rgba(37, 99, 235, 0.15)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          borderColor: 'primary.main',
          bgcolor: isDark ? 'rgba(131, 165, 152, 0.12)' : 'rgba(37, 99, 235, 0.08)',
          transform: 'scale(1.03)',
          boxShadow: isDark
            ? '0 4px 20px rgba(131, 165, 152, 0.2)'
            : '0 4px 20px rgba(37, 99, 235, 0.15)',
        },
      }}
    >
      {/* Time - Large and bold */}
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'baseline', 
          gap: 0.5, 
          lineHeight: 1,
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }} 
      >
        <Typography
          sx={{
            fontSize: { xs: '1.75rem', sm: '2rem' },
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: 'text.primary',
            fontFamily: '"SF Mono", "Monaco", "Inconsolata", "Fira Code", monospace',
            lineHeight: 1,
          }}
        >
          {hours}:{minutes}
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: '0.875rem', sm: '1rem' },
            fontWeight: 600,
            color: isDark ? 'primary.light' : 'primary.main',
            fontFamily: '"SF Mono", "Monaco", "Inconsolata", "Fira Code", monospace',
            lineHeight: 1,
            opacity: 0.9,
          }}
        >
          {seconds}
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: '0.875rem', sm: '1rem' },
            fontWeight: 600,
            color: isDark ? 'primary.light' : 'primary.main',
            fontFamily: '"SF Mono", "Monaco", "Inconsolata", "Fira Code", monospace',
            lineHeight: 1,
            opacity: 0.7,
            ml: 0.5,
          }}
        >
          {ampm}
        </Typography>
      </Box>

      {/* Divider */}
      <Box
        sx={{
          width: '2px',
          height: '60%',
          bgcolor: isDark ? 'rgba(131, 165, 152, 0.3)' : 'rgba(37, 99, 235, 0.2)',
          borderRadius: 1,
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />

      {/* Date - Bold and prominent */}
      <Typography
        sx={{
          fontSize: { xs: '1rem', sm: '1.125rem' },
          fontWeight: 700,
          letterSpacing: '0.04em',
          color: 'text.secondary',
          lineHeight: 1,
          fontFamily: '"SF Mono", "Monaco", "Inconsolata", "Fira Code", monospace',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {dayName} · {dayNum} {month}
      </Typography>
    </Box>
  );
}

export default function Header({ 
  onAddClick, 
  onExportClick, 
  onImportClick, 
  quickMarkCount = 0,
  searchValue,
  onSearchChange,
  searchResultCount,
}: HeaderProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  });
  
  // Menu state
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(menuAnchorEl);
  
  // About dialog state
  const [aboutOpen, setAboutOpen] = useState(false);

  // Keyboard shortcut: Cmd/Ctrl + K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTheme = () => {
    const newMode = mode === 'dark' ? 'light' : 'dark';
    setMode(newMode);
    localStorage.setItem('theme', newMode);
    // Reload to apply new theme
    window.location.reload();
  };

  const isDark = mode === 'dark';

  const handleSearchContainerClick = () => {
    searchInputRef.current?.focus();
  };

  // Menu handlers
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleImport = () => {
    handleMenuClose();
    onImportClick();
  };

  const handleExport = () => {
    handleMenuClose();
    onExportClick();
  };

  const handleThemeToggle = () => {
    handleMenuClose();
    toggleTheme();
  };

  const handleAdd = () => {
    handleMenuClose();
    onAddClick();
  };

  const handleAboutOpen = () => {
    handleMenuClose();
    setAboutOpen(true);
  };

  const handleAboutClose = () => {
    setAboutOpen(false);
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        backgroundImage: 'none',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar 
        sx={{ 
          px: { xs: 1.5, sm: 2, md: 3 }, 
          py: { xs: 1.5, sm: 2 },
          minHeight: { xs: 64, sm: 72, md: 80 },
          gap: { xs: 1, sm: 2, md: 3 },
        }}
      >
        {/* Logo Section */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: { xs: 1.25, sm: 1.75 },
            flexShrink: 0,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: { xs: 36, sm: 42 },
              height: { xs: 36, sm: 42 },
              borderRadius: 2.5,
              background: isDark
                ? 'linear-gradient(135deg, #83a598 0%, #458588 100%)'
                : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              color: '#fff',
              boxShadow: isDark
                ? '0 4px 16px rgba(131, 165, 152, 0.35)'
                : '0 4px 16px rgba(37, 99, 235, 0.35)',
              transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              '&:hover': {
                transform: 'scale(1.08) rotate(-4deg)',
                boxShadow: isDark
                  ? '0 6px 24px rgba(131, 165, 152, 0.5)'
                  : '0 6px 24px rgba(37, 99, 235, 0.5)',
              },
            }}
          >
            <QuickMarkIcon sx={{ fontSize: { xs: 18, sm: 22 } }} />
          </Box>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Typography
              variant="h6"
              component="h1"
              sx={{
                fontWeight: 800,
                color: 'text.primary',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
                fontSize: { sm: '1.25rem', md: '1.35rem' },
              }}
            >
              QuickMark
            </Typography>
            {!isTablet && (
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.7rem',
                  display: 'block',
                  mt: 0.25,
                  fontWeight: 500,
                  letterSpacing: '0.02em',
                }}
              >
                {quickMarkCount} {quickMarkCount === 1 ? 'quickmark' : 'quickmarks'}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Search Bar - Center Stage */}
        <Box 
          sx={{ 
            flex: 1, 
            maxWidth: { xs: '100%', sm: 400, md: 480, lg: 560 },
            mx: 'auto',
          }}
        >
          <Box
            component="div"
            onClick={handleSearchContainerClick}
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              height: { xs: 44, sm: 46, md: 48 },
              px: { xs: 1.5, sm: 2 },
              borderRadius: 3,
              bgcolor: isSearchFocused
                ? 'background.paper'
                : 'action.hover',
              border: '2px solid',
              borderColor: isSearchFocused
                ? 'primary.main'
                : 'divider',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: isSearchFocused
                ? isDark
                  ? '0 0 0 4px rgba(131, 165, 152, 0.15)'
                  : '0 0 0 4px rgba(37, 99, 235, 0.1)'
                : 'none',
              cursor: 'text',
              '&:hover': {
                borderColor: isSearchFocused ? 'primary.main' : 'primary.light',
                bgcolor: 'background.paper',
              },
            }}
          >
            <SearchIcon
              sx={{
                fontSize: { xs: 18, sm: 20 },
                color: isSearchFocused ? 'primary.main' : 'text.secondary',
                transition: 'all 0.2s ease',
                mr: 1,
                flexShrink: 0,
              }}
            />

            <Box
              component="input"
              ref={searchInputRef}
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              placeholder={isMobile ? 'Search...' : 'Search quickmarks...'}
              sx={{
                flex: 1,
                minWidth: 0,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: { xs: '0.9rem', sm: '0.9375rem' },
                fontWeight: 500,
                color: 'text.primary',
                fontFamily: 'inherit',
                cursor: 'text',
                '&::placeholder': {
                  color: 'text.secondary',
                  opacity: 0.6,
                  fontWeight: 400,
                },
              }}
            />

            {/* Right side actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, ml: 0.5, flexShrink: 0 }}>
              {/* Keyboard shortcut hint */}
              {!isMobile && !searchValue && (
                <Box
                  component="kbd"
                  sx={{
                    display: { xs: 'none', md: 'flex' },
                    alignItems: 'center',
                    justifyContent: 'center',
                    px: 1,
                    height: 22,
                    borderRadius: 1,
                    bgcolor: 'background.default',
                    color: 'text.secondary',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    fontFamily: 'inherit',
                    border: '1px solid',
                    borderColor: 'divider',
                    userSelect: 'none',
                  }}
                >
                  ⌘K
                </Box>
              )}

              {/* Clear button */}
              {searchValue && (
                <Zoom in>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSearchChange('');
                    }}
                    sx={{
                      width: 24,
                      height: 24,
                      color: 'text.secondary',
                      '&:hover': {
                        color: 'text.primary',
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    <ClearIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Zoom>
              )}

              {/* Result count */}
              {searchResultCount !== undefined && searchValue && (
                <Chip
                  label={isMobile ? `${searchResultCount}` : `${searchResultCount} result${searchResultCount !== 1 ? 's' : ''}`}
                  size="small"
                  sx={{
                    height: 22,
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    bgcolor: 'primary.light',
                    color: 'primary.contrastText',
                    borderRadius: 1.5,
                    '& .MuiChip-label': {
                      px: 1,
                    },
                  }}
                />
              )}
            </Box>
          </Box>
        </Box>

        {/* Right Section: Date/Time + Actions Menu + Add Button */}
        <Box 
          sx={{ 
            display: 'flex', 
            gap: { xs: 1, sm: 1.5 }, 
            alignItems: 'center',
            flexShrink: 0,
          }}
        >
          {/* Modern Date/Time Display - Hidden on very small screens */}
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <DateTimeDisplay />
          </Box>

          {/* Actions Menu - Replaces individual icon buttons */}
          <Tooltip title="More actions" arrow>
            <IconButton
              onClick={handleMenuOpen}
              aria-controls={menuOpen ? 'actions-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={menuOpen ? 'true' : undefined}
              size="small"
              sx={{ 
                color: 'text.secondary',
                width: { xs: 38, sm: 42 },
                height: { xs: 38, sm: 42 },
                borderRadius: 2,
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                bgcolor: 'action.hover',
                '&:hover': { 
                  color: 'primary.main', 
                  bgcolor: isDark ? 'rgba(131, 165, 152, 0.12)' : 'rgba(37, 99, 235, 0.08)',
                  transform: 'scale(1.05)',
                },
              }}
            >
              <MoreIcon sx={{ fontSize: { xs: 20, sm: 22 } }} />
            </IconButton>
          </Tooltip>

          {/* Modern Styled Menu */}
          <Menu
            id="actions-menu"
            anchorEl={menuAnchorEl}
            open={menuOpen}
            onClose={handleMenuClose}
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
                elevation: 0,
                sx: {
                  minWidth: 200,
                  mt: 1.5,
                  borderRadius: 2.5,
                  overflow: 'visible',
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  boxShadow: isDark
                    ? '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(131, 165, 152, 0.1)'
                    : '0 8px 32px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.04)',
                  '&::before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    borderLeft: '1px solid',
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    zIndex: 0,
                  },
                },
              },
            }}
          >
            {/* Import Option */}
            <MenuItem 
              onClick={handleImport}
              sx={{
                py: 1.25,
                px: 2,
                borderRadius: 1,
                mx: 1,
                mt: 0.5,
                transition: 'all 0.15s ease',
                '&:hover': {
                  bgcolor: isDark ? 'rgba(131, 165, 152, 0.12)' : 'rgba(37, 99, 235, 0.08)',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: 'primary.main' }}>
                <ImportIcon sx={{ fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText 
                primary="Import" 
                primaryTypographyProps={{
                  fontSize: '0.9375rem',
                  fontWeight: 500,
                }}
              />
            </MenuItem>

            {/* Export Option */}
            <MenuItem 
              onClick={handleExport}
              sx={{
                py: 1.25,
                px: 2,
                borderRadius: 1,
                mx: 1,
                transition: 'all 0.15s ease',
                '&:hover': {
                  bgcolor: isDark ? 'rgba(131, 165, 152, 0.12)' : 'rgba(37, 99, 235, 0.08)',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: 'primary.main' }}>
                <ExportIcon sx={{ fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText 
                primary="Export" 
                primaryTypographyProps={{
                  fontSize: '0.9375rem',
                  fontWeight: 500,
                }}
              />
            </MenuItem>

            <Divider sx={{ my: 1, mx: 1.5, borderColor: 'divider' }} />

            {/* Theme Toggle */}
            <MenuItem 
              onClick={handleThemeToggle}
              sx={{
                py: 1.25,
                px: 2,
                borderRadius: 1,
                mx: 1,
                transition: 'all 0.15s ease',
                '&:hover': {
                  bgcolor: isDark ? 'rgba(250, 189, 47, 0.08)' : 'rgba(245, 158, 11, 0.08)',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: isDark ? '#fabd2f' : '#f59e0b' }}>
                {isDark ? <LightIcon sx={{ fontSize: 20 }} /> : <DarkIcon sx={{ fontSize: 20 }} />}
              </ListItemIcon>
              <ListItemText 
                primary={isDark ? 'Light mode' : 'Dark mode'}
                primaryTypographyProps={{
                  fontSize: '0.9375rem',
                  fontWeight: 500,
                }}
              />
            </MenuItem>

            <Divider sx={{ my: 1, mx: 1.5, borderColor: 'divider' }} />

            {/* Add Option */}
            <MenuItem 
              onClick={handleAdd}
              sx={{
                py: 1.25,
                px: 2,
                borderRadius: 1,
                mx: 1,
                transition: 'all 0.15s ease',
                bgcolor: isDark ? 'rgba(131, 165, 152, 0.08)' : 'rgba(37, 99, 235, 0.04)',
                '&:hover': {
                  bgcolor: isDark ? 'rgba(131, 165, 152, 0.2)' : 'rgba(37, 99, 235, 0.12)',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: 'primary.main' }}>
                <AddIcon sx={{ fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText 
                primary="Add QuickMark"
                primaryTypographyProps={{
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  color: 'primary.main',
                }}
              />
            </MenuItem>

            <Divider sx={{ my: 1, mx: 1.5, borderColor: 'divider' }} />

            {/* About Option */}
            <MenuItem 
              onClick={handleAboutOpen}
              sx={{
                py: 1.25,
                px: 2,
                borderRadius: 1,
                mx: 1,
                mb: 0.5,
                transition: 'all 0.15s ease',
                '&:hover': {
                  bgcolor: isDark ? 'rgba(131, 165, 152, 0.12)' : 'rgba(37, 99, 235, 0.08)',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: 'text.secondary' }}>
                <InfoIcon sx={{ fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText 
                primary="About"
                primaryTypographyProps={{
                  fontSize: '0.9375rem',
                  fontWeight: 500,
                }}
              />
            </MenuItem>
          </Menu>

          {/* About Dialog */}
          <Dialog
            open={aboutOpen}
            onClose={handleAboutClose}
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
                background: (theme) => theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, rgba(131, 165, 152, 0.25) 0%, rgba(69, 133, 136, 0.12) 100%)'
                  : 'linear-gradient(135deg, rgba(37, 99, 235, 0.12) 0%, rgba(29, 78, 216, 0.05) 100%)',
                p: 3,
                pb: 2.5,
                position: 'relative',
              }}
            >
              <IconButton
                onClick={handleAboutClose}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  color: 'text.secondary',
                }}
              >
                <CloseIcon />
              </IconButton>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 56,
                    height: 56,
                    borderRadius: 2.5,
                    bgcolor: 'background.paper',
                    boxShadow: (theme) => theme.palette.mode === 'dark'
                      ? '0 4px 20px rgba(131, 165, 152, 0.25)'
                      : '0 4px 20px rgba(37, 99, 235, 0.2)',
                  }}
                >
                  <QuickMarkIcon 
                    sx={{ 
                      fontSize: 28, 
                      color: (theme) => theme.palette.mode === 'dark' ? '#83a598' : '#2563eb'
                    }} 
                  />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                    About QuickMark
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Privacy-first bookmark manager
                  </Typography>
                </Box>
              </Box>
            </Box>

            <DialogContent sx={{ p: 3, pt: 2.5 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {/* What is this project */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'action.hover',
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                      }}
                    >
                      <InfoIcon sx={{ fontSize: 18 }} />
                    </Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      What is QuickMark?
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ pl: 5.5 }}>
                    A lightweight, privacy-first bookmark manager that stores all your data locally. 
                    Features instant search, import/export, and a clean interface, no accounts, 
                    no cloud, no tracking.
                  </Typography>
                </Paper>

                {/* Bug reporting */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'action.hover',
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: (theme) => theme.palette.mode === 'dark' ? '#fb4934' : '#ef4444',
                        color: '#fff',
                      }}
                    >
                      <GitHubIcon sx={{ fontSize: 18 }} />
                    </Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Found a bug?
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ pl: 5.5, mb: 1.5 }}>
                    If you discover any issues or have suggestions for improvement, please report them 
                    on our GitHub repository. Your feedback helps make QuickMark better for everyone!
                  </Typography>
                  <Box sx={{ pl: 5.5 }}>
                    <Link
                      href="https://github.com/rukh-debug/quickmark/issues"
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 0.75,
                        px: 2,
                        py: 0.75,
                        borderRadius: 1.5,
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        color: 'primary.main',
                        textDecoration: 'none',
                        bgcolor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: 'primary.main',
                          bgcolor: 'action.hover',
                        },
                      }}
                    >
                      <GitHubIcon sx={{ fontSize: 16 }} />
                      Report on GitHub
                    </Link>
                  </Box>
                </Paper>
              </Box>
            </DialogContent>
          </Dialog>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
