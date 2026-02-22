import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Switch,
  Divider,
  Button,
  Paper,
  Tooltip,
  Chip,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Close as CloseIcon,
  Settings as SettingsIcon,
  ArrowUpward as UpIcon,
  ArrowDownward as DownIcon,
  Image as ImageIcon,
  Public as GoogleIcon,
  Security as DuckDuckGoIcon,
  Restore as ResetIcon,
  WatchLater as DateTimeIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import { FaviconSettings, FaviconSource, FaviconSourceType } from '../types/faviconSettings';
import { DateTimeSettings } from '../hooks/useDateTimeSettings';

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
  // Favicon settings
  faviconSettings: FaviconSettings;
  toggleFaviconEnabled: () => void;
  toggleSource: (type: FaviconSourceType) => void;
  moveSourceUp: (index: number) => void;
  moveSourceDown: (index: number) => void;
  resetFaviconDefaults: () => void;
  // DateTime settings
  dateTimeSettings: DateTimeSettings;
  toggleShowDate: () => void;
  toggleShowTime: () => void;
  resetDateTimeDefaults: () => void;
}

const sourceIcons: Record<FaviconSourceType, React.ReactNode> = {
  direct: <ImageIcon sx={{ fontSize: 20 }} />,
  google: <GoogleIcon sx={{ fontSize: 20 }} />,
  duckduckgo: <DuckDuckGoIcon sx={{ fontSize: 20 }} />,
};

