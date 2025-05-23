'use client';

import { Sparkles, Star, Clock, Shield, Zap, ArrowRight, Users, FileText, Search, Bell, BarChart, Headphones } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const features = [
  {
    icon: <Users className="w-6 h-6 text-[#00B074]" />,
    title: "Gestion complète des familles",
    description: "Gérez facilement vos adhérents et leurs informations"
  },
  {
    icon: <FileText className="w-6 h-6 text-[#00B074]" />,
    title: "Export PDF et Excel",
    description: "Générez tous vos documents en quelques clics"
  },
  {
    icon: <Search className="w-6 h-6 text-[#00B074]" />,
    title: "Filtres et recherche avancée",
    description: "Trouvez rapidement les informations dont vous avez besoin"
  },
  {
    icon: <Bell className="w-6 h-6 text-[#00B074]" />,
    title: "Relances manuelles",
    description: "Suivez les paiements et envoyez des relances personnalisées"
  },
  {
    icon: <BarChart className="w-6 h-6 text-[#00B074]" />,
    title: "Statistiques détaillées",
    description: "Visualisez l'activité de votre association"
  },
  {
    icon: <Headphones className="w-6 h-6 text-[#00B074]" />,
    title: "Support prioritaire",
    description: "Une équipe à votre écoute pour vous accompagner"
  }
];

const benefits = [
  {
    icon: <Star className="w-6 h-6 text-[#00B074]" />,
    title: "Solution complète",
    description: "Tous les outils nécessaires pour gérer votre association"
  },
  {
    icon: <Clock className="w-6 h-6 text-[#00B074]" />,
    title: "Gain de temps",
    description: "Automatisez les tâches répétitives"
  },
  {
    icon: <Shield className="w-6 h-6 text-[#00B074]" />,
    title: "Sécurité garantie",
    description: "Vos données sont protégées et sauvegardées"
  },
  {
    icon: <Zap className="w-6 h-6 text-[#00B074]" />,
    title: "Mises à jour régulières",
    description: "Bénéficiez des dernières fonctionnalités"
  }
];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const scaleIn = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { duration: 0.5 }
};

export default function TarifContent() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col items-center">
      <motion.div
        className="text-center mb-8 sm:mb-16 relative w-full"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#00B074]/5 to-transparent -z-10 rounded-3xl" />
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#004d3b] mb-3 sm:mb-4">
          Un prix unique pour toutes les associations
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
          Notre mission : simplifier la vie des bénévoles et rendre la gestion associative accessible à tous.
        </p>
      </motion.div>

      <motion.div
        className="bg-white w-full max-w-4xl rounded-2xl shadow-xl overflow-hidden mb-8 sm:mb-16 transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="p-6 sm:p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center justify-between mb-6 sm:mb-8">
            <div className="text-center md:text-left">
              <Image alt="logo" src="/FamEasy.svg" width={120} height={40} className="mx-auto md:mx-0" />
              <p className="text-gray-600 text-base sm:text-lg mt-2">La solution tout-en-un</p>
            </div>
            <motion.div
              className="text-center mt-4 md:mt-0"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="text-4xl sm:text-5xl font-bold text-[#00B074]">12.99€</div>
              <div className="text-gray-600 text-sm sm:text-base">/ mois</div>
            </motion.div>
          </div>

          <motion.div
            className="flex items-center gap-2 mb-6 sm:mb-8 p-3 sm:p-4 bg-[#00B074]/10 rounded-lg border border-[#00B074]/20"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Sparkles className="w-5 h-5 text-[#00B074] flex-shrink-0" />
            <span className="text-[#00B074] font-medium text-sm sm:text-base">
              1 mois d&apos;essai gratuit • Aucun engagement • Prix unique quel que soit votre taille
            </span>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-start gap-3 p-3 sm:p-4 rounded-lg hover:bg-gray-50 transition-colors"
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
              >
                <div className="p-2 bg-[#00B074]/10 rounded-lg flex-shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{feature.title}</h3>
                  <p className="text-gray-600 text-xs sm:text-sm">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href="#"
              className="block w-full text-center bg-[#00B074] text-white font-semibold py-3 sm:py-4 rounded-lg hover:bg-[#00965e] transition-colors group"
            >
              <span className="flex items-center justify-center gap-2 text-sm sm:text-base">
                Commencer l&apos;essai gratuit
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.span>
              </span>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 mb-8 sm:mb-16 w-full"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {benefits.map((benefit, index) => (
          <motion.div
            key={index}
            className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            variants={scaleIn}
            whileHover={{ y: -5 }}
          >
            <div className="flex flex-col items-center text-center">
              <motion.div
                className="p-3 sm:p-4 bg-[#00B074]/10 rounded-full mb-4"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {benefit.icon}
              </motion.div>
              <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-2">{benefit.title}</h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{benefit.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="bg-gray-50 rounded-2xl p-6 sm:p-8 md:p-12 w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <h3 className="text-xl sm:text-2xl font-bold text-[#004d3b] mb-6 sm:mb-8 flex items-center gap-2">
          <motion.span
            className="p-2 bg-[#00B074]/10 rounded-lg"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#00B074]" />
          </motion.span>
          Questions fréquentes
        </h3>
        <motion.div
          className="space-y-4 sm:space-y-6"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {[
            {
              question: "Pourquoi un prix unique ?",
              answer: "Nous croyons que toutes les associations méritent les mêmes outils, quelle que soit leur taille. Notre prix unique de 12.99€/mois permet à toutes les structures d'accéder à une solution complète."
            },
            {
              question: "Comment fonctionne l'essai gratuit ?",
              answer: "Commencez votre essai gratuit sans carte bancaire. Vous pourrez ajouter vos informations de paiement à la fin de la période d'essai si vous souhaitez continuer."
            },
            {
              question: "Puis-je annuler à tout moment ?",
              answer: "Oui, vous pouvez annuler votre abonnement à tout moment depuis votre espace client. Aucun engagement n'est requis."
            },
            {
              question: "Comment sont protégées mes données ?",
              answer: "Vos données sont hébergées en France et sécurisées selon les normes RGPD. Nous effectuons des sauvegardes quotidiennes pour garantir leur sécurité."
            },
            {
              question: "Puis-je personnaliser les documents générés ?",
              answer: "Oui, vous pouvez personnaliser tous les documents (attestations, reçus, etc.) avec votre logo et vos informations d'association."
            },
            {
              question: "Comment fonctionne le support ?",
              answer: "Notre équipe est disponible du lundi au vendredi de 9h à 18h. Vous pouvez nous contacter par email ou via le chat intégré à l'application."
            },
            {
              question: "Y a-t-il des frais cachés ?",
              answer: "Non, le prix affiché est le prix final. Aucun frais supplémentaire ne sera appliqué. Toutes les fonctionnalités sont incluses dans l'abonnement."
            },
            {
              question: "Comment FamEasy aide-t-il les bénévoles ?",
              answer: "FamEasy automatise les tâches administratives répétitives, permet la gestion collaborative et offre des outils intuitifs pour que les bénévoles puissent se concentrer sur l'essentiel : leur mission associative."
            }
          ].map((faq, index) => (
            <motion.div
              key={index}
              className="p-3 sm:p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
              variants={fadeInUp}
              whileHover={{ scale: 1.01 }}
            >
              <h4 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">{faq.question}</h4>
              <p className="text-gray-600 text-xs sm:text-sm">{faq.answer}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
} 