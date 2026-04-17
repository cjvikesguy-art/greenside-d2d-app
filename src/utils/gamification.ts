import type { ActionType } from '../components/KnockBar';

export const XP_VALUES: Record<ActionType, number> = {
  notHome: 1,
  notInterested: 2,
  lead: 50,
  sale: 200
};

export const calculateXP = (stats: Record<ActionType, number>): number => {
  return (
    (stats.notHome * XP_VALUES.notHome) +
    (stats.notInterested * XP_VALUES.notInterested) +
    (stats.lead * XP_VALUES.lead) +
    (stats.sale * XP_VALUES.sale)
  );
};
