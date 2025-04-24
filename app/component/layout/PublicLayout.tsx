"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation";
import { TUser } from "@/context/UserContext";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function PublicLayout({
  children,
  utilisateur,
}: {
  children: React.ReactNode
  utilisateur?: TUser
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
      {/* Header vitrine */}
      <header className="w-full fixed shadow-sm border-b border-gray-100 bg-white z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-4">
          <Link href="/" className="flex flex-col pt-2">
            <Image alt="logo" src={"/FamEase.svg"} width={150} height={50} />
            <h1 className="text-gray-500 text-sm mt-2">Gérer. Suivre. Simplifier.</h1>
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden focus:outline-none"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <div className="hidden md:flex gap-4">
            {!utilisateur ? (
              <>
                <Link href="/login" className="border border-[#00B074] text-[#00B074] text-sm font-medium px-4 py-2 rounded-md hover:bg-[#f0fef8] transition">Connexion</Link>
                <Link href="/inscription" className="border border-[#00B074] text-[#00B074] text-sm font-medium px-4 py-2 rounded-md hover:bg-[#f0fef8] transition">
                  Créer une association
                </Link>
              </>
            ) : (
              <>
                <Link href="/dashboard" className="border border-[#00B074] text-[#00B074] text-sm font-medium px-4 py-2 rounded-md hover:bg-[#f0fef8] transition">Mon compte</Link>
                <button
                  onClick={handleLogout}
                  className="border flex gap-2 border-gray-800 text-gray text-sm font-medium px-4 py-2 rounded-md hover:bg-gray-800 hover:text-[#f0fef8] transition"
                >
                  Déconnexion
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden px-4 pb-4 space-y-2 bg-white">
            {!utilisateur ? (
              <>
                <Link href="/login" className="block text-sm text-[#00B074] font-medium border px-4 py-2 rounded-md">Connexion</Link>
                <Link href="/inscription" className="block text-sm text-[#00B074] font-medium border px-4 py-2 rounded-md">Créer une association</Link>
              </>
            ) : (
              <>
                <Link href="/dashboard" className="block text-sm text-[#00B074] font-medium border px-4 py-2 rounded-md">Mon compte</Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-sm border px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  Déconnexion
                </button>
              </>
            )}
          </div>
        )}
      </header>

      <main className="flex-1 w-full pt-24 px-4">
        {children}
      </main>

      <footer className="text-center text-sm text-gray-500 px-2 py-6">
        Développé avec ❤️ par Fatima – © {new Date().getFullYear()} Famease
      </footer>
    </div>
  )
}
