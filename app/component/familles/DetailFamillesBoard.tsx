"use client";

import React, { useState, useEffect } from "react";
import { IFamille } from "@/models/interfaceFamilles";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, SlidersHorizontal, X, Check, RotateCcw } from "lucide-react";
import toast from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";

interface IProps {
  familles: IFamille[] | null;
}

export default function DetailFamillesBoard({ familles }: IProps) {
  const router = useRouter();
  const [searchTermDraft, setSearchTermDraft] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  //const [selectedRows, setSelectedRows] = useState<IFamille[]>([]);
  const [showFilterPopup, setShowFilterPopup] = useState(false);

  const handleRowClick = (familleId: string) => {
    router.push(`/famille/${familleId}`);
  };


  const searchParametres = useSearchParams()
  useEffect(() => {
    if (searchParametres.get('deleted') === 'true') {
      toast.success('Famille supprimée avec succès')
    }

    const newUrl = new URL(window.location.href)
    newUrl.searchParams.delete('deleted')
    router.replace(newUrl.toString())
  }, [router, searchParametres])


  const resetFilters = () => {
    setSearchTermDraft("");
    setSearchTerm("");
    setSortOrder("asc");
    setItemsPerPage(10);
    setCurrentPage(1);
    setShowFilterPopup(false);
  };

  const applyFilters = () => {
    setSearchTerm(searchTermDraft);
    setShowFilterPopup(false);
  };

  const filteredFamilles = familles?.filter(famille => {
    const searchTermLower = searchTerm.toLowerCase();
    return famille.chefFamille.nom.toLowerCase().includes(searchTermLower) ||
      famille.chefFamille.prenom.toLowerCase().includes(searchTermLower);
  }) || [];

  const sortedFamilles = [...filteredFamilles].sort((a, b) => {
    return sortOrder === 'asc'
      ? a.chefFamille.nom.localeCompare(b.chefFamille.nom)
      : b.chefFamille.nom.localeCompare(a.chefFamille.nom);
  });

  const paginatedFamilles = sortedFamilles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedFamilles.length / itemsPerPage);

  {/* const toggleSelectAll = () => {
    if (selectedRows.length === paginatedFamilles.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedFamilles);
    }
  };

  const toggleRowSelection = (famille: IFamille) => {
    setSelectedRows((prev) =>
      prev.some((row) => row.id === famille.id)
        ? prev.filter((row) => row.id !== famille.id)
        : [...prev, famille]
    );
  }; */}

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 relative">
      {/* Popup mobile filters */}
      <div className="sm:hidden flex justify-end mb-4">
        <button
          onClick={() => setShowFilterPopup(true)}
          className="flex items-center gap-2 px-4 py-2 border rounded bg-white shadow"
        >
          <SlidersHorizontal size={20} /> Filtres
        </button>
      </div>

      {/* Filtres mobiles */}
      <AnimatePresence>
        {showFilterPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Filtres</h2>
                <button
                  onClick={() => setShowFilterPopup(false)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rechercher
                  </label>
                  <input
                    type="text"
                    value={searchTermDraft}
                    onChange={(e) => setSearchTermDraft(e.target.value)}
                    placeholder="Nom ou prénom"
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#00B074] focus:border-[#00B074] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trier par
                  </label>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#00B074] focus:border-[#00B074] outline-none"
                  >
                    <option value="asc">Nom A-Z</option>
                    <option value="desc">Nom Z-A</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Entrées par page
                  </label>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#00B074] focus:border-[#00B074] outline-none"
                  >
                    <option value={10}>10 familles</option>
                    <option value={20}>20 familles</option>
                    <option value={50}>50 familles</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={applyFilters}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#00B074] text-white px-4 py-2 rounded-lg hover:bg-[#01965e] transition"
                  >
                    <Check size={18} /> Appliquer
                  </button>
                  <button
                    onClick={resetFilters}
                    className="flex-1 flex items-center justify-center gap-2 text-[#00B074] border border-[#00B074] px-4 py-2 rounded-lg hover:bg-[#f0fef8] transition"
                  >
                    <RotateCcw size={18} /> Réinitialiser
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="hidden sm:flex items-center justify-between mb-4 gap-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher par nom ou prénom"
          className="w-64 border rounded px-3 py-2"
        />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
          className="w-48 border rounded px-3 py-2"
        >
          <option value="asc">Nom A-Z</option>
          <option value="desc">Nom Z-A</option>
        </select>
        <select
          value={itemsPerPage}
          onChange={(e) => setItemsPerPage(Number(e.target.value))}
          className="w-48 border rounded px-3 py-2"
        >
          <option value={10}>10 familles</option>
          <option value={20}>20 familles</option>
          <option value={50}>50 familles</option>
        </select>
      </div>

      {paginatedFamilles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500">
          <AlertCircle size={48} className="mb-4" />
          <h3 className="text-xl font-semibold mb-2">Aucun résultat</h3>
          <p className="text-sm">Essayez de modifier vos filtres ou votre recherche.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {paginatedFamilles.map((famille) => (
            <div
              key={famille.id}
              className="border rounded-lg p-4 shadow-sm hover:shadow cursor-pointer sm:hidden"
              onClick={() => handleRowClick(famille.id)}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  {famille.chefFamille.nom} {famille.chefFamille.prenom}
                </h3>
                <span className="text-sm text-gray-500">{famille.type.nom}</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">Email : {famille.adresseEmail}</p>
              <p className="text-sm text-gray-600">Montant : {famille.cotisation?.montant} €</p>
            </div>
          ))}

          <div className="hidden sm:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">Représentant</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">Type</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">Email</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">Montant</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedFamilles.map((famille) => (
                  <tr key={famille.id} onClick={() => handleRowClick(famille.id)} className="hover:bg-gray-50 cursor-pointer">
                    <td className="px-4 py-2">{famille.chefFamille.nom} {famille.chefFamille.prenom}</td>
                    <td className="px-4 py-2">{famille.type.nom}</td>
                    <td className="px-4 py-2">{famille.adresseEmail}</td>
                    <td className="px-4 py-2">{famille.cotisation?.montant} €</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex flex-col  items-center justify-between gap-4 border-t pt-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                className="px-3 sm:px-4 py-2 border rounded bg-white disabled:opacity-50 text-sm sm:text-base hover:bg-gray-50 transition-colors"
                disabled={currentPage === 1}
              >
                Précédent
              </button>
              <div className="flex items-center gap-1 bg-gray-50 px-3 py-2 rounded-lg border">
                <span className="text-sm sm:text-base font-medium text-[#00B074]">{currentPage}</span>
                <span className="text-sm sm:text-base text-gray-500">/</span>
                <span className="text-sm sm:text-base text-gray-500">{totalPages}</span>
              </div>
              <button
                onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                className="px-3 sm:px-4 py-2 border rounded bg-white disabled:opacity-50 text-sm sm:text-base hover:bg-gray-50 transition-colors"
                disabled={currentPage === totalPages}
              >
                Suivant
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
