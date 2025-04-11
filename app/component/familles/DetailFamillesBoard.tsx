'use client';

import React, { useState } from 'react';
import { IFamille } from '@/models/interfaceFamilles';
import { formatDateToDDMMYYYY } from '../famille/DetailFamilleCart'
import { AlertCircle, Search } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useRouter } from 'next/navigation';

interface IProps {
  familles: IFamille[] | null;
}

const DetailFamillesBoard = ({ familles }: IProps) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedRows, setSelectedRows] = useState<IFamille[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [feedbackPopup, setFeedbackPopup] = useState<{ type: 'success' | 'error'; message: string } | null>(null);



  const handleRowClick = (familleId: string) => {
    router.push(`/famille/${familleId}`);
  };

  const handleDeleteSelected = async () => {
    try {
      for (const famille of selectedRows) {
        const res = await fetch(`/api/familles/${famille.id}`, { method: 'DELETE' });
        if (!res.ok) {
          throw new Error(`Échec pour ${famille.chefFamille.nom} ${famille.chefFamille.prenom}`);
        }
      }

      setSelectedRows([]);
      setShowDeleteModal(false);
      setFeedbackPopup({
        type: 'success',
        message: `Famille${selectedRows.length > 1 ? 's' : ''} supprimée${selectedRows.length > 1 ? 's' : ''} avec succès.`,
      });

      setTimeout(() => {
        setFeedbackPopup(null);
        window.location.reload();
      }, 2000);
    } catch (error) {
      setShowDeleteModal(false);
      setFeedbackPopup({
        type: 'error',
        message: error as string || "Une erreur est survenue lors de la suppression.",
      });

      setTimeout(() => {
        setFeedbackPopup(null);
      }, 3000);
    }
  };


  console.log(familles)

  const exportToExcel = () => {
    const dataToExport = selectedRows.length > 0 ? selectedRows : familles;
    if (!dataToExport) return;

    const workbook = XLSX.utils.book_new();

    const familleData = dataToExport.map(famille => ({
      'ID': famille.id,
      'Type de famille': famille.type.nom,
      'Nom représentant': famille.chefFamille.nom,
      'Prénom représentant': famille.chefFamille.prenom,
      'Adresse': famille.adresse,
      'Email': famille.adresseEmail,
      'Téléphone': famille.telephone,
      'Montant cotisation': famille.cotisation?.montant || '',
      'Statut paiement': famille.cotisation?.facture?.statutPaiement || '',
      'Type paiement': famille.cotisation?.facture?.typePaiement || '',
      'Date paiement': famille.cotisation?.facture?.datePaiement ? formatDateToDDMMYYYY(new Date(famille.cotisation.facture.datePaiement)) : ''
    }));

    const membreData = dataToExport.flatMap(famille =>
      famille.membres.map(membre => ({
        'ID': membre.id,
        'ID Famille': famille.id,
        'Nom': membre.nom,
        'Prénom': membre.prenom,
        'Date de naissance': formatDateToDDMMYYYY(new Date(membre.dateNaissance)),
        'Est représentant': membre.id === famille.chefFamille.id ? 'Oui' : 'Non'
      }))
    );

    const familleSheet = XLSX.utils.json_to_sheet(familleData);
    const membreSheet = XLSX.utils.json_to_sheet(membreData);

    XLSX.utils.book_append_sheet(workbook, familleSheet, 'Familles');
    XLSX.utils.book_append_sheet(workbook, membreSheet, 'Membres');

    familleSheet['!cols'] = [
      { wch: 36 }, { wch: 15 }, { wch: 20 }, { wch: 20 }, { wch: 40 },
      { wch: 30 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }
    ];

    membreSheet['!cols'] = [
      { wch: 36 }, { wch: 36 }, { wch: 20 }, { wch: 20 }, { wch: 15 }, { wch: 15 }
    ];

    const today = new Date().toISOString().split("T")[0]; // format : YYYY-MM-DD
    const fileName = selectedRows.length > 0
      ? `export_selection_${today}.xlsx`
      : `export_familles_${today}.xlsx`;

    XLSX.writeFile(workbook, fileName);
  };

  // Fonction pour gérer la sélection/dé-sélection des lignes
  const toggleRowSelection = (famille: IFamille) => {
    const newSelectedRows = [...selectedRows];
    const index = newSelectedRows.findIndex(item => item.id === famille.id);

    if (index > -1) {
      newSelectedRows.splice(index, 1);
    } else {
      newSelectedRows.push(famille);
    }

    setSelectedRows(newSelectedRows);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSortOrder('asc');
    setItemsPerPage(10);
    setCurrentPage(1);
    setSelectedRows([]); // Réinitialiser les lignes sélectionnées
  };

  if (!familles) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <AlertCircle className="text-4xl mb-2 text-gray-500" />
        <p className="text-lg text-gray-500">Aucune donnée disponible</p>
      </div>
    );
  }

  const filteredFamilles = familles.filter(famille => {
    const searchTermLower = searchTerm.toLowerCase();
    const nomChef = famille.chefFamille.nom.toLowerCase();
    const prenomChef = famille.chefFamille.prenom.toLowerCase();

    return nomChef.includes(searchTermLower) || prenomChef.includes(searchTermLower);
  });

  const sortedFamilles = [...filteredFamilles].sort((a, b) => {
    return sortOrder === 'asc'
      ? a.chefFamille.nom.localeCompare(b.chefFamille.nom)
      : b.chefFamille.nom.localeCompare(a.chefFamille.nom);
  });

  const paginatedFamilles = sortedFamilles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(sortedFamilles.length / itemsPerPage);

  const toggleSelectAll = () => {
    if (selectedRows.length === paginatedFamilles.length) {
      setSelectedRows([]); // Désélectionner tout
    } else {
      setSelectedRows(paginatedFamilles); // Sélectionner tout
    }
  };


  const isAllSelected = selectedRows.length === paginatedFamilles.length && paginatedFamilles.length > 0;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className='flex flex-col sm:flex-row w-full  items-center mb-4 gap-4'>

        {feedbackPopup && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
            <div
              className={`bg-white rounded-lg shadow-lg p-6 text-center max-w-sm w-full
        ${feedbackPopup.type === 'success' ? 'border-green-500' : 'border-red-500'} border-t-4`}
            >
              <h2 className={`text-lg font-semibold mb-2 ${feedbackPopup.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                {feedbackPopup.type === 'success' ? 'Succès 🎉' : 'Erreur ❌'}
              </h2>
              <p className="text-sm text-gray-700">{feedbackPopup.message}</p>
            </div>
          </div>
        )}

        <div className='flex gap-4 w-full sm:w-auto'>
          <div className="relative w-full  sm:w-auto">
            <input
              type="text"
              placeholder="Rechercher par nom ou prénom..."
              className="p-2 pl-10 border rounded w-full h-full rounded sm:w-96"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-3 text-gray-500" size={20} />
          </div>
          <select
            className="select select-bordered w-full sm:w-64"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
          >
            <option value="asc">Par représentant ↓</option>
            <option value="desc">Par représentant ↑</option>
          </select>
          <select
            className="select select-bordered w-full sm:w-64"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
          >
            <option value={10}>10 familles par page</option>
            <option value={20}>20 familles par page</option>
            <option value={50}>50 familles par page</option>
          </select>
          <button
            className="btn p-2 border rounded w-full sm:w-32 bg-white"
            onClick={resetFilters}
          >
            Réinitialiser
          </button>
          <button
            className="btn p-2 border rounded w-full sm:w-32 bg-white"
            onClick={exportToExcel}
          >
            {selectedRows.length > 0 ? 'Exporter la sélection' : 'Exporter tout'}
          </button>
          {selectedRows.length > 0 && (
            <button
              className="btn p-2 border rounded w-full sm:w-48 bg-red-500 text-white hover:bg-red-600"
              onClick={() => setShowDeleteModal(true)}
            >
              Supprimer la sélection ({selectedRows.length})
            </button>
          )}
        </div>

      </div>

      <div className="overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden border border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <td className="px-3 py-3">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                  </td>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Représentant</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Type de famille</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Adresse postale</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Adresse email</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Membre de la famille</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Montant</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Statut</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">Mode</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">Date de paiement</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedFamilles.length > 0 ? (
                  paginatedFamilles.map((famille, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleRowClick(famille.id)}
                    >
                      <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedRows.some(row => row.id === famille.id)}
                          onChange={() => toggleRowSelection(famille)}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {famille.chefFamille.nom} {famille.chefFamille.prenom}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                        {famille.type.nom}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                        {famille.adresse}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                        {famille.adresseEmail}
                      </td>
                      <td className="px-3 py-3 text-sm text-gray-500 hidden md:table-cell">
                        {famille.membres?.map((membre) => (
                          <div key={membre.id}>{membre.nom} {membre.prenom}</div>
                        ))}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                        {famille.cotisation?.montant} €
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                        {famille.cotisation?.facture?.statutPaiement}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500 hidden xl:table-cell">
                        {famille.cotisation?.facture?.typePaiement}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500 hidden xl:table-cell">
                        {formatDateToDDMMYYYY(famille.cotisation?.facture?.datePaiement)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} className="px-3 py-4 text-center">
                      <div className="flex flex-col items-center text-gray-500">
                        <AlertCircle className="text-4xl mb-2" />
                        <p className="text-lg">Aucune famille disponible</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
        <button
          className='btn p-2 border rounded w-full sm:w-32 bg-white'
          onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
        >
          Précédent
        </button>
        <p className="text-sm text-gray-700">
          Page {currentPage} sur {totalPages}
        </p>
        <button
          className='btn p-2 border rounded w-full sm:w-32 bg-white'
          onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Suivant
        </button>
      </div>
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Confirmer la suppression</h2>
            <p className="mb-6 text-sm text-gray-700">
              Êtes-vous sûr de vouloir supprimer {selectedRows.length} famille{selectedRows.length > 1 ? "s" : ""} ?
              Cette action est irréversible.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteSelected}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailFamillesBoard;
