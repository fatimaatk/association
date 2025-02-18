import React, { useState } from 'react';
import { Pencil } from 'lucide-react';
import { IFamille } from '@/types/interfaces';
import { IMembre } from '@/models/interfaceFamilles';

interface UpdateFamilleProps {
  famille: IFamille;
  onUpdate: (updatedFamille: IFamille) => void;
  setFamilleIsUpdated: any
}

export function formatDateToYYYYMMDD(date) {
  if (!date) return "";
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0'); // Les mois commencent à 0
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const UpdateFamilleModal: React.FC<UpdateFamilleProps> = ({ famille, onUpdate, setFamilleIsUpdated }) => {
  const [editedFamille, setEditedFamille] = useState({ ...famille, membres: famille.membres, cotisation: famille.cotisation || [] });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInputChange = (field: string, value: any, index?: number) => {
    setEditedFamille((prev) => {
      if (index !== undefined) {
        // Cas des membres, on met à jour le membre à l'index donné
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
        // Cas des champs imbriqués (comme cotisation.facture.statutPaiement)
        const keys = field.split('.'); // Décomposer le champ pour accéder à l'objet imbriqué
        const updatedFamille = { ...prev };

        let obj = updatedFamille;
        // Parcourir les clés sauf la dernière pour atteindre la profondeur nécessaire
        for (let i = 0; i < keys.length - 1; i++) {
          obj = obj[keys[i]]; // Accéder à l'objet imbriqué
        }

        // Mettre à jour la dernière clé de l'objet imbriqué
        obj[keys[keys.length - 1]] = value;

        return updatedFamille;
      } else {
        // Cas des autres champs de famille (type, representant, etc.)
        return {
          ...prev,
          [field]: value,
        };
      }
    });
  };

  const handleSubmit = async () => {
    try {
      const formattedData = {
        ...editedFamille,
        id: editedFamille.id,
        representantId: editedFamille.representant?.id || null,
        membres: editedFamille.membres.map((membre: IMembre) => ({
          id: membre.id || undefined,
          nom: membre.nom,
          prenom: membre.prenom,
          dateNaissance: new Date(membre.dateNaissance).toISOString() || null,
        })),
        cotisation: editedFamille.cotisation ? {
          montant: editedFamille.cotisation.montant,
          facture: {
            typePaiement: editedFamille.cotisation.facture.typePaiement || null,
            statutPaiement: editedFamille.cotisation.facture.statutPaiement || null,
            datePaiement: new Date(editedFamille.cotisation.facture.datePaiement).toISOString() || null,

          }
        } : undefined
      };

      const response = await fetch(`/api/familles/${famille.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedData),
      });
      if (!response.ok) throw new Error('Mise à jour échouée');
      const updatedData = await response.json();
      onUpdate(updatedData);
      setFamilleIsUpdated(true);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erreur de mise à jour:', error);
    }
  };

  return (
    <>
      <button onClick={() => setIsModalOpen(true)} className="text-gray-500 hover:text-gray-700">
        <Pencil size={20} />
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ">
          <div className="bg-white p-6 rounded-lg w-[600px] max-h-[90vh] overflow-y-auto">
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
                  value={`${editedFamille.representant?.nom || ''} ${editedFamille.representant?.prenom || ''}`}
                  disabled
                  className="w-full border p-2 rounded bg-gray-200"  // Vous pouvez aussi ajouter une classe pour l'apparence désactivée
                />
              </div>

              <div>
                <label>Adresse</label>
                <input
                  value={editedFamille.adresse || ''}
                  onChange={(e) => handleInputChange('adresse', e.target.value)}
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

              {editedFamille.membres.map((membre, index) => (
                <div key={index} className="border p-2 rounded mb-2">
                  <label className="block">
                    Nom:
                    <input
                      type="text"
                      value={membre.nom}
                      onChange={(e) => handleInputChange('nom', e.target.value, index)}
                      className="border p-2 w-full"
                    />
                  </label>
                  <label className="block">
                    Prénom:
                    <input
                      type="text"
                      value={membre.prenom}
                      onChange={(e) => handleInputChange('prenom', e.target.value, index)}
                      className="border p-2 w-full"
                    />
                  </label>
                  <label className="block">
                    Date de naissance :
                    <input
                      type="date"
                      value={formatDateToYYYYMMDD(membre.dateNaissance)}
                      onChange={(e) => handleInputChange('dateNaissance', e.target.value, index)}
                      className="border p-2 w-full"
                    />
                  </label>

                </div>
              ))}

              <div>
                <label>Montant du paiement</label>
                <input
                  type='text'
                  value={editedFamille?.cotisation?.montant || ''}
                  onChange={(e) => handleInputChange('cotisation.montant', e.target.value)}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label>Date du paiement</label>
                <input
                  type='date'
                  value={formatDateToYYYYMMDD(editedFamille?.cotisation?.facture?.datePaiement) || ''}
                  onChange={(e) => handleInputChange('cotisation.facture.datePaiement', e.target.value)}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label>Statut du paiement</label>
                <input
                  type="text"
                  value={editedFamille?.cotisation?.facture?.statutPaiement || ''}
                  onChange={(e) => handleInputChange('cotisation.facture.statutPaiement', e.target.value)}
                  className="w-full border p-2 rounded"
                />
              </div>

              <div>
                <label>Mode de paiement</label>
                <input
                  type="text"
                  value={editedFamille?.cotisation?.facture?.typePaiement || ''}
                  onChange={(e) => handleInputChange('cotisation.facture.typePaiement', e.target.value)}
                  className="w-full border p-2 rounded"
                />
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
