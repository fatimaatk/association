'use client';

import React, { SetStateAction, useState } from 'react';
import { Pencil, Plus, Trash2, X } from 'lucide-react';
import { ICotisation, IFamille, IMembres } from '@/models/interfaceFamilles';
import { StatutMembre } from '@prisma/client';
import toast from 'react-hot-toast';
import AddressAutocomplete from '../AddressAutocomplete';

interface UpdateFamilleProps {
  famille: IFamille;
  onUpdate: (updatedFamille: IFamille) => void;
  setFamilleIsUpdated: React.Dispatch<SetStateAction<boolean>>;
}

export function formatDateToYYYYMMDD(date: Date | null | undefined | string): string {
  if (!date) return "";
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const UpdateFamilleModal: React.FC<UpdateFamilleProps> = ({ famille, onUpdate, setFamilleIsUpdated }) => {
  const [editedFamille, setEditedFamille] = useState({
    ...famille,
    membres: famille.membres,
    cotisation: famille.cotisation ? {
      ...famille.cotisation,
      facture: famille.cotisation.facture ? {
        ...famille.cotisation.facture,
        statutPaiement: famille.cotisation.facture.statutPaiement || null,
        typePaiement: famille.cotisation.facture.typePaiement || null
      } : null
    } : null
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInputChange = (field: string, value: unknown, index?: number) => {
    setEditedFamille((prev) => {
      if (index !== undefined) {
        const updatedMembres = [...prev.membres];
        updatedMembres[index] = {
          ...updatedMembres[index],
          [field]: value,
        };
        return {
          ...prev,
          membres: updatedMembres,
        };
      } else if (field.includes('.')) {
        const keys = field.split('.');
        const updatedFamille = { ...prev };

        let obj: Record<string, unknown> = updatedFamille;
        for (let i = 0; i < keys.length - 1; i++) {
          obj = obj[keys[i]] as Record<string, unknown>;
        }

        obj[keys[keys.length - 1]] = value;

        return updatedFamille;
      } else {
        return {
          ...prev,
          [field]: value,
        };
      }
    });
  };

  const ajouterMembre = () => {
    setEditedFamille(prev => ({
      ...prev,
      membres: [
        ...prev.membres,
        {
          id: '',
          nom: '',
          prenom: '',
          dateNaissance: new Date(),
          familleId: null,
          associationId: prev.associationId,
          createdAt: new Date(),
          updatedAt: new Date(),
          dateEntree: new Date(),
          dateSortie: null,
          statut: 'ACTIF' as StatutMembre,
          annee: new Date().getFullYear()
        }
      ]
    }));
    toast.success("Nouveau membre ajouté");
  };

  const supprimerMembre = (index: number) => {
    setEditedFamille(prev => ({
      ...prev,
      membres: prev.membres.filter((_, i) => i !== index)
    }));
    toast.success("Membre supprimé");
  };

  const handleSubmit = async () => {
    try {
      const statut = (editedFamille?.cotisation as ICotisation)?.facture?.statutPaiement;
      const datePaiement = (editedFamille?.cotisation as ICotisation)?.facture?.datePaiement;

      if (statut === "ACQUITTE" && !datePaiement) {
        toast.error("La date de paiement est obligatoire si le statut est 'Acquitté'");
        return;
      }

      const formattedData = {
        ...editedFamille,
        id: editedFamille.id,
        membres: editedFamille.membres.map((membre: IMembres) => ({
          id: membre.id || undefined,
          nom: membre.nom,
          prenom: membre.prenom,
          dateNaissance: new Date(membre.dateNaissance).toISOString() || null,
        })),
        cotisation: editedFamille.cotisation ? {
          montant: (editedFamille.cotisation as ICotisation).montant,
          facture: {
            typePaiement: (editedFamille.cotisation as ICotisation).facture?.typePaiement || null,
            statutPaiement: (editedFamille.cotisation as ICotisation)?.facture?.statutPaiement || null,
            datePaiement: (editedFamille.cotisation as ICotisation)?.facture?.datePaiement
              ? new Date((editedFamille.cotisation as ICotisation)?.facture?.datePaiement ?? '').toISOString()
              : null
          }
        } : undefined
      };

      const response = await fetch(`/api/familles/${famille.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        toast.error('Mise à jour échouée');
        throw new Error('Mise à jour échouée');
      }

      const updatedData = await response.json();
      onUpdate(updatedData);
      setFamilleIsUpdated(true);
      setIsModalOpen(false);
      toast.success('Famille modifiée avec succès');
    } catch (error) {
      console.error('Erreur de mise à jour:', error);
      toast.error("Une erreur est survenue lors de la mise à jour");
    }
  };

  return (
    <>
      <button onClick={() => setIsModalOpen(true)} className="text-gray-500 hover:text-gray-700">
        <Pencil size={20} />
      </button>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div
            className="bg-white p-6 rounded-lg w-[600px] max-h-[90vh] overflow-y-auto relative"
            onClick={e => e.stopPropagation()}
          >
            {/* Bouton fermer */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
              aria-label="Fermer la fenêtre"
              type="button"
            >
              <X size={24} />
            </button>
            <h2 className="text-xl font-semibold mb-4">Modifier la famille</h2>

            <div className="space-y-4">
              <div>
                <label>Type de famille</label>
                <input
                  value={editedFamille.type?.nom || ''}
                  onChange={(e) => handleInputChange('type', { ...editedFamille.type, nom: e.target.value })}
                  className="w-full border p-2 rounded"
                />
              </div>

              <div>
                <label>Représentant</label>
                <input
                  value={`${editedFamille.chefFamille?.nom || ''} ${editedFamille.chefFamille?.prenom || ''}`}
                  disabled
                  className="w-full border p-2 rounded bg-gray-200"  // Vous pouvez aussi ajouter une classe pour l'apparence désactivée
                />
              </div>

              <div>
                <label>Adresse <span className="text-xs text-gray-400">(autocomplétion)</span></label>
                <AddressAutocomplete
                  value={editedFamille.adresse || ''}
                  onChange={(value: string) => handleInputChange('adresse', value)}
                  className="w-full border p-2 rounded"
                />
              </div>

              <div>
                <label>Email</label>
                <input
                  value={editedFamille.adresseEmail || ''}
                  onChange={(e) => handleInputChange('adresseEmail', e.target.value)}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label>Téléphone</label>
                <input
                  value={editedFamille.telephone || ''}
                  onChange={(e) => handleInputChange('telephone', e.target.value)}
                  className="w-full border p-2 rounded"
                />
              </div>

              <div>
                <label>Membres de la famille</label>
                <button
                  type="button"
                  onClick={ajouterMembre}
                  className="bg-success text-white px-4 py-2 rounded mb-4 flex items-center gap-2"
                >
                  <Plus size={20} />
                  Ajouter un membre
                </button>

                {editedFamille.membres.map((membre, index) => (
                  <div key={index} className="border p-4 rounded mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">Membre {index + 1}</h3>
                        {membre.id === editedFamille.chefFamille?.id && (
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            Chef de famille
                          </span>
                        )}
                      </div>
                      {membre.id !== editedFamille.chefFamille?.id && (
                        <button
                          type="button"
                          onClick={() => supprimerMembre(index)}
                          className="bg-error text-white px-4 py-2 rounded flex gap-2"
                        >
                          Supprimer
                          <Trash2 size={20} />
                        </button>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div>
                        <label className="block mb-1">Nom :</label>
                        <input
                          disabled={membre.id === editedFamille.chefFamille?.id}
                          type="text"
                          value={membre.nom}
                          onChange={(e) => handleInputChange('nom', e.target.value, index)}
                          className="w-full border p-2 rounded"
                        />
                      </div>
                      <div>
                        <label className="block mb-1">Prénom :</label>
                        <input
                          disabled={membre.id === editedFamille.chefFamille?.id}
                          type="text"
                          value={membre.prenom}
                          onChange={(e) => handleInputChange('prenom', e.target.value, index)}
                          className="w-full border p-2 rounded"
                        />
                      </div>
                      <div>
                        <label className="block mb-1">Date de naissance :</label>
                        <input
                          type="date"
                          value={formatDateToYYYYMMDD(membre.dateNaissance as unknown as string)}
                          onChange={(e) => handleInputChange('dateNaissance', e.target.value, index)}
                          className="w-full border p-2 rounded"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label>Montant du paiement</label>
                <input
                  type='text'
                  value={(editedFamille?.cotisation as ICotisation)?.montant || ''}
                  onChange={(e) => handleInputChange('cotisation.montant', e.target.value)}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label>Date du paiement</label>
                <input
                  type='date'
                  value={formatDateToYYYYMMDD((editedFamille?.cotisation as ICotisation)?.facture?.datePaiement) || ''}
                  onChange={(e) => handleInputChange('cotisation.facture.datePaiement', e.target.value)}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label>Statut du paiement</label>
                <select
                  value={(editedFamille?.cotisation as ICotisation)?.facture?.statutPaiement || ""}
                  onChange={(e) => handleInputChange('cotisation.facture.statutPaiement', e.target.value)}
                  className="w-full border p-2 rounded"
                >
                  <option value="">Sélectionner un statut</option>
                  <option value="EN_ATTENTE">En attente</option>
                  <option value="ACQUITTE">Acquitté</option>
                </select>
              </div>
              <div>
                <label>Type de paiement</label>
                <select
                  value={(editedFamille?.cotisation as ICotisation)?.facture?.typePaiement || ""}
                  onChange={(e) => handleInputChange('cotisation.facture.typePaiement', e.target.value)}
                  className="w-full border p-2 rounded"
                >
                  <option value="">Sélectionner un type</option>
                  <option value="ESPECE">Espèce</option>
                  <option value="VIREMENT">Virement</option>
                  <option value="CHEQUE">Chèque</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2">
                <button onClick={() => setIsModalOpen(false)} className="border px-4 py-2 rounded">Annuler</button>
                <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">Enregistrer</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateFamilleModal;
