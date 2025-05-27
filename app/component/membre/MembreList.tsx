'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Edit2, MoreVertical } from 'lucide-react';
import StatutBadge from './StatutBadge';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Membre {
  id: string;
  nom: string;
  prenom: string;
  statut: 'ACTIF' | 'INACTIF' | 'ARCHIVE';
  dateEntree: string;
  dateSortie: string | null;
  famille: {
    id: string;
    nom: string;
  } | null;
}

export default function MembreList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedStatus, setSelectedStatus] = useState('TOUS');
  const [membres, setMembres] = useState<Membre[]>([]);
  const [loading, setLoading] = useState(true);

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  useEffect(() => {
    const fetchMembres = async () => {
      try {
        const params = new URLSearchParams({
          ...(searchTerm && { search: searchTerm }),
          ...(selectedYear && { year: selectedYear.toString() }),
          ...(selectedStatus !== 'TOUS' && { status: selectedStatus })
        });

        const response = await fetch(`/api/membres?${params}`);
        const data = await response.json();
        setMembres(data);
      } catch (error) {
        console.error('Erreur lors du chargement des membres:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembres();
  }, [searchTerm, selectedYear, selectedStatus]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Membres</h1>
          <p className="text-gray-600">Gérez vos membres et suivez leur statut</p>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un membre..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00B074] focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <select
              className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#00B074] focus:border-transparent"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            <select
              className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#00B074] focus:border-transparent"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="TOUS">Tous les statuts</option>
              <option value="ACTIF">Actifs</option>
              <option value="INACTIF">Inactifs</option>
              <option value="ARCHIVE">Archivés</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des membres */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Membre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date d'entrée
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date de sortie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Famille
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Chargement...
                  </td>
                </tr>
              ) : membres.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Aucun membre trouvé
                  </td>
                </tr>
              ) : (
                membres.map((membre) => (
                  <motion.tr
                    key={membre.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {membre.prenom} {membre.nom}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatutBadge statut={membre.statut} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(membre.dateEntree), 'dd MMMM yyyy', { locale: fr })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {membre.dateSortie
                        ? format(new Date(membre.dateSortie), 'dd MMMM yyyy', { locale: fr })
                        : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {membre.famille ? membre.famille.nom : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-[#00B074] hover:text-[#00965e] mr-4">
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-500">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 