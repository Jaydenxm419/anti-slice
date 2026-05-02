import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  IconButton,
  Collapse,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import HistoryIcon from '@mui/icons-material/History';
import { getClubLabel } from '../utils/clubs';
import { SingleClubChart } from './SwingChart';
import { hapticLight, hapticMedium } from '../utils/haptics';

function calcAvg(arr) {
  if (!arr?.length) return 0;
  return Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
}

function calcMax(arr) {
  if (!arr?.length) return 0;
  return Math.max(...arr);
}

function SessionCard({ session, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const clubs = session.clubs.filter((c) => session.swings[c]?.length > 0);
  const totalSwings = Object.values(session.swings).reduce((s, a) => s + a.length, 0);

  const dateLabel = new Date(session.date).toLocaleDateString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const timeLabel = new Date(session.date).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <>
      <Card>
        <CardContent sx={{ pb: '12px !important' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                {dateLabel}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {timeLabel} &bull; {totalSwings} swings &bull; {session.clubs.length} clubs
              </Typography>
            </Box>
            <Stack direction="row" alignItems="center">
              <IconButton
                size="small"
                onClick={() => {
                  hapticLight();
                  setConfirmDelete(true);
                }}
                sx={{ color: 'grey.400' }}
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => {
                  hapticLight();
                  setExpanded((v) => !v);
                }}
                sx={{ color: 'grey.600' }}
              >
                {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Stack>
          </Stack>

          <Box sx={{ mt: 1.5, display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
            {session.clubs.map((c) => {
              const swings = session.swings[c] ?? [];
              return (
                <Chip
                  key={c}
                  label={
                    swings.length
                      ? `${getClubLabel(c)}: ${swings.length} (avg ${calcAvg(swings)} yd)`
                      : `${getClubLabel(c)}: 0`
                  }
                  size="small"
                  color={swings.length ? 'primary' : 'default'}
                  variant={swings.length ? 'filled' : 'outlined'}
                  sx={{ fontSize: '0.72rem' }}
                />
              );
            })}
          </Box>

          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Divider sx={{ my: 2 }} />
            {clubs.length === 0 ? (
              <Typography variant="body2" color="text.secondary" align="center">
                No swings recorded in this session.
              </Typography>
            ) : (
              <Stack spacing={3}>
                {clubs.map((clubId) => {
                  const swings = session.swings[clubId];
                  return (
                    <Box key={clubId}>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {getClubLabel(clubId)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {swings.length} swings &bull; avg {calcAvg(swings)} yd &bull; max {calcMax(swings)} yd
                        </Typography>
                      </Stack>
                      <SingleClubChart clubId={clubId} swings={swings} height={180} />
                    </Box>
                  );
                })}
              </Stack>
            )}
          </Collapse>
        </CardContent>
      </Card>

      <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Session?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            This will permanently delete the session from {dateLabel}. This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              hapticMedium();
              onDelete(session.id);
              setConfirmDelete(false);
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default function HistoricalSessions({ sessions, deleteSession }) {
  if (!sessions.length) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <HistoryIcon sx={{ fontSize: 56, color: 'grey.400', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No sessions yet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Your completed sessions will appear here.
        </Typography>
      </Box>
    );
  }

  const grouped = sessions.reduce((acc, s) => {
    const key = new Date(s.date).toLocaleDateString([], {
      month: 'long',
      year: 'numeric',
    });
    if (!acc[key]) acc[key] = [];
    acc[key].push(s);
    return acc;
  }, {});

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 0.5 }}>
        History
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {sessions.length} session{sessions.length !== 1 ? 's' : ''} recorded
      </Typography>
      <Stack spacing={3}>
        {Object.entries(grouped).map(([month, monthSessions]) => (
          <Box key={month}>
            <Typography variant="overline" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
              {month}
            </Typography>
            <Stack spacing={1.5}>
              {monthSessions.map((s) => (
                <SessionCard key={s.id} session={s} onDelete={deleteSession} />
              ))}
            </Stack>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
