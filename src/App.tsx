import { useState, useMemo } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Fab,
  useTheme,
  useMediaQuery,
  Stack,
  Fade,
  Zoom,
  Paper,
  Button,
} from '@mui/material';
import {
  Add as AddIcon,
  Bookmark as QuickMarkIcon,
  SearchOff as EmptySearchIcon,
  FolderOpen as EmptyFolderIcon,
  PushPin as PinIcon,
  UploadFile as ImportIcon,
} from '@mui/icons-material';
import Header from './app/components/Header';
import QuickMarkCard from './app/components/QuickMarkCard';
import QuickMarkForm from './app/components/QuickMarkForm';
import ImportExportDialog from './app/components/ImportExportDialog';
import SnowEffect from './app/components/effects/SnowEffect';
import { useQuickMarks } from './app/hooks/useQuickMarks';
import { useSnow } from './app/hooks/useSnow';
import { useFaviconSettings } from './app/hooks/useFaviconSettings';
import { QuickMark, QuickMarkFormData } from './app/types/quickmark';


function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const {
    quickMarks,
    isLoaded,
    addQuickMark,
    updateQuickMark,
    deleteQuickMark,
    deleteAllQuickMarks,
    togglePin,
    exportQuickMarks,
    importQuickMarks,
  } = useQuickMarks();

  const { isSnowing, toggleSnow } = useSnow();
  const { getEnabledSources, isLoaded: settingsLoaded } = useFaviconSettings();

  const [searchQuery, setSearchQuery] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingQuickMark, setEditingQuickMark] = useState<QuickMark | null>(null);
  const [importExportOpen, setImportExportOpen] = useState(false);
  const [importExportMode, setImportExportMode] = useState<'import' | 'export'>('export');

  // Filter quickmarks by search query
  const filteredQuickMarks = quickMarks.filter((qm) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      qm.title.toLowerCase().includes(query) ||
      qm.url.toLowerCase().includes(query)
    );
  });

  // Split into pinned and unpinned
  const pinnedQuickMarks = useMemo(() => {
    return filteredQuickMarks.filter(qm => qm.pinned).sort((a, b) => b.createdAt - a.createdAt);
  }, [filteredQuickMarks]);

  const unpinnedQuickMarks = useMemo(() => {
    return filteredQuickMarks.filter(qm => !qm.pinned).sort((a, b) => b.createdAt - a.createdAt);
  }, [filteredQuickMarks]);

  const handleAddClick = () => {
    setEditingQuickMark(null);
    setFormOpen(true);
  };

  const handleEditClick = (quickMark: QuickMark) => {
    setEditingQuickMark(quickMark);
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditingQuickMark(null);
  };

  const handleFormSubmit = (data: QuickMarkFormData) => {
    if (editingQuickMark) {
      updateQuickMark(editingQuickMark.id, data);
    } else {
      addQuickMark(data);
    }
  };

  const handleExportClick = () => {
    setImportExportMode('export');
    setImportExportOpen(true);
  };

  const handleImportClick = () => {
    setImportExportMode('import');
    setImportExportOpen(true);
  };

  const handleImport = (data: string): { success: boolean; added: number; skipped: number } => {
    return importQuickMarks(data);
  };

  const clearFilters = () => {
    setSearchQuery('');
  };

  if (!isLoaded || !settingsLoaded) {
    return null;
  }

  const enabledFaviconSources = getEnabledSources();

  const hasFilters = !!searchQuery;
  const totalCount = filteredQuickMarks.length;
  const hasQuickMarks = quickMarks.length > 0;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header
        onAddClick={handleAddClick}
        onExportClick={handleExportClick}
        onImportClick={handleImportClick}
        onDeleteAllClick={deleteAllQuickMarks}
        quickMarkCount={quickMarks.length}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchResultCount={hasFilters ? totalCount : undefined}
        onLogoHold={toggleSnow}
        isSnowing={isSnowing}
      />

      {/* Snow Effect Easter Egg */}
      <SnowEffect enabled={isSnowing} />

      <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3 } }}>
        {/* Pinned Section */}
        {pinnedQuickMarks.length > 0 && !hasFilters && (
          <Box sx={{ mb: 4 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 1,
                mb: 2,
                px: 0.5,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PinIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 600,
                    color: 'text.secondary',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    fontSize: '0.75rem',
                  }}
                >
                  Pinned ({pinnedQuickMarks.length})
                </Typography>
              </Box>
              <Button
                size="small"
                variant="text"
                sx={{
                  fontSize: '0.7rem',
                  textTransform: 'none',
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'text.primary',
                    bgcolor: 'action.hover',
                  },
                }}
                onClick={() => pinnedQuickMarks.forEach(qm => window.open(qm.url, '_blank'))}
              >
                Open all Pinned
              </Button>
            </Box>
            <Grid container spacing={2}>
              {pinnedQuickMarks.map((quickMark, index) => (
                <Zoom in key={quickMark.id} style={{ transitionDelay: `${index * 30}ms` }}>
                  <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    <QuickMarkCard
                      quickMark={quickMark}
                      onEdit={handleEditClick}
                      onDelete={deleteQuickMark}
                      onTogglePin={togglePin}
                      enabledFaviconSources={enabledFaviconSources}
                    />
                  </Grid>
                </Zoom>
              ))}
            </Grid>
          </Box>
        )}

        {/* Regular QuickMarks Section */}
        {unpinnedQuickMarks.length > 0 && (
          <Box>
            {!hasFilters && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 2,
                  px: 0.5,
                }}
              >
                <QuickMarkIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 600,
                    color: 'text.secondary',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    fontSize: '0.75rem',
                  }}
                >
                  QuickMarks ({unpinnedQuickMarks.length})
                </Typography>
              </Box>
            )}
            <Grid container spacing={2}>
              {unpinnedQuickMarks.map((quickMark, index) => (
                <Zoom in key={quickMark.id} style={{ transitionDelay: `${index * 30}ms` }}>
                  <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    <QuickMarkCard
                      quickMark={quickMark}
                      onEdit={handleEditClick}
                      onDelete={deleteQuickMark}
                      onTogglePin={togglePin}
                      enabledFaviconSources={enabledFaviconSources}
                    />
                  </Grid>
                </Zoom>
              ))}
            </Grid>
          </Box>
        )}

        {/* Empty States */}
        {totalCount === 0 && (
          <Fade in>
            <Paper
              elevation={0}
              sx={{
                textAlign: 'center',
                py: { xs: 6, sm: 10 },
                px: 3,
                borderRadius: 4,
                bgcolor: 'background.paper',
                border: '2px dashed',
                borderColor: 'divider',
              }}
            >
              {hasFilters ? (
                // No search results
                <>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      bgcolor: 'action.hover',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                    }}
                  >
                    <EmptySearchIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
                  </Box>
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    No quickmarks found
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
                    We couldn&apos;t find any quickmarks matching &ldquo;{searchQuery}&rdquo;
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={clearFilters}
                    sx={{ borderRadius: 2, textTransform: 'none' }}
                  >
                    Clear Filters
                  </Button>
                </>
              ) : !hasQuickMarks ? (
                // No quickmarks at all
                <>
                  <Box
                    sx={{
                      width: 100,
                      height: 100,
                      borderRadius: '50%',
                      bgcolor: 'primary.lighter',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                    }}
                  >
                    <QuickMarkIcon sx={{ fontSize: 50, color: 'primary.main' }} />
                  </Box>
                  <Typography variant="h5" gutterBottom fontWeight={700}>
                    Welcome to QuickMark
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 1, maxWidth: 450, mx: 'auto' }}>
                    Your personal quickmark manager. Start by adding your favorite websites.
                  </Typography>
                  <Typography variant="body2" color="text.disabled" sx={{ mb: 4 }}>
                    Pin important ones • Beautiful favicons
                  </Typography>
                  <Stack direction="row" spacing={2} justifyContent="center">
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={handleAddClick}
                      sx={{ 
                        borderRadius: 2, 
                        textTransform: 'none',
                        px: 3,
                        py: 1,
                      }}
                    >
                      Add Your First QuickMark
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<ImportIcon />}
                      onClick={handleImportClick}
                      sx={{ 
                        borderRadius: 2, 
                        textTransform: 'none',
                        px: 3,
                        py: 1,
                      }}
                    >
                      Import QuickMarks
                    </Button>
                  </Stack>
                </>
              ) : (
                // No unpinned quickmarks (all pinned)
                <>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      bgcolor: 'action.hover',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                    }}
                  >
                    <EmptyFolderIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
                  </Box>
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    All quickmarks are pinned
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Unpin some quickmarks to see them here, or add new ones
                  </Typography>
                </>
              )}
            </Paper>
          </Fade>
        )}
      </Container>

      {/* Floating Action Button for Mobile */}
      <Zoom in={isMobile}>
        <Fab
          color="primary"
          aria-label="add"
          onClick={handleAddClick}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
          }}
        >
          <AddIcon />
        </Fab>
      </Zoom>

      {/* QuickMark Form Dialog */}
      <QuickMarkForm
        open={formOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        quickMark={editingQuickMark}
      />

      {/* Import/Export Dialog */}
      <ImportExportDialog
        open={importExportOpen}
        onClose={() => setImportExportOpen(false)}
        mode={importExportMode}
        data={exportQuickMarks()}
        onImport={handleImport}
      />
    </Box>
  );
}

export default App;
