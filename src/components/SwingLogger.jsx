import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  IconButton,
  Paper,
  Divider,
  Tab,
  Tabs,
  Stack,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import SportsGolfIcon from '@mui/icons-material/SportsGolf';
import { getClubLabel } from '../utils/clubs';
import { hapticLight, hapticSuccess, hapticError } from '../utils/haptics';
import { SingleClubChart } from './SwingChart';

export default function SwingLogger({ session, onAddSwing, onDeleteSwing }) {
  const [activeClub, setActiveClub] = useState(session.clubs[0] ?? null);
  const [distInput, setDistInput] = useState('');
  const [error, setError] = useState('');

  const handleTabChange = (_, val) => {
    hapticLight();
    setActiveClub(val);
    setDistInput('');
    setError('');
  };

  const handleAdd = () => {
    const val = parseInt(distInput, 10);
    if (!distInput || isNaN(val) || val <= 0 || val > 500) {
      setError('Enter a valid distance (1–500 yards)');
      hapticError();
      return;
    }
    hapticSuccess();
    onAddSwing(activeClub, val);
    setDistInput('');
    setError('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAdd();
  };

  const swings = session.swings[activeClub] ?? [];

  return (
    <Box>
      {session.clubs.length === 0 ? (
        <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
          No clubs selected for this session.
        </Typography>
      ) : (
        <>
          <Tabs
            value={activeClub}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              mb: 2,
              '& .MuiTab-root': { minWidth: 64, fontSize: '0.8rem', fontWeight: 600 },
              '& .MuiTabs-indicator': { backgroundColor: 'primary.main', height: 3 },
            }}
          >
            {session.clubs.map((clubId) => (
              <Tab
                key={clubId}
                value={clubId}
                label={getClubLabel(clubId)}
              />
            ))}
          </Tabs>

          <Stack direction="row" spacing={1} alignItems="flex-start" sx={{ mb: 2 }}>
            <TextField
              value={distInput}
              onChange={(e) => {
                setDistInput(e.target.value);
                setError('');
              }}
              onKeyDown={handleKeyDown}
              placeholder="Distance (yds)"
              type="number"
              inputProps={{ min: 1, max: 500, inputMode: 'numeric' }}
              size="small"
              error={!!error}
              helperText={error}
              sx={{ flex: 1 }}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAdd}
              sx={{ py: 1, minWidth: 100, mt: error ? 0 : 0.25 }}
            >
              Log
            </Button>
          </Stack>

          {swings.length === 0 ? (
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                textAlign: 'center',
                borderStyle: 'dashed',
                borderColor: 'grey.300',
                bgcolor: 'grey.50',
                borderRadius: 3,
              }}
            >
              <SportsGolfIcon sx={{ fontSize: 36, color: 'grey.400', mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                No swings logged for {getClubLabel(activeClub)} yet.
              </Typography>
            </Paper>
          ) : (
            <>
              <SingleClubChart clubId={activeClub} swings={swings} height={200} />
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Swings ({swings.length})
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {swings.map((dist, idx) => (
                  <Chip
                    key={idx}
                    label={`#${idx + 1}: ${dist} yds`}
                    onDelete={() => {
                      hapticLight();
                      onDeleteSwing(activeClub, idx);
                    }}
                    deleteIcon={<DeleteOutlineIcon />}
                    variant="outlined"
                    sx={{ fontSize: '0.8rem' }}
                  />
                ))}
              </Box>
            </>
          )}
        </>
      )}
    </Box>
  );
}
