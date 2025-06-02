'use client';

import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { TUser } from '@/context/UserContext';

interface HomeBannerProps {
  variant?: 'primary' | 'secondary';
  className?: string;
  user: TUser | null;
}

export default function HomeBanner({ variant = 'primary', className = '', user }: HomeBannerProps) {
  const isPrimary = variant === 'primary';


  const bannerContent = user ? {
    badge: 'Testeur actif',
    title: "Bienvenue dans l'aventure FamEasy",
    description: 'Merci de faire partie de nos testeurs privilégiés. Votre retour est précieux pour améliorer FamEasy.',
    buttonText: 'Accéder à mon espace',
    buttonLink: '/dashboard'
  } : {
    badge: 'Nouveau',
    title: "Rejoignez l'aventure FamEasy",
    description: 'Nous recherchons des associations pour tester notre solution et nous aider à la rendre parfaite pour vous.',
    buttonText: 'Devenir testeur',
    buttonLink: '/tarif'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`relative overflow-hidden rounded-2xl ${className}`}
    >
      <div className={`absolute inset-0 ${isPrimary ? 'bg-gradient-to-br from-[#00B074] to-[#00965e]' : 'bg-gradient-to-br from-white to-gray-50'} -z-10`} />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 -z-10 border" />

      <div className="relative px-6 py-8 sm:px-8 sm:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-center md:text-left">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm"
              >
                <Sparkles className={`w-4 h-4 ${isPrimary ? 'text-white' : 'text-[#00B074]'}`} />
                <span className={`text-sm font-medium ${isPrimary ? 'text-white' : 'text-[#00B074]'}`}>
                  {bannerContent.badge}
                </span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-4 ${isPrimary ? 'text-white' : 'text-gray-900'}`}
              >
                {bannerContent.title}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className={`text-lg mb-6 ${isPrimary ? 'text-white/90' : 'text-gray-600'}`}
              >
                {bannerContent.description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Link
                  href={bannerContent.buttonLink}
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${isPrimary
                    ? 'bg-white text-[#00B074] hover:bg-white/90'
                    : 'bg-[#00B074] text-white hover:bg-[#00965e]'
                    }`}
                >
                  {bannerContent.buttonText}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="hidden md:block relative"
            >
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