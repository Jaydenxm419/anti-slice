import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  Divider,
  Stack,
  Chip,
  Alert,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutlined';
import SportsGolfIcon from '@mui/icons-material/SportsGolf';
import { v4 as uuidv4 } from 'uuid';
import ClubSelector from './ClubSelector';
import SwingLogger from './SwingLogger';
import { hapticMedium, hapticSuccess } from '../utils/haptics';
import { getClubLabel } from '../utils/clubs';

const STEPS = ['Choose Clubs', 'Log Swings'];

export default function SessionManagement({ sessions, addSession, updateSession }) {
  const [creating, setCreating] = useState(false);
  const [step, setStep] = useState(0);
  const [selectedClubs, setSelectedClubs] = useState([]);
  const [activeSession, setActiveSession] = useState(null);

  const today = new Date().toISOString();

  const openNew = () => {
    hapticMedium();
    setSelectedClubs([]);
    setStep(0);
    setCreating(true);
  };

  const handleStart = () => {
    if (!selectedClubs.length) return;
    hapticSuccess();
    const session = {
      id: uuidv4(),
      date: today,
      clubs: selectedClubs,
      swings: Object.fromEntries(selectedClubs.map((c) => [c, []])),
    };
    addSession(session);
    setActiveSession(session);
    setStep(1);
  };

  const handleAddSwing = (clubId, distance) => {
    updateSession(activeSession.id, (s) => {
      const updated = {
        ...s,
        swings: {
          ...s.swings,
          [clubId]: [...(s.swings[clubId] ?? []), distance],
        },
      };
      setActiveSession(updated);
      return updated;
    });
  };

  const handleDeleteSwing = (clubId, idx) => {
    updateSession(activeSession.id, (s) => {
      const updated = {
        ...s,
        swings: {
          ...s.swings,
          [clubId]: s.swings[clubId].filter((_, i) => i !== idx),
        },
      };
      setActiveSession(updated);
      return updated;
    });
  };

  const handleFinish = () => {
    hapticSuccess();
    setCreating(false);
    setActiveSession(null);
  };

  const resumeSession = (session) => {
    hapticMedium();
    setActiveSession(session);
    setStep(1);
    setCreating(true);
  };

  const todaySessions = sessions.filter(
    (s) => new Date(s.date).toDateString() === new Date().toDateString()
  );

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const totalSwings = (s) =>
    Object.values(s.swings).reduce((sum, arr) => sum + arr.length, 0);

  return (
    <Box sx={{ pb: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h5">Today's Range</Typography>
          <Typography variant="body2" color="text.secondary">
            {new Date().toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={openNew}
          size="medium"
        >
          New Session
        </Button>
      </Stack>

      {todaySessions.length === 0 ? (
        <Card
          variant="outlined"
          sx={{ borderStyle: 'dashed', borderColor: 'grey.300', bgcolor: 'grey.50', borderRadius: 3 }}
        >
          <CardContent sx={{ textAlign: 'center', py: 5 }}>
            <SportsGolfIcon sx={{ fontSize: 52, color: 'grey.400', mb: 1.5 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No sessions today
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Start a new session to begin logging your swings.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Stack spacing={2}>
          {todaySessions.map((s) => (
            <Card key={s.id}>
              <CardContent sx={{ pb: '12px !important' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="subtitle1">
                      Session at {formatDate(s.date)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {totalSwings(s)} swings across {s.clubs.length} club{s.clubs.length !== 1 ? 's' : ''}
                    </Typography>
                  </Box>
                  <Button size="small" variant="outlined" onClick={() => resumeSession(s)}>
                    Resume
                  </Button>
                </Stack>
                <Box sx={{ mt: 1.5, display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                  {s.clubs.map((c) => (
                    <Chip
                      key={c}
                      label={`${getClubLabel(c)}: ${s.swings[c]?.length ?? 0}`}
                      size="small"
                      color={s.swings[c]?.length > 0 ? 'primary' : 'default'}
                      variant={s.swings[c]?.length > 0 ? 'filled' : 'outlined'}
                      sx={{ fontSize: '0.72rem' }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      <Dialog
        open={creating}
        fullScreen
        PaperProps={{ sx: { borderRadius: 0, bgcolor: 'background.default' } }}
      >
        <Box sx={{ bgcolor: 'primary.main', color: 'white', px: 2, pt: 5, pb: 2 }}>
          <Typography variant="h6" fontWeight={700}>
            {step === 0 ? 'New Session' : 'Log Swings'}
          </Typography>
          <Stepper activeStep={step} sx={{ mt: 1.5 }}>
            {STEPS.map((label) => (
              <Step key={label}>
                <StepLabel
                  sx={{
                    '& .MuiStepLabel-label': { color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' },
                    '& .MuiStepLabel-label.Mui-active': { color: 'white' },
                    '& .MuiStepIcon-root': { color: 'rgba(255,255,255,0.4)' },
                    '& .MuiStepIcon-root.Mui-active': { color: 'white' },
                    '& .MuiStepIcon-root.Mui-completed': { color: 'rgba(255,255,255,0.9)' },
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
          {step === 0 && (
            <Box>
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <ClubSelector selected={selectedClubs} onChange={setSelectedClubs} />
                </CardContent>
              </Card>
              {selectedClubs.length === 0 && (
                <Alert severity="info" sx={{ borderRadius: 2 }}>
                  Select at least one club to continue.
                </Alert>
              )}
            </Box>
          )}

          {step === 1 && activeSession && (
            <Card>
              <CardContent>
                <SwingLogger
                  session={activeSession}
                  onAddSwing={handleAddSwing}
                  onDeleteSwing={handleDeleteSwing}
                />
              </CardContent>
            </Card>
          )}
        </Box>

        <Box
          sx={{
            p: 2,
            bgcolor: 'background.paper',
            borderTop: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            gap: 1,
          }}
        >
          {step === 0 ? (
            <>
              <Button fullWidth variant="outlined" onClick={() => setCreating(false)}>
                Cancel
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={handleStart}
                disabled={!selectedClubs.length}
              >
                Start Session
              </Button>
            </>
          ) : (
            <Button fullWidth variant="contained" onClick={handleFinish}>
              Finish Session
            </Button>
          )}
        </Box>
      </Dialog>
    </Box>
  );
}
