import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Legend,
} from 'recharts';
import { Box, Typography } from '@mui/material';
import { getClubLabel } from '../utils/clubs';

function calcAvg(swings) {
  if (!swings?.length) return 0;
  return Math.round(swings.reduce((a, b) => a + b, 0) / swings.length);
}

const COLORS = [
  '#2D6A4F', '#40916C', '#52B788', '#74C69D',
  '#95D5B2', '#1B4332', '#081C15', '#D8F3DC',
];

export function SingleClubChart({ clubId, swings, height = 220 }) {
  if (!swings?.length) return null;
  const avg = calcAvg(swings);
  const data = swings.map((dist, i) => ({ swing: i + 1, distance: dist }));

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="caption" color="text.secondary" sx={{ pl: 1 }}>
        Avg: {avg} yds
      </Typography>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
          <XAxis
            dataKey="swing"
            tick={{ fontSize: 11, fill: '#757575' }}
            label={{ value: 'Swing #', position: 'insideBottomRight', offset: -4, fontSize: 11, fill: '#9E9E9E' }}
          />
          <YAxis tick={{ fontSize: 11, fill: '#757575' }} unit=" yd" />
          <Tooltip
            formatter={(v) => [`${v} yds`, 'Distance']}
            labelFormatter={(l) => `Swing ${l}`}
            contentStyle={{ borderRadius: 8, fontSize: 12 }}
          />
          <ReferenceLine
            y={avg}
            stroke="#9E9E9E"
            strokeDasharray="4 4"
            strokeOpacity={0.7}
            label={{ value: `Avg ${avg}`, position: 'right', fontSize: 10, fill: '#9E9E9E' }}
          />
          <Line
            type="monotone"
            dataKey="distance"
            stroke="#2D6A4F"
            strokeWidth={2}
            dot={{ r: 4, fill: '#2D6A4F', strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}

export function MultiClubChart({ swingsMap, height = 280 }) {
  const clubIds = Object.keys(swingsMap || {}).filter((k) => swingsMap[k]?.length > 0);
  if (!clubIds.length) return null;

  const maxLen = Math.max(...clubIds.map((id) => swingsMap[id].length));
  const data = Array.from({ length: maxLen }, (_, i) => {
    const point = { swing: i + 1 };
    clubIds.forEach((id) => {
      if (swingsMap[id][i] != null) point[id] = swingsMap[id][i];
    });
    return point;
  });

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
        <XAxis dataKey="swing" tick={{ fontSize: 11, fill: '#757575' }} />
        <YAxis tick={{ fontSize: 11, fill: '#757575' }} unit=" yd" />
        <Tooltip
          formatter={(v, name) => [`${v} yds`, getClubLabel(name)]}
          labelFormatter={(l) => `Swing ${l}`}
          contentStyle={{ borderRadius: 8, fontSize: 12 }}
        />
        <Legend formatter={(val) => getClubLabel(val)} iconSize={10} wrapperStyle={{ fontSize: 11 }} />
        {clubIds.map((id, idx) => (
          <Line
            key={id}
            type="monotone"
            dataKey={id}
            stroke={COLORS[idx % COLORS.length]}
            strokeWidth={2}
            dot={{ r: 3, strokeWidth: 0 }}
            connectNulls
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

export function AverageComparisonChart({ sessions, height = 300 }) {
  const clubAverages = {};

  sessions.forEach((session) => {
    Object.entries(session.swings || {}).forEach(([clubId, swings]) => {
      if (!swings?.length) return;
      const avg = calcAvg(swings);
      if (!clubAverages[clubId]) clubAverages[clubId] = [];
      clubAverages[clubId].push({ sessionId: session.id, date: session.date, avg });
    });
  });

  const clubIds = Object.keys(clubAverages);
  if (!clubIds.length) return null;

  const data = clubIds.map((id) => {
    const avgs = clubAverages[id].map((e) => e.avg);
    const overall = Math.round(avgs.reduce((a, b) => a + b, 0) / avgs.length);
    return { club: getClubLabel(id), average: overall, clubId: id };
  });

  data.sort((a, b) => b.average - a.average);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 16, left: -8, bottom: 40 }}>
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
          formatter={(v) => [`${v} yds`, 'Avg Distance']}
          contentStyle={{ borderRadius: 8, fontSize: 12 }}
        />
        <Line
          type="monotone"
          dataKey="average"
          stroke="#2D6A4F"
          strokeWidth={2.5}
          dot={{ r: 5, fill: '#2D6A4F', strokeWidth: 0 }}
          activeDot={{ r: 7 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
