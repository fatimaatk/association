"use client";

import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import PublicLayout from "./component/layout/PublicLayout";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getUserFromClientCookies } from "@/lib/auth";
import { JwtPayload } from "jsonwebtoken";
import { TUser } from "@/context/UserContext";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [user, setUser] = useState<JwtPayload | null>(null);

  useEffect(() => {
    const userData = getUserFromClientCookies();
    setUser(userData);
  }, []);

  console.error(error);

  return (
    <PublicLayout utilisateur={user as TUser}>
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-16 bg-gradient-to-b from-white to-gray-50">
        <motion.div
          className="text-center max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="flex justify-center mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2
            }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/10 rounded-full blur-xl"></div>
              <AlertTriangle className="w-20 h-20 text-red-500 relative z-10" />
            </div>
          </motion.div>

          <motion.h1
            className="text-4xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Oups !
          </motion.h1>

          <motion.h2
            className="text-2xl font-semibold text-gray-800 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Une erreur est survenue
          </motion.h2>

          <motion.p
            className="text-gray-600 mb-8 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Désolé, une erreur inattendue s&apos;est produite. Veuillez réessayer ou retourner à l&apos;accueil.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <button
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#00B074] text-white rounded-xl hover:bg-[#01965e] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <RefreshCw className="w-5 h-5" />
              Réessayer
            </button>

            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Home className="w-5 h-5" />
              Retour à l&apos;accueil
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </PublicLayout>
  );
} 