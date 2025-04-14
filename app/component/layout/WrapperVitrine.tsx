"use client"

import Link from "next/link"
import Image from "next/image"

export default function WrapperVitrine({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#fefefe]">
      {/* Header vitrine */}
      <header className="w-full shadow-sm border-b border-gray-100 bg-white z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-4">
          <Link href="/">
            <Image src="/FamEase.svg" alt="Famease logo" width={120} height={40} />
          </Link>
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <Link href="/" className="text-gray-800 hover:text-[#00B074] transition">Accueil</Link>
            <Link href="/fonctionnalites" className="text-gray-800 hover:text-[#00B074] transition">Fonctionnalités</Link>
            <Link href="/tarifs" className="text-gray-800 hover:text-[#00B074] transition">Tarifs</Link>
            <Link href="/contact" className="text-gray-800 hover:text-[#00B074] transition">Contact</Link>
          </nav>
          <div className="hidden md:flex gap-4">
            <Link href="/login" className="border border-[#00B074] text-[#00B074] text-sm font-medium px-4 py-2 rounded-md hover:bg-[#f0fef8] transition">Connexion</Link>
            <Link href="/inscription" className="border border-[#00B074] text-[#00B074] text-sm font-medium px-4 py-2 rounded-md hover:bg-[#f0fef8] transition">
              Créer une association
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full">
        {children}
      </main>

      <footer className="text-center text-sm text-gray-500 px-2 py-6">
        Développé avec ❤️ par Fatima – © {new Date().getFullYear()} Famease
      </footer>
    </div>
  )
}
