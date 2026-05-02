import {
  Box,
  Typography,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
} from '@mui/material';
import { CLUBS } from '../utils/clubs';
import { hapticLight } from '../utils/haptics';

export default function ClubSelector({ selected, onChange }) {
  const toggle = (id) => {
    hapticLight();
    if (selected.includes(id)) {
      onChange(selected.filter((c) => c !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <Box>
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
        Select clubs for this session
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {CLUBS.map((club) => {
          const isSelected = selected.includes(club.id);
          return (
            <Chip
              key={club.id}
              label={club.label}
              onClick={() => toggle(club.id)}
              color={isSelected ? 'primary' : 'default'}
              variant={isSelected ? 'filled' : 'outlined'}
              sx={{
                borderColor: isSelected ? 'primary.main' : 'grey.300',
                fontWeight: isSelected ? 600 : 400,
                transition: 'all 0.15s ease',
              }}
            />
          );
        })}
      </Box>
    </Box>
  );
}
