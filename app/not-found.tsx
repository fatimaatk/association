"use client";

import Link from "next/link";
import { FileQuestion, Home } from "lucide-react";
import PublicLayout from "./component/layout/PublicLayout";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getUserFromClientCookies } from "@/lib/auth";
import { JwtPayload } from "jsonwebtoken";
import { TUser } from "@/context/UserContext";

export default function NotFound() {
  const [user, setUser] = useState<JwtPayload | null>(null);

  useEffect(() => {
    const userData = getUserFromClientCookies();
    setUser(userData);
  }, []);

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
              <div className="absolute inset-0 bg-[#00B074]/10 rounded-full blur-xl"></div>
              <FileQuestion className="w-20 h-20 text-[#00B074] relative z-10" />
            </div>
          </motion.div>

          <motion.h1
            className="text-4xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            404
          </motion.h1>

          <motion.h2
            className="text-2xl font-semibold text-gray-800 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Page non trouvée
          </motion.h2>

          <motion.p
            className="text-gray-600 mb-8 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Désolé, la page que vous recherchez n&apos;existe pas ou a été déplacée.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#00B074] text-white rounded-xl hover:bg-[#01965e] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
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