'use client';

import { motion } from 'framer-motion';
import { UserCheck, UserX, UserMinus } from 'lucide-react';

type StatutMembre = 'ACTIF' | 'INACTIF' | 'ARCHIVE';

interface StatutBadgeProps {
  statut: StatutMembre;
}

const statutConfig = {
  ACTIF: {
    color: 'bg-green-100 text-green-800',
    icon: UserCheck,
    label: 'Actif'
  },
  INACTIF: {
    color: 'bg-yellow-100 text-yellow-800',
    icon: UserMinus,
    label: 'Inactif'
  },
  ARCHIVE: {
    color: 'bg-red-100 text-red-800',
    icon: UserX,
    label: 'ARCHIVE'
  }
};

export default function StatutBadge({ statut }: StatutBadgeProps) {
  const config = statutConfig[statut];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${config.color}`}
    >
      <Icon className="w-4 h-4" />
      <span className="text-sm font-medium">{config.label}</span>
    </motion.div>
  );
} 