export default function SettingsDialog({
  open,
  onClose,
  faviconSettings,
  toggleFaviconEnabled,
  toggleSource,
  moveSourceUp,
  moveSourceDown,
  resetFaviconDefaults,
  dateTimeSettings,
  toggleShowDate,
  toggleShowTime,
  resetDateTimeDefaults,
}: SettingsDialogProps) {
  const [activeTab, setActiveTab] = useState(0);
  const faviconEnabledCount = faviconSettings.sources.filter((s) => s.enabled).length;

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
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
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, rgba(131, 165, 152, 0.25) 0%, rgba(69, 133, 136, 0.12) 100%)'
              : 'linear-gradient(135deg, rgba(37, 99, 235, 0.12) 0%, rgba(29, 78, 216, 0.05) 100%)',
          p: 3,
          pb: 2.5,
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
              boxShadow: (theme) =>
                theme.palette.mode === 'dark'
                  ? '0 4px 20px rgba(131, 165, 152, 0.25)'
                  : '0 4px 20px rgba(37, 99, 235, 0.2)',
            }}
          >
            <SettingsIcon
              sx={{
                fontSize: 28,
                color: (theme) => (theme.palette.mode === 'dark' ? '#83a598' : '#2563eb'),
              }}
            />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              Settings
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Customize your QuickMark experience
            </Typography>
          </Box>
        </Box>
      </Box>

      <DialogContent sx={{ p: 0 }}>
        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: '3px 3px 0 0',
              },
            }}
          >
            <Tab
              icon={<DateTimeIcon sx={{ fontSize: 20 }} />}
              iconPosition="start"
              label="Date & Time"
              sx={{ textTransform: 'none', fontWeight: 600 }}
            />
            <Tab
              icon={<ImageIcon sx={{ fontSize: 20 }} />}
              iconPosition="start"
              label="Favicon"
              sx={{ textTransform: 'none', fontWeight: 600 }}
            />
          </Tabs>
        </Box>

        {/* Tab 1: Date & Time Settings */}
        {activeTab === 0 && (
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Info */}
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  bgcolor: 'action.hover',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Date & Time Display
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Control the visibility of the date and time widget in the header
                </Typography>
              </Paper>

              {/* Show Time Toggle */}
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                      Show Time
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Display the current time in the header
                    </Typography>
                  </Box>
                  <Switch
                    checked={dateTimeSettings.showTime}
                    onChange={toggleShowTime}
                    color="primary"
                  />
                </Box>
              </Paper>

              {/* Show Date Toggle */}
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                      Show Date
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Display the current date in the header
                    </Typography>
                  </Box>
                  <Switch
                    checked={dateTimeSettings.showDate}
                    onChange={toggleShowDate}
                    color="primary"
                  />
                </Box>
              </Paper>

              {!dateTimeSettings.showDate && !dateTimeSettings.showTime && (
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: 2,
                    bgcolor: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(251, 73, 52, 0.08)'
                        : 'rgba(239, 68, 68, 0.08)',
                    border: '1px solid',
                    borderColor: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(251, 73, 52, 0.2)'
                        : 'rgba(239, 68, 68, 0.2)',
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    <strong>Note:</strong> When both date and time are disabled,
                    the widget will be hidden from the header.
                  </Typography>
                </Paper>
              )}

              <Divider sx={{ borderColor: 'divider' }} />

              {/* Reset Button */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<ResetIcon />}
                  onClick={resetDateTimeDefaults}
                  sx={{
                    textTransform: 'none',
                    borderRadius: 2,
                    color: 'text.secondary',
                    borderColor: 'divider',
                    '&:hover': {
                      borderColor: 'text.primary',
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  Reset to Defaults
                </Button>
              </Box>
            </Box>
          </Box>
        )}

        {/* Tab 2: Favicon Settings */}
        {activeTab === 1 && (
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Main Toggle */}
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  bgcolor: 'action.hover',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                      Enable Third-Party Favicon Fetching
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Fetch favicons from external services when direct fetch fails
                    </Typography>
                  </Box>
                  <Switch
                    checked={faviconSettings.enabled}
                    onChange={toggleFaviconEnabled}
                    color="primary"
                  />
                </Box>
              </Paper>

              {faviconSettings.enabled && (
                <>
                  {/* Info Chip */}
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                      size="small"
                      label={`${faviconEnabledCount} source${faviconEnabledCount !== 1 ? 's' : ''} enabled`}
                      color={faviconEnabledCount > 0 ? 'success' : 'warning'}
                      sx={{ fontWeight: 500 }}
                    />
                    <Chip
                      size="small"
                      variant="outlined"
                      label="Priority order: top to bottom"
                      sx={{ fontWeight: 500 }}
                    />
                  </Box>

                  {/* Sources List */}
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 600, mb: 1.5, color: 'text.primary' }}
                    >
                      Favicon Sources
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      Enable/disable sources and arrange them in priority order. The
                      app will try each enabled source from top to bottom.
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      {faviconSettings.sources.map((source, index) => (
                        <SourceItem
                          key={source.type}
                          source={source}
                          index={index}
                          totalCount={faviconSettings.sources.length}
                          onToggle={() => toggleSource(source.type)}
                          onMoveUp={() => moveSourceUp(index)}
                          onMoveDown={() => moveSourceDown(index)}
                        />
                      ))}
                    </Box>
                  </Box>
                </>
              )}

              {!faviconSettings.enabled && (
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: 2,
                    bgcolor: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(251, 73, 52, 0.08)'
                        : 'rgba(239, 68, 68, 0.08)',
                    border: '1px solid',
                    borderColor: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(251, 73, 52, 0.2)'
                        : 'rgba(239, 68, 68, 0.2)',
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    <strong>Note:</strong> When disabled, only direct favicon.ico
                    fetching will be used. Many websites may not display favicons.
                  </Typography>
                </Paper>
              )}

              <Divider sx={{ borderColor: 'divider' }} />

              {/* Reset Button */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<ResetIcon />}
                  onClick={resetFaviconDefaults}
                  sx={{
                    textTransform: 'none',
                    borderRadius: 2,
                    color: 'text.secondary',
                    borderColor: 'divider',
                    '&:hover': {
                      borderColor: 'text.primary',
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  Reset to Defaults
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Individual source item component
interface SourceItemProps {
  source: FaviconSource;
  index: number;
  totalCount: number;
  onToggle: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

function SourceItem({
  source,
  index,
  totalCount,
  onToggle,
  onMoveUp,
  onMoveDown,
}: SourceItemProps) {
  const isFirst = index === 0;
  const isLast = index === totalCount - 1;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: source.enabled ? 'divider' : 'action.disabledBackground',
        opacity: source.enabled ? 1 : 0.7,
        transition: 'all 0.2s ease',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        {/* Priority Number */}
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: source.enabled ? 'primary.main' : 'action.disabled',
            color: 'primary.contrastText',
            fontSize: '0.875rem',
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {index + 1}
        </Box>

        {/* Icon */}
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: source.enabled ? 'action.hover' : 'transparent',
            color: source.enabled ? 'primary.main' : 'text.disabled',
            flexShrink: 0,
          }}
        >
          {sourceIcons[source.type]}
        </Box>

        {/* Info */}
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              color: source.enabled ? 'text.primary' : 'text.disabled',
            }}
          >
            {source.label}
          </Typography>
          <Typography
            variant="caption"
            color={source.enabled ? 'text.secondary' : 'text.disabled'}
            sx={{ display: 'block' }}
          >
            {source.description}
          </Typography>
        </Box>

        {/* Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {/* Reorder Buttons */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              mr: 0.5,
            }}
          >
            <Tooltip title="Move up">
              <span>
                <IconButton
                  size="small"
                  onClick={onMoveUp}
                  disabled={isFirst}
                  sx={{
                    width: 24,
                    height: 20,
                    borderRadius: '4px 4px 0 0',
                    color: 'text.secondary',
                    '&:hover:not(:disabled)': {
                      color: 'primary.main',
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  <UpIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Move down">
              <span>
                <IconButton
                  size="small"
                  onClick={onMoveDown}
                  disabled={isLast}
                  sx={{
                    width: 24,
                    height: 20,
                    borderRadius: '0 0 4px 4px',
                    color: 'text.secondary',
                    '&:hover:not(:disabled)': {
                      color: 'primary.main',
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  <DownIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </span>
            </Tooltip>
          </Box>

          {/* Enable/Disable Toggle */}
          <Switch
            checked={source.enabled}
            onChange={onToggle}
            color="primary"
            size="small"
          />
        </Box>
      </Box>
    </Paper>
  );
}
