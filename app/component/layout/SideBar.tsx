"use client";

import {
  AlignLeft,
  Download,
  FolderInput,
  HomeIcon,
  Menu,
  UserRoundPlus,
  X,
  LogOut,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { logo: <HomeIcon />, href: "/", label: "Accueil" },
    { logo: <AlignLeft />, href: "/familles", label: "Liste des familles" },
    { logo: <UserRoundPlus />, href: "/ajout", label: "Ajouter une famille" },
    { logo: <Download />, href: "/import", label: "Import excel" },
    { logo: <FolderInput />, href: "/export", label: "Exporter des attestations" },
  ];

  const isActiveLink = (href: string) =>
    pathname.replace(/\/$/, "") === href.replace(/\/$/, "");

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
    } catch (error) {
      console.error("Erreur de déconnexion", error);
    }
  };

  return (
    <>
      {/* Bouton menu mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-lg md:hidden"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay pour mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen w-64 bg-white shadow-lg border-r border-gray-200 p-8 z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
      >
        {/* Logo */}
        <div className="mt-10 mb-10">
          <Link href="/" className="flex flex-col">
            <Image alt="logo" src={"/FamEase.svg"} width={150} height={50} />
            <h1 className="text-gray-500 text-sm mt-2">Gérer. Suivre. Simplifier.</h1>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col space-y-4">
          {navLinks.map(({ href, label, logo }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center space-x-3 p-3 rounded-md transition 
                ${isActiveLink(href)
                  ? "font-semibold bg-[#D9F3EA] text-[#00B074]"
                  : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              {logo}
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        {/* Déconnexion */}
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 p-3 rounded-md transition text-gray-700 hover:bg-[#D9F3EA] w-full mt-8"
        >
          <LogOut />
          <span className="text-[#00B074] font-medium">Déconnexion</span>
        </button>
      </div>
    </>
  );
};

export default Sidebar;
