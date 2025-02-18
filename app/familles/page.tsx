'use client';

import React, { useEffect, useState } from 'react';
import Wrapper from '../component/Wrapper';
import Loader from '../component/loader';
import { IFamille } from '@/models/interfaceFamilles';
import { formatDateToDDMMYYYY } from '../component/familles/DetailFamilleCart';
import { AlertCircle, Search } from 'lucide-react';
import * as XLSX from 'xlsx';

const FamillePage = () => {
  const [familles, setFamilles] = useState<IFamille[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedRows, setSelectedRows] = useState<IFamille[]>([]);

  const exportToExcel = () => {
    // Si aucune ligne n'est sélectionnée, on exporte tout le tableau `familles`
    const rowsToExport = selectedRows.length > 0 ? selectedRows : familles;
    const ws = XLSX.utils.json_to_sheet(rowsToExport); // Convertir les données en feuille de calcul
    const wb = XLSX.utils.book_new(); // Créer un nouveau classeur
    XLSX.utils.book_append_sheet(wb, ws, "Données"); // Ajouter la feuille au classeur
    XLSX.writeFile(wb, "tableau.xlsx"); // Télécharger le fichier Excel
  };

  // Fonction pour gérer la sélection/dé-sélection des lignes
  const toggleRowSelection = (famille: IFamille) => {
    const newSelectedRows = [...selectedRows];
    const index = newSelectedRows.findIndex(item => item.id === famille.id);

    if (index > -1) {
      // Si la ligne est déjà sélectionnée, on la retire
      newSelectedRows.splice(index, 1);
    } else {
      // Sinon, on l'ajoute
      newSelectedRows.push(famille);
    }

    setSelectedRows(newSelectedRows); // Mettre à jour l'état avec les lignes sélectionnées
  };

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFamille();
  }, []);

  const resetFilters = () => {
    setSearchTerm("");
    setSortOrder('asc');
    setItemsPerPage(10);
    setCurrentPage(1);
    setSelectedRows([]); // Réinitialiser les lignes sélectionnées
  };

  const filteredFamilles = familles.filter(famille =>
    `${famille.representant.nom} ${famille.representant.prenom}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const sortedFamilles = [...filteredFamilles].sort((a, b) => {
    return sortOrder === 'asc'
      ? a.representant.nom.localeCompare(b.representant.nom)
      : b.representant.nom.localeCompare(a.representant.nom);
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
    <Wrapper>
      {loading ? (
        <Loader loading={loading} />
      ) : (
        <div>
          <div className="mb-4 flex justify-between items-center">
            <div className="flex gap-4 justify-start items-center">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher par nom de représentant..."
                  className="p-2 pl-10 border rounded w-full w-96"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-3 text-gray-500" size={20} />
              </div>
              <select
                className="select select-bordered w-64 max-w-xs"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              >
                <option value="asc">Par représentant ↓</option>
                <option value="desc">Par représentant ↑</option>
              </select>

              <select
                className="select select-bordered w-64 max-w-xs"
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
              >
                <option value={10}>10 familles par page</option>
                <option value={20}>20 familles par page</option>
                <option value={50}>50 familles par page</option>
              </select>
            </div>
            <button onClick={exportToExcel}>Exporter en Excel</button>
          </div>

          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <td>
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={toggleSelectAll}
                    />
                  </td>
                  <th>Représentant</th>
                  <th>Type de famille</th>
                  <th>Adresse postale</th>
                  <th>Adresse email</th>
                  <th>Membre de la famille</th>
                  <th>Montant de la cotisation</th>
                  <th>Statut de paiement</th>
                  <th>Mode de paiement</th>
                  <th>Date de paiement</th>
                </tr>
              </thead>
              <tbody>
                {paginatedFamilles.length > 0 ? (
                  paginatedFamilles.map((famille, index) => (
                    <tr key={famille.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedRows.some(row => row.id === famille.id)} // Vérifie si cette ligne est sélectionnée
                          onChange={() => toggleRowSelection(famille)} // Passe l'objet famille pour la sélection
                        />
                      </td>
                      <td>{famille.representant.nom} {famille.representant.prenom}</td>
                      <td>{famille.type.nom}</td>
                      <td>{famille.adresse}</td>
                      <td>{famille.adresseEmail}</td>
                      <td>{famille.membres?.map((membre, index) => (
                        <div key={index}>{membre.nom} {membre.prenom}</div>
                      ))}</td>
                      <td>{famille.cotisation?.montant} €</td>
                      <td>{famille.cotisation?.facture?.statutPaiement}</td>
                      <td>{famille.cotisation?.facture?.typePaiement}</td>
                      <td>{formatDateToDDMMYYYY(famille.cotisation?.facture?.datePaiement)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} className="text-center p-4">
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

          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
            >
              Précédent
            </button>
            <span>
              Page {currentPage} sur {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Suivant
            </button>
          </div>
        </div>
      )}
    </Wrapper>
  );
};

export default FamillePage;
