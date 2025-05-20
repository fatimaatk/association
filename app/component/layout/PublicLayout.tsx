'use client'

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { TUser } from "@/context/UserContext";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PublicLayout({
  children,
  utilisateur,
}: {
  children: React.ReactNode;
  utilisateur?: TUser;
}) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
    } catch (error) {
      console.error("Erreur de déconnexion", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fefefe]">
      {/* Header */}
      <header className="w-full fixed shadow-sm border-b border-gray-100 bg-white z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-4">
          <Link href="/" className="flex flex-col pt-2">
            <Image alt="logo" src={"/FamEasy.svg"} width={150} height={50} />
            <h1 className="text-gray-500 text-sm mt-2">Gérer. Suivre. Simplifier.</h1>
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden focus:outline-none"
            aria-label="Menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Desktop Menu */}
          <nav className="hidden md:flex gap-4 items-center text-sm font-medium">
            <Link href="/" className="text-gray-700 hover:text-[#00B074] px-3 py-2 rounded transition">Accueil</Link>
            <Link href="/tarif" className="text-gray-700 hover:text-[#00B074] px-3 py-2 rounded transition">Tarif</Link>
            <Link href="/a-propos" className="text-gray-700 hover:text-[#00B074] px-3 py-2 rounded transition">À propos</Link>
            <Link href="/contact" className="text-gray-700 hover:text-[#00B074] px-3 py-2 rounded transition">Contact</Link>
            {!utilisateur ? (
              <>
                <Link href="/connexion" className="border border-[#00B074] text-[#00B074] px-4 py-2 rounded-md hover:bg-[#f0fef8] transition">Connexion</Link>
                <Link href="/inscription" className="bg-[#00B074] text-white px-4 py-2 rounded-md hover:bg-[#009a66] transition">Créer une association</Link>
              </>
            ) : (
              <>
                <Link href="/dashboard" className="border border-[#00B074] text-[#00B074] px-4 py-2 rounded-md hover:bg-[#f0fef8] transition">Mon compte</Link>
                <button
                  onClick={handleLogout}
                  className="border border-gray-800 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-800 hover:text-white transition"
                >
                  Déconnexion
                </button>
              </>
            )}
          </nav>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <AnimatePresence>
            <motion.div
              key="mobile-menu-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black bg-opacity-40"
              onClick={() => setMenuOpen(false)}
              aria-label="Fermer le menu"
            />
            <motion.nav
              key="mobile-menu"
              initial={{ y: -40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -40, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-lg px-6 py-6 space-y-4 rounded-b-2xl"
              style={{ maxWidth: "100vw" }}
              tabIndex={-1}
              aria-label="Menu mobile"
            >
              <div className="flex justify-between items-center">

                <button
                  onClick={() => setMenuOpen(false)}
                  className="absolute right-4 top-4 text-gray-500 hover:text-[#00B074] focus:outline-none"
                  aria-label="Fermer le menu"
                >
                  <X className="w-7 h-7" />
                </button>
                <div>

                  <Image alt="logo" src={"/FamEasy.svg"} width={150} height={50} />
                  <h1 className="text-gray-500 text-sm mt-2">Gérer. Suivre. Simplifier.</h1>
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-4">
                <Link
                  href="/"
                  onClick={() => setMenuOpen(false)}
                  className="block text-lg font-medium text-gray-700 hover:text-[#00B074] py-2 rounded transition"
                >
                  Accueil
                </Link>
                <Link
                  href="/tarif"
                  onClick={() => setMenuOpen(false)}
                  className="block text-lg font-medium text-gray-700 hover:text-[#00B074] py-2 rounded transition"
                >
                  Tarif
                </Link>
                <Link
                  href="/a-propos"
                  onClick={() => setMenuOpen(false)}
                  className="block text-lg font-medium text-gray-700 hover:text-[#00B074] py-2 rounded transition"
                >
                  À propos
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setMenuOpen(false)}
                  className="block text-lg font-medium text-gray-700 hover:text-[#00B074] py-2 rounded transition"
                >
                  Contact
                </Link>
                {!utilisateur ? (
                  <>
                    <Link
                      href="/connexion"
                      onClick={() => setMenuOpen(false)}
                      className="block border border-[#00B074] text-[#00B074] font-semibold text-lg px-4 py-2 rounded-md mt-2 text-center hover:bg-[#f0fef8] transition"
                    >
                      Connexion
                    </Link>
                    <Link
                      href="/inscription"
                      onClick={() => setMenuOpen(false)}
                      className="block bg-[#00B074] text-white font-semibold text-lg px-4 py-2 rounded-md mt-2 text-center hover:bg-[#009a66] transition"
                    >
                      Créer une association
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="block border border-[#00B074] text-[#00B074] font-semibold text-lg px-4 py-2 rounded-md mt-2 text-center hover:bg-[#f0fef8] transition"
                    >
                      Mon compte
                    </Link>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        handleLogout();
                      }}
                      className="block w-full text-left border px-4 py-2 rounded-md text-lg text-gray-700 hover:bg-gray-100 mt-2"
                    >
                      Déconnexion
                    </button>
                  </>
                )}
              </div>
            </motion.nav>
          </AnimatePresence>
        )}
      </header>

      <main className="flex-1 w-full pt-24 px-4">
        {children}
      </main>

      <footer className="w-full bg-[#f9f9f9] border-t border-gray-200 py-8 px-4 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-center items-center gap-4 text-sm text-gray-600">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <span>© {new Date().getFullYear()} <span className="font-semibold text-[#00B074]">Fameasy</span>. Tous droits réservés.</span>
            <div className="flex gap-4">
              <Link href="/mentions-legales" className="hover:text-[#00B074] transition">Mentions légales</Link>
              <Link href="/politique-confidentialite" className="hover:text-[#00B074] transition">Politique de confidentialité</Link>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
