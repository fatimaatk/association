"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { IFamille } from "@/models/interfaceFamilles";
import { useRouter } from "next/navigation";

const SearchBar = () => {
  const [familles, setFamilles] = useState<IFamille[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<IFamille[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  const fetchFamille = async () => {
    try {
      const res = await fetch(`/api/familles`);
      if (!res.ok) {
        throw new Error("Famille non trouvée");
      }
      const data = await res.json();
      setFamilles(data);
    } catch (error) {
      console.error("Erreur lors du chargement des familles", error);
    }
  };

  useEffect(() => {
    fetchFamille();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    if (value.length > 0) {
      setSearchResults(
        familles.filter((family) =>
          family.chefFamille.nom.toLowerCase().includes(value) ||
          family.chefFamille.prenom.toLowerCase().includes(value) ||
          family.adresse.toLowerCase().includes(value) ||
          family.adresseEmail.toLowerCase().includes(value)
        )
      );
    } else {
      setSearchResults([]);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && searchTerm.trim() !== "") {
      router.push(`/recherche?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div className="relative mb-6 md:mb-12 mt-4 md:mt-6">
      <div className="relative">
        <input
          type="text"
          placeholder="Rechercher une famille..."
          value={searchTerm}
          onChange={handleSearch}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00B074] text-sm md:text-base"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
      </div>

      {searchResults.length > 0 && isFocused && (
        <div className="z-50 absolute w-full bg-white shadow-lg mt-1 rounded-md max-h-[60vh] md:max-h-96 overflow-auto border border-gray-200">
          <div className="p-2 text-sm text-gray-500 border-b border-gray-200">
            {searchResults.length} résultat{searchResults.length > 1 ? "s" : ""}
          </div>
          {searchResults.map((result) => (
            <Link
              key={result.id}
              href={`/famille/${result.id}`}
              className="block p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
            >
              <div className="font-medium text-gray-900">
                {result.chefFamille.nom} {result.chefFamille.prenom}
              </div>
              <div className="text-sm text-gray-500 mt-1">{result.adresse}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;