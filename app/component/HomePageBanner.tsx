'use client';

import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface HomePageBannerProps {
  variant?: 'primary' | 'secondary';
  className?: string;
}

export default function HomePageBanner({ variant = 'primary', className = '' }: HomePageBannerProps) {
  const isPrimary = variant === 'primary';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`relative overflow-hidden rounded-2xl ${className}`}
    >
      {/* Fond avec dégradé et motif */}
      <div className={`absolute inset-0 ${isPrimary ? 'bg-gradient-to-br from-[#00B074] to-[#00965e]' : 'bg-gradient-to-br from-white to-gray-50'} -z-10`} />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 -z-10 border" />

      {/* Contenu */}
      <div className="relative px-6 py-8 sm:px-8 sm:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Texte */}
            <div className="flex-1 text-center md:text-left">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm"
              >
                <Sparkles className={`w-4 h-4 ${isPrimary ? 'text-white' : 'text-[#00B074]'}`} />
                <span className={`text-sm font-medium ${isPrimary ? 'text-white' : 'text-[#00B074]'}`}>
                  Nouveau
                </span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-4 ${isPrimary ? 'text-white' : 'text-gray-900'}`}
              >
                Une solution unique pour toutes les associations
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className={`text-lg mb-6 ${isPrimary ? 'text-white/90' : 'text-gray-600'}`}
              >
                Un prix unique de 9.99€ HT/mois, quel que soit votre nombre d&apos;adhérents.
                <br className="hidden sm:block" />
                Pour soutenir le travail des bénévoles et simplifier la gestion associative.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Link
                  href="/tarif"
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${isPrimary
                    ? 'bg-white text-[#00B074] hover:bg-white/90'
                    : 'bg-[#00B074] text-white hover:bg-[#00965e]'
                    }`}
                >
                  Découvrir le tarif unique
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>

            {/* Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="hidden md:block relative"
            >
              {/* Bulle principale */}
              <motion.div
                className={`w-40 h-40 rounded-2xl ${isPrimary ? 'bg-white/10' : 'bg-[#00B074]/10'} backdrop-blur-sm flex items-center justify-center`}
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [0, 2, -2, 0]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Sparkles className={`w-20 h-20 ${isPrimary ? 'text-white' : 'text-[#00B074]'}`} />
                </motion.div>
              </motion.div>

              {/* Bulle supérieure droite */}
              <motion.div
                className={`absolute -top-4 -right-4 w-20 h-20 rounded-full ${isPrimary ? 'bg-white/10' : 'bg-[#00B074]/10'} backdrop-blur-sm`}
                animate={{
                  y: [0, -8, 0],
                  x: [0, 4, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.2
                }}
              />

              {/* Bulle inférieure gauche */}
              <motion.div
                className={`absolute -bottom-4 -left-4 w-16 h-16 rounded-full ${isPrimary ? 'bg-white/10' : 'bg-[#00B074]/10'} backdrop-blur-sm`}
                animate={{
                  y: [0, 8, 0],
                  x: [0, -4, 0],
                  scale: [1, 1.15, 1]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.4
                }}
              />

              {/* Nouvelles bulles décoratives */}
              <motion.div
                className={`absolute top-1/2 -right-8 w-12 h-12 rounded-full ${isPrimary ? 'bg-white/10' : 'bg-[#00B074]/10'} backdrop-blur-sm`}
                animate={{
                  y: [0, -12, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.6
                }}
              />

              <motion.div
                className={`absolute -bottom-8 left-1/3 w-10 h-10 rounded-full ${isPrimary ? 'bg-white/10' : 'bg-[#00B074]/10'} backdrop-blur-sm`}
                animate={{
                  y: [0, 10, 0],
                  x: [0, -6, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 5.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.8
                }}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 