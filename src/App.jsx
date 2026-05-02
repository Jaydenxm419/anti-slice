import { useState } from 'react';
import {
  Box,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  AppBar,
  Toolbar,
  Typography,
} from '@mui/material';
import SportsGolfIcon from '@mui/icons-material/SportsGolf';
import HistoryIcon from '@mui/icons-material/History';
import BarChartIcon from '@mui/icons-material/BarChart';
import { useStorage } from './hooks/useStorage';
import SessionManagement from './components/SessionManagement';
import HistoricalSessions from './components/HistoricalSessions';
import GraphsTab from './components/GraphsTab';
import { hapticLight } from './utils/haptics';

const TABS = [
  { label: 'Session', icon: <SportsGolfIcon /> },
  { label: 'History', icon: <HistoryIcon /> },
  { label: 'Analytics', icon: <BarChartIcon /> },
];

export default function App() {
  const [tab, setTab] = useState(0);
  const { sessions, addSession, updateSession, deleteSession } = useStorage();

  const handleTabChange = (_, val) => {
    hapticLight();
    setTab(val);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100dvh',
        bgcolor: 'background.default',
        maxWidth: 480,
        mx: 'auto',
        position: 'relative',
      }}
    >
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'primary.main',
          borderBottom: '1px solid',
          borderColor: 'primary.dark',
        }}
      >
        <Toolbar sx={{ minHeight: '52px !important' }}>
          <SportsGolfIcon sx={{ mr: 1, fontSize: 22 }} />
          <Typography variant="h6" fontWeight={700} sx={{ letterSpacing: '-0.3px' }}>
            Anti-Slice
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ flex: 1, overflow: 'auto', p: 2, pb: 9 }}>
        {tab === 0 && (
          <SessionManagement
            sessions={sessions}
            addSession={addSession}
            updateSession={updateSession}
          />
        )}
        {tab === 1 && (
          <HistoricalSessions sessions={sessions} deleteSession={deleteSession} />
        )}
        {tab === 2 && <GraphsTab sessions={sessions} />}
      </Box>

      <Paper
        elevation={8}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: 480,
          zIndex: 100,
        }}
      >
        <BottomNavigation value={tab} onChange={handleTabChange}>
          {TABS.map((t, i) => (
            <BottomNavigationAction key={i} label={t.label} icon={t.icon} />
          ))}
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
