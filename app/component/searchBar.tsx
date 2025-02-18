
"use client";

import Link from "next/link";
import { Search, } from "lucide-react";
import { useEffect, useState } from "react";
import { IFamille } from "@/models/interfaceFamilles";


const SearchBar = () => {
  const [familles, setFamilles] = useState<IFamille[]>([])
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<IFamille[]>([]);

  const fetchFamille = async () => {
    try {
      const res = await fetch(`/api/familles`);
      if (!res.ok) {
        throw new Error("Famille non trouvée");
      }
      const data = await res.json();
      setFamilles(data);
    } catch (error) {
      console.error("Erreur lors du chargement des factures", error);
    }
  }

  useEffect(() => {
    fetchFamille()
  }, [])


  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    if (value.length > 0) {
      setSearchResults(familles.filter(family =>
        family.representant.nom.toLowerCase().includes(value) || // Rechercher dans le nom du représentant
        family.adresse.toLowerCase().includes(value) || // Rechercher dans l'adresse
        family.adresseEmail.toLowerCase().includes(value) // Rechercher dans l'email
      ));
    } else {
      setSearchResults([]);
    }
  };
  return (
    <div className="relative mb-12 mt-6">
      <input
        type="text"
        placeholder="Rechercher une famille"
        value={searchTerm}
        onChange={handleSearch}
        className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00B074]"
      />
      <Search className="absolute left-3 top-3 text-gray-500" size={20} />
      {searchResults.length > 0 && (
        <div className="absolute w-full bg-white shadow-md mt-1 rounded-md max-h-40 overflow-auto">
          {searchResults.map((result, index) => (
            <Link
              key={index}
              href={`/famille/${result.id}`}
              className="block p-2 hover:bg-gray-100"
            >
              {result.representant.nom} {result.representant.prenom}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchBar