'use client';

import { useEffect, useState } from 'react';
import { Info, Trash2 } from 'lucide-react';
import { ITypeFamille } from '@/models/interfaceFamilles';
import { Dialog, DialogContent, DialogTitle } from '@radix-ui/react-dialog';
import { CheckCircle, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation';
import AddressAutocomplete from '../AddressAutocomplete';


interface Props {
  types: ITypeFamille[];
}

export interface MembreFormData {
  nom: string;
  prenom: string;
  dateNaissance: string;
}

interface CotisationFormData {
  montant: string;
  facture: {
    typePaiement?: string;
    statutPaiement?: string;
    datePaiement: string;
  };
}

interface FormErrors {
  typeFamille?: string;
  chefFamille?: {
    nom?: string;
    prenom?: string;
    dateNaissance?: string;
  };
  adresse?: string;
  adresseEmail?: string;
  telephone?: string;
  membres?: { [key: number]: { [key: string]: string } };
  cotisation?: {
    montant?: string;
    facture?: {
      typePaiement?: string;
      statutPaiement?: string;
      datePaiement?: string;
    };
  };
  submit?: string;
}
type NestedErrors = {
  [key: string]: NestedErrors | unknown;
};

export default function FormAjoutFamille({ types }: Props) {
  const router = useRouter();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [typeFamilleId, setTypeFamilleId] = useState('');
  const [typeFamilleNom, setTypeFamilleNom] = useState('');
  const [chefFamille, setChefFamille] = useState<MembreFormData>({ nom: '', prenom: '', dateNaissance: '' });
  const [membres, setMembres] = useState<MembreFormData[]>([]);
  const [adresse, setAdresse] = useState('');
  const [adresseEmail, setAdresseEmail] = useState('');
  const [telephone, setTelephone] = useState('');

  const [cotisation, setCotisation] = useState<CotisationFormData>({ montant: '50', facture: { datePaiement: '' } });
  const [errors, setErrors] = useState<FormErrors>({});

  const isEnAttente = cotisation.facture.statutPaiement === 'EN_ATTENTE';

  useEffect(() => {
    if (!cotisation.facture.statutPaiement) {
      setCotisation(prev => ({ ...prev, facture: { ...prev.facture, statutPaiement: 'EN_ATTENTE' } }));
    }
  }, [cotisation.facture.statutPaiement]);

  const clearError = (path: string[]) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      let current: NestedErrors = newErrors;
      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) return newErrors;
        current = current[path[i]] as NestedErrors;
      }
      delete current[path[path.length - 1]];
      return newErrors;
    });
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!typeFamilleId) {
      newErrors.typeFamille = 'Le type de famille est requis';
    }

    if (!chefFamille.nom) {
      newErrors.chefFamille = { ...newErrors.chefFamille, nom: 'Le nom est requis' };
    }
    if (!chefFamille.prenom) {
      newErrors.chefFamille = { ...newErrors.chefFamille, prenom: 'Le prénom est requis' };
    }
    if (!chefFamille.dateNaissance) {
      newErrors.chefFamille = { ...newErrors.chefFamille, dateNaissance: 'La date de naissance est requise' };
    }

    if (!adresse) {
      newErrors.adresse = "L'adresse est requise";
    }


    if (!adresseEmail) {
      newErrors.adresseEmail = "L'adresse email est requise";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adresseEmail)) {
      newErrors.adresseEmail = "L'adresse email n'est pas valide";
    }

    if (membres.length > 0) {
      const membresErrors: { [key: number]: { [key: string]: string } } = {};
      membres.forEach((membre, index) => {
        const membreErrors: { [key: string]: string } = {};
        if (!membre.nom) membreErrors.nom = 'Le nom est requis';
        if (!membre.prenom) membreErrors.prenom = 'Le prénom est requis';
        if (!membre.dateNaissance) membreErrors.dateNaissance = 'La date de naissance est requise';
        if (Object.keys(membreErrors).length > 0) membresErrors[index] = membreErrors;
      });
      if (Object.keys(membresErrors).length > 0) {
        newErrors.membres = membresErrors;
      }
    }

    const statut = cotisation.facture.statutPaiement;
    const type = cotisation.facture.typePaiement;
    const date = cotisation.facture.datePaiement;

    if (cotisation.montant || type || statut) {
      if (!cotisation.montant || isNaN(Number(cotisation.montant))) {
        newErrors.cotisation = {
          ...newErrors.cotisation,
          montant: 'Un montant valide est requis',
        };
      }

      if (!statut) {
        newErrors.cotisation = {
          ...newErrors.cotisation,
          facture: {
            ...newErrors.cotisation?.facture,
            statutPaiement: 'Le statut de paiement est requis',
          },
        };
      } else if (statut === 'ACQUITTE') {
        const factureErrors: { [key: string]: string } = {};
        if (!type) factureErrors.typePaiement = 'Le type de paiement est requis';
        if (!date) factureErrors.datePaiement = 'La date de paiement est requise';

        if (Object.keys(factureErrors).length > 0) {
          newErrors.cotisation = {
            ...newErrors.cotisation,
            facture: {
              ...newErrors.cotisation?.facture,
              ...factureErrors,
            },
          };
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const ajouterMembre = () => {
    setMembres([...membres, { nom: '', prenom: '', dateNaissance: '' }]);
  };

  const supprimerMembre = (index: number) => {
    setMembres(membres.filter((_, i) => i !== index));
    clearError(['membres', index.toString()]);
  };

  const updateMembre = (index: number, field: keyof MembreFormData, value: string) => {
    const nouveauxMembres = [...membres];
    nouveauxMembres[index] = { ...nouveauxMembres[index], [field]: value };
    setMembres(nouveauxMembres);
    clearError(['membres', index.toString(), field]);
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    const generateChefId = (nom: string, prenom: string, date: string) => {
      const year = new Date(date).getFullYear();
      return `${nom}_${prenom}_${year}`.toLowerCase().replace(/\s+/g, '');
    };

    const chefId = generateChefId(chefFamille.nom, chefFamille.prenom, chefFamille.dateNaissance);
    const membresComplets = [
      { ...chefFamille, id: chefId, isRepresentant: true },
      ...membres.map(m => ({
        ...m,
        id: generateChefId(m.nom, m.prenom, m.dateNaissance)
      }))
    ];
    const type = types.find(t => t.id === typeFamilleId);
    const payload = {
      type,
      typeFamilleId,
      chefFamille: chefFamille,
      membres: membresComplets,
      adresse,
      adresseEmail,
      telephone,
      cotisation: cotisation.montant ? {
        montant: Number(cotisation.montant),
        facture: {
          typePaiement: cotisation.facture.typePaiement || undefined,
          statutPaiement: cotisation.facture.statutPaiement || undefined,
          datePaiement: cotisation.facture.datePaiement || undefined
        }
      } : null
    };

    try {
      const res = await fetch('/api/ajout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Une erreur est survenue");
      }
      setShowSuccessDialog(true);
      // Redirection après 5 secondes
      setTimeout(() => {
        router.push(`/famille/${data.famille.id}`);
      }, 2500);
    } catch (error) {
      console.error(error);
      setErrors({ submit: "Une erreur est survenue lors de la création de la famille" });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="max-w-3xl mx-auto bg-white p-6 shadow-md rounded-xl">
      <h1 className="text-2xl font-semibold mb-2 text-[#00B074] flex items-center gap-2">
        Créer une nouvelle famille
        <div className="tooltip tooltip-right" data-tip="Pour pouvoir ajouter un membre, il faut sélectionner le type de famille : regroupé">
          <Info size={20} className="text-gray-500" />
        </div>
      </h1>
      <p className="text-gray-600 mb-4">Veuillez remplir le formulaire ci-dessous.</p>

      {errors.submit && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 border border-red-300">{errors.submit}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Type de Famille */}
        <div className="border p-4 rounded-xl bg-gray-50">
          <h2 className="font-semibold mb-2">Type de famille</h2>
          <div className="flex flex-wrap gap-4">
            {types.map((type: ITypeFamille, index: number) => (
              <label key={index} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="typeFamilleId"
                  value={type.id}
                  className="radio border-gray-300"
                  onChange={(e) => {
                    setTypeFamilleNom(type.nom);
                    setTypeFamilleId(e.target.value);
                    clearError(['typeFamille']);
                  }}
                />
                {type.nom}
              </label>
            ))}
          </div>
          {errors.typeFamille && <p className="text-sm text-red-500 mt-2">{errors.typeFamille}</p>}
        </div>

        {/* Coordonnées Chef Famille */}
        <div className="border p-4 rounded-xl bg-gray-50">
          <h2 className="font-semibold mb-4">Représentant</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Nom*</label>
              <input
                type="text"
                value={chefFamille.nom}
                onChange={(e) => {
                  setChefFamille({ ...chefFamille, nom: e.target.value });
                  clearError(['chefFamille', 'nom']);
                }}
                className={`input input-bordered w-full ${errors.chefFamille?.nom ? 'border-red-500' : ''}`}
              />
              {errors.chefFamille?.nom && <p className="text-sm text-red-500">{errors.chefFamille.nom}</p>}
            </div>
            <div>
              <label className="block mb-1">Prénom*</label>
              <input
                type="text"
                value={chefFamille.prenom}
                onChange={(e) => {
                  setChefFamille({ ...chefFamille, prenom: e.target.value });
                  clearError(['chefFamille', 'prenom']);
                }}
                className={`input input-bordered w-full ${errors.chefFamille?.prenom ? 'border-red-500' : ''}`}
              />
              {errors.chefFamille?.prenom && <p className="text-sm text-red-500">{errors.chefFamille.prenom}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block mb-1">Date de naissance*</label>
              <input
                type="date"
                value={chefFamille.dateNaissance}
                onChange={(e) => {
                  setChefFamille({ ...chefFamille, dateNaissance: e.target.value });
                  clearError(['chefFamille', 'dateNaissance']);
                }}
                className={`input input-bordered w-full ${errors.chefFamille?.dateNaissance ? 'border-red-500' : ''}`}
              />
              {errors.chefFamille?.dateNaissance && <p className="text-sm text-red-500">{errors.chefFamille.dateNaissance}</p>}
            </div>
          </div>
        </div>

        {/* Coordonnées */}
        <div className="border p-4 rounded-xl bg-gray-50">
          <h2 className="font-semibold mb-4">Coordonnées de contact</h2>
          <div className="space-y-4">
            <div>
              <label className="block mb-1">
                Adresse* <span className="text-xs text-gray-400">(autocomplétion)</span>
              </label>
              <AddressAutocomplete
                value={adresse}
                onChange={(value: string) => {
                  setAdresse(value);
                  clearError(['adresse']);
                }}
                className={`input input-bordered w-full ${errors.adresse ? 'border-red-500' : ''}`}
              />
              {errors.adresse && <p className="text-sm text-red-500">{errors.adresse}</p>}
            </div>
            <div>
              <label className="block mb-1">Adresse Email*</label>
              <input
                type="email"
                value={adresseEmail}
                onChange={(e) => {
                  setAdresseEmail(e.target.value);
                  clearError(['adresseEmail']);
                }}
                className={`input input-bordered w-full ${errors.adresseEmail ? 'border-red-500' : ''}`}
              />
              {errors.adresseEmail && <p className="text-sm text-red-500">{errors.adresseEmail}</p>}
            </div>
          </div>
          <div>
            <label className="block mb-1">Téléphone</label>
            <input
              type="telephone"
              value={telephone}
              onChange={(e) => {
                setTelephone(e.target.value);
                clearError(['telephone']);
              }}
              className={`input input-bordered w-full ${errors.telephone ? 'border-red-500' : ''}`}
            />
            {errors.telephone && <p className="text-sm text-red-500">{errors.telephone}</p>}
          </div>
        </div>

        {/* Membres additionnels */}
        {
          typeFamilleNom === "Famille" && (
            <div className="border p-4 rounded-xl bg-gray-50">
              <h2 className="font-semibold mb-4">Membres additionnels</h2>
              <button
                type="button"
                onClick={ajouterMembre}
                className="btn bg-success text-white mb-4"
              >
                Ajouter un membre
              </button>
              {membres.map((membre, index) => (
                <div key={index} className="border p-4 rounded mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold">Membre {index + 2}</h3>
                    <button
                      type="button"
                      onClick={() => supprimerMembre(index)}
                      className="btn bg-error text-white flex gap-2"
                    >
                      Supprimer
                      <Trash2 />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="Nom"
                      value={membre.nom}
                      onChange={(e) => updateMembre(index, 'nom', e.target.value)}
                      className="input input-bordered w-full"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Prénom"
                      value={membre.prenom}
                      onChange={(e) => updateMembre(index, 'prenom', e.target.value)}
                      className="input input-bordered w-full"
                      required
                    />
                    <input
                      type="date"
                      value={membre.dateNaissance}
                      onChange={(e) => updateMembre(index, 'dateNaissance', e.target.value)}
                      className="input input-bordered w-full"
                      required
                    />
                  </div>
                </div>
              ))}
            </div>
          )
        }

        {/* Cotisation */}
        <div className="border p-4 rounded-xl bg-gray-50">
          <h2 className="font-semibold mb-4">Cotisation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Montant (€)</label>
              <input
                type="number"
                step="0.01"
                required
                value={cotisation.montant}
                onChange={(e) => setCotisation({ ...cotisation, montant: e.target.value })}
                className={`input input-bordered w-full  ${errors.cotisation?.montant ? 'border-red-500' : ''}`}
              />
              {errors.cotisation?.montant && <p className="text-sm text-red-500">{errors.cotisation.montant}</p>}
            </div>
            <div>
              <label className="block mb-1">Type de paiement</label>
              <select
                value={cotisation.facture.typePaiement ?? ''}
                onChange={(e) => setCotisation({
                  ...cotisation,
                  facture: { ...cotisation.facture, typePaiement: e.target.value || undefined },
                })}
                className="select select-bordered w-full"
                disabled={isEnAttente}
              >
                <option value="">Sélectionner</option>
                <option value="ESPECE">Espèce</option>
                <option value="VIREMENT">Virement</option>
                <option value="CHEQUE">Chèque</option>
              </select>
            </div>
            <div>
              <label className="block mb-1">Statut du paiement</label>
              <select
                value={cotisation.facture.statutPaiement ?? ''}
                onChange={(e) => setCotisation({
                  ...cotisation,
                  facture: { ...cotisation.facture, statutPaiement: e.target.value || undefined },
                })}
                className="select select-bordered w-full"
              >
                <option value="">Sélectionner</option>
                <option value="ACQUITTE">Acquitté</option>
                <option value="EN_ATTENTE">En attente</option>
              </select>
            </div>
            <div>
              <label className="block mb-1">Date de paiement</label>
              <input
                type="date"
                value={cotisation.facture.datePaiement || ''}
                onChange={(e) => setCotisation({
                  ...cotisation,
                  facture: { ...cotisation.facture, datePaiement: e.target.value },
                })}
                className="input input-bordered w-full"
                disabled={isEnAttente}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors flex items-center justify-center gap-2
                ${isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#00B074] hover:bg-[#009A63]'
              }`}>
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
              </>
            ) : (
              'Créer la famille'
            )}



          </button>
        </div>
      </form >
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <DialogTitle asChild>
              <div className="flex items-center gap-2 mb-4 text-[#00B074]">
                <CheckCircle className="w-6 h-6" />
                <h2 className="text-xl font-semibold">La famille a été ajoutée avec succès !</h2>
              </div>
            </DialogTitle>

            <div className="py-4">
              <p className="text-center text-gray-600 mb-4">
                Votre fichier a été importé avec succès !
              </p>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <h3 className="font-medium text-gray-700 mb-2">Récapitulatif :</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between items-center">
                    <span className="text-gray-600">Famille :</span>
                    <span className="font-medium text-[#00B074] bg-[#00B074]/10 px-3 py-1 rounded-full">
                      {chefFamille.nom} {chefFamille.prenom}
                    </span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                Redirection vers la page de famille...
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div >
  );
}
