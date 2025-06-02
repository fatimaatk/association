'use client';

import { Sparkles, Star, Clock, Shield, Zap, ArrowRight, Users, FileText, Search, Bell, BarChart, Headphones } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { TUser } from '@/context/UserContext';

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

export default function TarifContent({ user }: { user: TUser }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12 flex flex-col items-center">
      {user ? (
        <motion.div
          className="w-full max-w-4xl bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl overflow-hidden mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="p-4 sm:p-8 md:p-12">
            <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="p-2 sm:p-3 bg-[#00B074]/10 rounded-full">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-[#00B074]" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#004d3b]">Votre espace testeur</h2>
                <p className="text-sm sm:text-base text-gray-600">Merci de contribuer à l&apos;amélioration de FamEasy</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="p-3 sm:p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Votre statut</h3>
                <p className="text-[#00B074] font-medium text-sm sm:text-base">Testeur privilégié</p>
              </div>
              <div className="p-3 sm:p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Votre accès</h3>
                <p className="text-gray-600 text-sm sm:text-base">Accès illimité à toutes les fonctionnalités</p>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <h3 className="font-semibold text-gray-900 text-base sm:text-lg">Vos avantages exclusifs</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3 sm:p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                  <div className="p-2 bg-[#00B074]/10 rounded-lg w-fit mb-2 sm:mb-3">
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 text-[#00B074]" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1 text-sm sm:text-base">Accès anticipé</h4>
                  <p className="text-xs sm:text-sm text-gray-600">Découvrez les nouvelles fonctionnalités en avant-première</p>
                </div>
                <div className="p-3 sm:p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                  <div className="p-2 bg-[#00B074]/10 rounded-lg w-fit mb-2 sm:mb-3">
                    <Headphones className="w-4 h-4 sm:w-5 sm:h-5 text-[#00B074]" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1 text-sm sm:text-base">Support prioritaire</h4>
                  <p className="text-xs sm:text-sm text-gray-600">Une équipe dédiée à votre écoute</p>
                </div>
                <div className="p-3 sm:p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                  <div className="p-2 bg-[#00B074]/10 rounded-lg w-fit mb-2 sm:mb-3">
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-[#00B074]" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1 text-sm sm:text-base">Influence active</h4>
                  <p className="text-xs sm:text-sm text-gray-600">Participez à l&apos;évolution de FamEasy</p>
                </div>
              </div>
            </div>

            <div className="mt-6 sm:mt-8">
              <h3 className="font-semibold text-[#004d3b] mb-3 sm:mb-4 text-base sm:text-lg">Prochaines fonctionnalités</h3>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#00B074] rounded-full"></div>
                  <p className="text-sm sm:text-base text-gray-700">Tableau de bord personnalisé</p>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#00B074] rounded-full"></div>
                  <p className="text-sm sm:text-base text-gray-700">Export automatique des documents</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
              <Link
                href="/dashboard"
                className="flex-1 bg-[#00B074] text-white font-semibold py-2.5 sm:py-3 rounded-lg hover:bg-[#00965e] transition-colors text-center text-sm sm:text-base"
              >
                Accéder à mon espace
              </Link>
              <Link
                href="/contact"
                className="flex-1 border border-[#00B074] text-[#00B074] font-semibold py-2.5 sm:py-3 rounded-lg hover:bg-[#f0fef8] transition-colors text-center text-sm sm:text-base"
              >
                Nous faire part de vos retours
              </Link>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          className="text-center mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs sm:text-sm font-medium text-[#00B074] uppercase tracking-wide">
            ⚠️ Version bêta – Recherche d&apos;associations testeurs
          </p>
        </motion.div>
      )}

      <motion.div
        className="text-center mb-6 sm:mb-12 relative w-full"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#00B074]/5 to-transparent -z-10 rounded-3xl" />
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#004d3b] mb-2 sm:mb-4">
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          Rejoignez l'aventure FamEasy
        </h1>
        <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-2 sm:px-4">
          Nous recherchons des associations pour tester notre solution et nous aider à la rendre parfaite pour vous.
        </p>
      </motion.div>

      <motion.div
        className="bg-white w-full max-w-4xl rounded-2xl shadow-xl overflow-hidden mb-6 sm:mb-12 transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="p-4 sm:p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center justify-between mb-4 sm:mb-8">
            <div className="text-center md:text-left">
              <Image alt="logo" src="/FamEasy.svg" width={100} height={30} className="mx-auto md:mx-0" />
              <p className="text-sm sm:text-base text-gray-600 mt-2">La solution tout-en-un</p>
            </div>
            <motion.div
              className="text-center mt-4 md:mt-0"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="text-3xl sm:text-4xl font-bold text-[#00B074]">Gratuit</div>
              <div className="text-sm sm:text-base text-gray-600">Pendant la phase de test</div>
              <div className="text-xs sm:text-sm text-gray-500 mt-1">Prix prévu à terme : 12.99€/mois</div>
            </motion.div>
          </div>

          <motion.div
            className="flex items-center gap-2 mb-4 sm:mb-8 p-2 sm:p-4 bg-[#00B074]/10 rounded-lg border border-[#00B074]/20"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#00B074] flex-shrink-0" />
            <span className="text-[#00B074] font-medium text-xs sm:text-sm">
              Accès gratuit • Support prioritaire • Influencez le développement
            </span>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 mb-4 sm:mb-8"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-start gap-2 sm:gap-3 p-2 sm:p-4 rounded-lg hover:bg-gray-50 transition-colors"
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
              >
                <div className="p-1.5 sm:p-2 bg-[#00B074]/10 rounded-lg flex-shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-xs sm:text-sm">{feature.title}</h3>
                  <p className="text-gray-600 text-xs sm:text-sm">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {!user ? (
              <Link
                href="/inscription"
                className="block w-full text-center bg-[#00B074] text-white font-semibold py-2.5 sm:py-3 rounded-lg hover:bg-[#00965e] transition-colors group"
              >
                <span className="flex items-center justify-center gap-2 text-xs sm:text-sm">
                  Devenir testeur
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </motion.span>
                </span>
              </Link>
            ) : (
              <Link
                href="/dashboard"
                className="block w-full text-center bg-[#00B074] text-white font-semibold py-2.5 sm:py-3 rounded-lg hover:bg-[#00965e] transition-colors group"
              >
                <span className="flex items-center justify-center gap-2 text-xs sm:text-sm">
                  Accéder à mon espace
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </motion.span>
                </span>
              </Link>
            )}
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-12 w-full"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {benefits.map((benefit, index) => (
          <motion.div
            key={index}
            className="bg-white p-3 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            variants={scaleIn}
            whileHover={{ y: -5 }}
          >
            <div className="flex flex-col items-center text-center">
              <motion.div
                className="p-2 sm:p-4 bg-[#00B074]/10 rounded-full mb-3 sm:mb-4"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {benefit.icon}
              </motion.div>
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1 sm:mb-2">{benefit.title}</h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{benefit.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="bg-gray-50 rounded-2xl p-4 sm:p-8 md:p-12 w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <h3 className="text-lg sm:text-xl font-bold text-[#004d3b] mb-4 sm:mb-6 flex items-center gap-2">
          <motion.span
            className="p-1.5 sm:p-2 bg-[#00B074]/10 rounded-lg"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-[#00B074]" />
          </motion.span>
          Questions fréquentes
        </h3>
        <motion.div
          className="space-y-3 sm:space-y-4"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {[
            {
              question: "Comment devenir testeur ?",
              answer: "Contactez-nous via le formulaire de contact. Nous vous accompagnerons dans la mise en place de FamEasy et recueillerons vos retours pour améliorer la solution."
            },
            {
              question: "Quelles sont les conditions pour tester ?",
              answer: "Il suffit d'être une association et d'avoir envie de simplifier votre gestion administrative. Nous vous offrons un accès gratuit pendant la phase de test."
            },
            {
              question: "Comment sont protégées mes données ?",
              answer: "Vos données sont hébergées en France et sécurisées selon les normes RGPD. Nous effectuons des sauvegardes quotidiennes pour garantir leur sécurité."
            },
            {
              question: "Puis-je personnaliser les documents générés ?",
              answer: "Oui, vous pouvez personnaliser tous vos documents (attestations, reçus, etc.) avec les informations de votre association (nom, adresse, SIRET, téléphone). Les documents sont générés automatiquement avec une mise en page professionnelle."
            },
            {
              question: "Comment fonctionne le support ?",
              answer: "Notre équipe est disponible du lundi au vendredi de 9h à 18h. Vous pouvez nous contacter par email ou via le formulaire de contact."
            },
            {
              question: "Comment FamEasy aide-t-il les bénévoles ?",
              answer: "FamEasy automatise les tâches administratives répétitives, permet la gestion collaborative et offre des outils intuitifs pour que les bénévoles puissent se concentrer sur l'essentiel : leur mission associative."
            }
          ].map((faq, index) => (
            <motion.div
              key={index}
              className="p-2 sm:p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
              variants={fadeInUp}
              whileHover={{ scale: 1.01 }}
            >
              <h4 className="font-semibold text-gray-900 mb-1 text-xs sm:text-sm">{faq.question}</h4>
              <p className="text-gray-600 text-xs sm:text-sm">{faq.answer}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
} 