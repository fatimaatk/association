"use client";
import { AlignLeft, ChartNoAxesCombined, File, HomeIcon, UserRoundPlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();

  const navLinks = [
    { logo: <HomeIcon />, href: "/", label: "Accueil" },
    { logo: <AlignLeft />, href: "/familles", label: "Liste des familles" },
    { logo: <UserRoundPlus />, href: "/new", label: "Ajouter une famille" },
    { logo: <ChartNoAxesCombined />, href: "/export", label: "Export excel" },
  ];

  const isActiveLink = (href: string) =>
    pathname.replace(/\/$/, "") === href.replace(/\/$/, "");

  return (
    <div className="fixed left-0 top-0 h-screen w-80 bg-white shadow-lg border-r border-gray-200 p-5 pl-8">

      {/* Logo */}
      <div className="mt-10 mb-10">
        <Link href="/" className="flex flex-col ">
          <Image alt="logo" src={"/FamEase.svg"} width={150} height={50} />
          <h1 className="text-gray-500 text-sm mt-2">Association Solidarité Seddouk</h1>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col space-y-4">
        {navLinks.map(({ href, label, logo }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center space-x-3 p-3 rounded-md transition 
              ${isActiveLink(href) ? "font-semibold bg-[#D9F3EA] text-[#00B074]" : "text-gray-700 hover:bg-gray-100"}`}
          >
            {logo}
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
