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
    { logo: <HomeIcon />, href: "/dashboard", label: "Dashboard" },
    { logo: <AlignLeft />, href: "/familles", label: "Liste des familles" },
    { logo: <UserRoundPlus />, href: "/ajout", label: "Ajouter une famille" },
    { logo: <Download />, href: "/import", label: "Import excel" },
    { logo: <FolderInput />, href: "/export", label: "Exporter des attestations" },
    { logo: <FolderInput />, href: "/association", label: "Mon association" },
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
    } catch (error) {
      console.error("Erreur de d\u00e9connexion", error);
    }
  };

  const isActiveLink = (href: string) =>
    pathname.replace(/\/$/, "") === href.replace(/\/$/, "");

  return (
    <>
      {/* Mobile Top Bar with fixed logo and burger */}
      <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50 flex items-center justify-between px-4 py-2 md:hidden">
        <Link href="/" className="flex items-center space-x-2">
          <Image alt="logo" src="/FamEasy.svg" width={120} height={40} />
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md bg-white shadow"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#fefefe] shadow-lg border-r border-gray-200 px-6 pt-6 z-50 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Logo always visible in desktop sidebar */}
        <div className="mb-10 hidden md:flex flex-col">
          <Link href="/">
            <Image alt="logo" src="/FamEasy.svg" width={150} height={50} />
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

          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 p-3 rounded-md transition text-gray-700 hover:bg-red-100"
          >
            <LogOut />
            <span>Déconnexion</span>
          </button>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;