import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  ToggleButtonGroup,
  ToggleButton,
  Divider,
  Alert,
} from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import TimelineIcon from '@mui/icons-material/Timeline';
import { getClubLabel, CLUBS } from '../utils/clubs';
import { SingleClubChart, MultiClubChart, AverageComparisonChart } from './SwingChart';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import { hapticLight } from '../utils/haptics';

function calcAvg(arr) {
  if (!arr?.length) return 0;
  return Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
}

function calcMax(arr) {
  if (!arr?.length) return 0;
  return Math.max(...arr);
}

function ClubTrendChart({ clubId, sessions }) {
  const data = sessions
    .filter((s) => s.swings[clubId]?.length > 0)
    .map((s, idx) => ({
      session: `S${idx + 1}`,
      avg: calcAvg(s.swings[clubId]),
      max: calcMax(s.swings[clubId]),
      date: new Date(s.date).toLocaleDateString([], { month: 'short', day: 'numeric' }),
    }))
    .reverse();

  if (!data.length) return null;

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
        <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#757575' }} />
        <YAxis tick={{ fontSize: 11, fill: '#757575' }} unit=" yd" />
        <Tooltip
          formatter={(v, name) => [`${v} yds`, name === 'avg' ? 'Average' : 'Best']}
          labelFormatter={(l) => l}
          contentStyle={{ borderRadius: 8, fontSize: 12 }}
        />
        <Legend formatter={(val) => (val === 'avg' ? 'Average' : 'Best')} iconSize={10} wrapperStyle={{ fontSize: 11 }} />
        <Line
          type="monotone"
          dataKey="avg"
          stroke="#2D6A4F"
          strokeWidth={2}
          dot={{ r: 4, fill: '#2D6A4F', strokeWidth: 0 }}
        />
        <Line
          type="monotone"
          dataKey="max"
          stroke="#74C69D"
          strokeWidth={2}
          strokeDasharray="4 3"
          dot={{ r: 3, fill: '#74C69D', strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

function OverviewStats({ sessions }) {
  const clubStats = {};
  sessions.forEach((s) => {
    Object.entries(s.swings || {}).forEach(([clubId, swings]) => {
      if (!swings?.length) return;
      if (!clubStats[clubId]) clubStats[clubId] = { swings: [], sessions: 0 };
      clubStats[clubId].swings.push(...swings);
      clubStats[clubId].sessions++;
    });
  });

  const data = Object.entries(clubStats)
    .map(([id, { swings, sessions: sc }]) => ({
      club: getClubLabel(id),
      clubId: id,
      avg: calcAvg(swings),
      max: calcMax(swings),
      total: swings.length,
      sessions: sc,
    }))
    .sort((a, b) => b.avg - a.avg);

  if (!data.length) return null;

  return (
    <Box>
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
        Average Distance by Club (all time)
      </Typography>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
          <XAxis
            dataKey="club"
            tick={{ fontSize: 10, fill: '#757575' }}
            angle={-40}
            textAnchor="end"
            interval={0}
          />
          <YAxis tick={{ fontSize: 11, fill: '#757575' }} unit=" yd" />
          <Tooltip
            formatter={(v, name) => [`${v} yds`, name === 'avg' ? 'Average' : 'Best']}
            contentStyle={{ borderRadius: 8, fontSize: 12 }}
          />
          <Bar dataKey="avg" fill="#2D6A4F" radius={[4, 4, 0, 0]} name="avg" />
          <Bar dataKey="max" fill="#95D5B2" radius={[4, 4, 0, 0]} name="max" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}

export default function GraphsTab({ sessions }) {
  const [view, setView] = useState('overview');
  const [selectedClub, setSelectedClub] = useState('');

  const clubsWithData = CLUBS.filter((c) =>
    sessions.some((s) => s.swings[c.id]?.length > 0)
  );

  const handleViewChange = (_, val) => {
    if (val) {
      hapticLight();
      setView(val);
    }
  };

  if (!sessions.length) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <BarChartIcon sx={{ fontSize: 56, color: 'grey.400', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No data yet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Complete sessions to see your performance analytics.
        </Typography>
      </Box>
    );
  }

  const totalSwings = sessions.reduce(
    (sum, s) => sum + Object.values(s.swings).reduce((a, arr) => a + arr.length, 0),
    0
  );

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 0.5 }}>
        Analytics
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {sessions.length} sessions &bull; {totalSwings} total swings
      </Typography>

      <ToggleButtonGroup
        value={view}
        exclusive
        onChange={handleViewChange}
        size="small"
        fullWidth
        sx={{ mb: 2 }}
      >
        <ToggleButton value="overview" sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.8rem' }}>
          Overview
        </ToggleButton>
        <ToggleButton value="club" sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.8rem' }}>
          By Club
        </ToggleButton>
        <ToggleButton value="session" sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.8rem' }}>
          Latest Session
        </ToggleButton>
      </ToggleButtonGroup>

      {view === 'overview' && (
        <Stack spacing={2}>
          <Card>
            <CardContent>
              <OverviewStats sessions={sessions} />
            </CardContent>
          </Card>
        </Stack>
      )}

      {view === 'club' && (
        <Stack spacing={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Select Club</InputLabel>
            <Select
              value={selectedClub}
              label="Select Club"
              onChange={(e) => {
                hapticLight();
                setSelectedClub(e.target.value);
              }}
            >
              {clubsWithData.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedClub ? (
            <Card>
              <CardContent>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 0.5 }}>
                  {getClubLabel(selectedClub)} — Performance Over Time
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Average and best distance per session
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <ClubTrendChart clubId={selectedClub} sessions={sessions} />
                </Box>
              </CardContent>
            </Card>
          ) : (
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              Select a club to view its performance trend across sessions.
            </Alert>
          )}
        </Stack>
      )}

      {view === 'session' && (
        <Stack spacing={2}>
          {sessions.slice(0, 1).map((s) => {
            const clubs = s.clubs.filter((c) => s.swings[c]?.length > 0);
            const dateLabel = new Date(s.date).toLocaleDateString([], {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            });
            return (
              <Box key={s.id}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  {dateLabel}
                </Typography>
                {clubs.length === 0 ? (
                  <Alert severity="info" sx={{ borderRadius: 2 }}>
                    No swings recorded in the latest session.
                  </Alert>
                ) : (
                  <Stack spacing={2}>
                    {clubs.map((clubId) => (
                      <Card key={clubId}>
                        <CardContent>
                          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 0.5 }}>
                            {getClubLabel(clubId)}
                          </Typography>
                          <SingleClubChart clubId={clubId} swings={s.swings[clubId]} height={200} />
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                )}
              </Box>
            );
          })}
        </Stack>
      )}
    </Box>
  );
}
