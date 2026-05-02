export const CLUBS = [
  { id: 'driver', label: 'Driver', abbr: 'DR' },
  { id: '3-wood', label: '3-Wood', abbr: '3W' },
  { id: '5-wood', label: '5-Wood', abbr: '5W' },
  { id: '3-hybrid', label: '3-Hybrid', abbr: '3H' },
  { id: '4-hybrid', label: '4-Hybrid', abbr: '4H' },
  { id: '4-iron', label: '4-Iron', abbr: '4i' },
  { id: '5-iron', label: '5-Iron', abbr: '5i' },
  { id: '6-iron', label: '6-Iron', abbr: '6i' },
  { id: '7-iron', label: '7-Iron', abbr: '7i' },
  { id: '8-iron', label: '8-Iron', abbr: '8i' },
  { id: '9-iron', label: '9-Iron', abbr: '9i' },
  { id: 'pw', label: 'Pitching Wedge', abbr: 'PW' },
  { id: 'gw', label: 'Gap Wedge', abbr: 'GW' },
  { id: 'sw', label: 'Sand Wedge', abbr: 'SW' },
  { id: 'lw', label: 'Lob Wedge', abbr: 'LW' },
  { id: 'putter', label: 'Putter', abbr: 'PT' },
];

export function getClub(id) {
  return CLUBS.find((c) => c.id === id);
}

export function getClubLabel(id) {
  return getClub(id)?.label ?? id;
}

export function getClubAbbr(id) {
  return getClub(id)?.abbr ?? id;
}
