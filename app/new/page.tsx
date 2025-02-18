'use client';
import { useEffect, useState } from 'react';
import Wrapper from '../component/Wrapper';
import { Info, Trash2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import Loader from "@/app/component/loader";
import { useRouter } from 'next/navigation';

// Types pour les données du formulaire
interface MembreFormData {
  nom: string;
  prenom: string;
  dateNaissance: string;
}

interface CotisationFormData {
  montant: string;
  facture: {
    typePaiement: string;
    statutPaiement: string;
    datePaiement: string;
  };
}

// Interface pour les erreurs
interface FormErrors {
  typeFamille?: string;
  representant?: {
    nom?: string;
    prenom?: string;
    dateNaissance?: string;
  };
  adresse?: string;
  adresseEmail?: string;
  membres?: { [key: number]: { [key: string]: string } };
  cotisation?: {
    montant?: string;
    facture?: {
      typePaiement?: string;
      statutPaiement?: string;
    };
  };
  submit?: string;
}

export default function NouvelleFamille() {
  const router = useRouter();
  const [typeFamilleId, setTypeFamilleId] = useState('');
  const [representant, setRepresentant] = useState<MembreFormData>({
    nom: '',
    prenom: '',
    dateNaissance: '',
  });
  const [membres, setMembres] = useState<MembreFormData[]>([]);
  const [adresse, setAdresse] = useState('');
  const [adresseEmail, setAdresseEmail] = useState('');
  const [cotisation, setCotisation] = useState<CotisationFormData>({
    montant: '',
    facture: {
      typePaiement: '',
      statutPaiement: '',
      datePaiement: '',
    },
  });

  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = () => {
    const newErrors: FormErrors = {};

    // Validation du type de famille
    if (!typeFamilleId) {
      newErrors.typeFamille = 'Le type de famille est requis';
    }

    // Validation du représentant (requis car c'est le chef de famille)
    if (!representant.nom) {
      newErrors.representant = { ...newErrors.representant, nom: 'Le nom est requis' };
    }
    if (!representant.prenom) {
      newErrors.representant = { ...newErrors.representant, prenom: 'Le prénom est requis' };
    }
    if (!representant.dateNaissance) {
      newErrors.representant = { ...newErrors.representant, dateNaissance: 'La date de naissance est requise' };
    }

    // Validation de l'adresse et email (requis pour la famille)
    if (!adresse) {
      newErrors.adresse = "L'adresse est requise";
    }
    if (!adresseEmail) {
      newErrors.adresseEmail = "L'adresse email est requise";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adresseEmail)) {
      newErrors.adresseEmail = "L'adresse email n'est pas valide";
    }

    // Validation des membres additionnels (si présents)
    if (membres.length > 0) {
      const membresErrors: { [key: number]: { [key: string]: string } } = {};
      membres.forEach((membre, index) => {
        if (membre.nom || membre.prenom || membre.dateNaissance) {
          const membreErrors: { [key: string]: string } = {};
          if (!membre.nom) membreErrors.nom = 'Le nom est requis';
          if (!membre.prenom) membreErrors.prenom = 'Le prénom est requis';
          if (!membre.dateNaissance) membreErrors.dateNaissance = 'La date de naissance est requise';
          if (Object.keys(membreErrors).length > 0) {
            membresErrors[index] = membreErrors;
          }
        }
      });
      if (Object.keys(membresErrors).length > 0) {
        newErrors.membres = membresErrors;
      }
    }

    // Validation de la cotisation (optionnelle mais si commencée, doit être complète)
    if (cotisation.montant || cotisation.facture.typePaiement || cotisation.facture.statutPaiement) {
      if (!cotisation.montant || isNaN(Number(cotisation.montant))) {
        newErrors.cotisation = { ...newErrors.cotisation, montant: 'Un montant valide est requis' };
      }
      if (cotisation.montant && (!cotisation.facture.typePaiement || !cotisation.facture.statutPaiement)) {
        newErrors.cotisation = {
          ...newErrors.cotisation,
          facture: {
            typePaiement: !cotisation.facture.typePaiement ? 'Le type de paiement est requis' : undefined,
            statutPaiement: !cotisation.facture.statutPaiement ? 'Le statut de paiement est requis' : undefined,
          },
        };
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Function pour réinitialiser une erreur spécifique
  const clearError = (path: string[]) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      let current: any = newErrors;
      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) break;
        current = current[path[i]];
      }
      delete current[path[path.length - 1]];
      return newErrors;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const membresComplets = [
      {
        nom: representant.nom,
        prenom: representant.prenom,
        dateNaissance: representant.dateNaissance,
        isRepresentant: true,
      },
      ...membres.filter(membre => membre.nom && membre.prenom && membre.dateNaissance)
    ];

    const type = types.filter((i) => i.id == typeFamilleId)[0];
    const payload = {
      type,
      typeFamilleId,
      representant,
      membres: membresComplets,
      adresse,
      adresseEmail,
      cotisation: cotisation.montant ? {
        ...cotisation,
        montant: Number(cotisation.montant)
      } : null,
    };

    try {
      const res = await fetch('/api/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Erreur lors de la création de la famille');
      }

      const data = await res.json();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        zIndex: 9999,
      });
      setTimeout(() => {
        router.push('/')
      }, 2500);
      // Réinitialiser le formulaire ou rediriger
    } catch (error) {
      console.error(error);
      setErrors({
        ...errors,
        submit: "Une erreur est survenue lors de la création de la famille"
      });
    }
  };

  // Autres fonctions existantes...
  const fetchType = async () => {
    try {
      const res = await fetch(`/api/types`);
      if (!res.ok) {
        throw new Error("Type de familles non trouvée");
      }
      const data = await res.json();
      setTypes(data);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors du chargement des types de familles", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchType();
  }, []);

  const ajouterMembre = () => {
    setMembres([
      ...membres,
      {
        nom: '',
        prenom: '',
        dateNaissance: '',
      },
    ]);
  };

  const supprimerMembre = (index: number) => {
    setMembres(membres.filter((_, i) => i !== index));
    clearError(['membres', index.toString()]);
  };

  const updateMembre = (index: number, field: keyof MembreFormData, value: string) => {
    const nouveauxMembres = [...membres];
    nouveauxMembres[index] = {
      ...nouveauxMembres[index],
      [field]: value,
    };
    setMembres(nouveauxMembres);
    clearError(['membres', index.toString(), field]);
  };

  return (
    <Wrapper>
      {loading ?
        <Loader loading={loading} />
        :
        <div className="max-w-2xl mx-auto ">
          <h1 className="text-2xl font-bold mb-4">Créer une nouvelle famille  <div className="tooltip  tooltip-rigt" data-tip="Pour pouvoir ajouter un membre, il faut sélectionner le type de famille : regroupé">
            <Info size={20} />
          </div></h1>

          {errors.submit && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <fieldset className="border p-4 rounded bg-base-100 border-neutral">
                <legend className="px-2 font-semibold">Type de famille :</legend>
                <div className="flex flex-row">
                  {types.map((type: any, index: number) => (
                    <div className="flex flex-row gap-2 mr-5 mt-2" key={index}>
                      <label className="block mb-1">{type.nom}</label>
                      <input
                        type="radio"
                        name="typeFamilleId"
                        value={type.id}
                        defaultChecked={index === 0}
                        className={`radio ${errors.typeFamille ? 'border-red-500' : ''}`}
                        onChange={(e) => {
                          setTypeFamilleId(e.target.value);
                          clearError(['typeFamille']);
                        }}
                      />
                    </div>
                  ))}

                </div>
              </fieldset>
              {errors.typeFamille && (
                <p className="text-red-500 text-sm mt-1">{errors.typeFamille}</p>
              )}
            </div>

            <fieldset className="border p-4 rounded bg-base-100 border-neutral">
              <legend className="px-2 font-semibold">Représentant</legend>
              <div className="space-y-4">
                <div>
                  <label className="block mb-1">Nom* :</label>
                  <input
                    type="text"
                    value={representant.nom}
                    onChange={(e) => {
                      setRepresentant({ ...representant, nom: e.target.value });
                      clearError(['representant', 'nom']);
                    }}
                    className={`w-full border p-2 rounded ${errors.representant?.nom ? 'border-red-500' : ''
                      }`}
                  />
                  {errors.representant?.nom && (
                    <p className="text-red-500 text-sm mt-1">{errors.representant.nom}</p>
                  )}
                </div>
                <div>
                  <label className="block mb-1">Prénom* :</label>
                  <input
                    type="text"
                    value={representant.prenom}
                    onChange={(e) => {
                      setRepresentant({ ...representant, prenom: e.target.value });
                      clearError(['representant', 'prenom']);
                    }}
                    className={`w-full border p-2 rounded ${errors.representant?.prenom ? 'border-red-500' : ''
                      }`}
                  />
                  {errors.representant?.prenom && (
                    <p className="text-red-500 text-sm mt-1">{errors.representant.prenom}</p>
                  )}
                </div>
                <div>
                  <label className="block mb-1">Date de naissance* :</label>
                  <input
                    type="date"
                    value={representant.dateNaissance}
                    onChange={(e) => {
                      setRepresentant({ ...representant, dateNaissance: e.target.value });
                      clearError(['representant', 'dateNaissance']);
                    }}
                    className={`w-full border p-2 rounded ${errors.representant?.dateNaissance ? 'border-red-500' : ''
                      }`}
                  />
                  {errors.representant?.dateNaissance && (
                    <p className="text-red-500 text-sm mt-1">{errors.representant.dateNaissance}</p>
                  )}
                </div>
              </div>
            </fieldset>


            <fieldset className="border p-4 rounded bg-base-100 border-neutral">
              <legend className="px-2 font-semibold">Coordonnées de contact</legend>
              <div>

                <label className="block mb-1">Adresse* :</label>
                <input
                  type="text"
                  value={adresse}
                  onChange={(e) => {
                    setAdresse(e.target.value);
                    clearError(['adresse']);
                  }}
                  className={`w-full border p-2 rounded ${errors.adresse ? 'border-red-500' : ''}`}
                />
                {errors.adresse && (
                  <p className="text-red-500 text-sm mt-1">{errors.adresse}</p>
                )}

              </div>

              <div>
                <label className="block mb-1 ">Adresse Email* :</label>
                <input
                  type="email"
                  value={adresseEmail}
                  onChange={(e) => {
                    setAdresseEmail(e.target.value);
                    clearError(['adresseEmail']);
                  }}
                  className={`w-full border p-2 rounded ${errors.adresseEmail ? 'border-red-500' : ''}`}
                />
                {errors.adresseEmail && (
                  <p className="text-red-500 text-sm mt-1">{errors.adresseEmail}</p>
                )}
              </div>
            </fieldset>

            {typeFamilleId == "2a43d7f2-89a8-42eb-ad0e-07f2a8ee84fc" &&
              <fieldset className="border p-4 rounded bg-base-100 border-neutral">
                <legend className="px-2 font-semibold">Membres additionnels</legend>
                <button
                  type="button"
                  onClick={ajouterMembre}
                  className="bg-success text-white px-4 py-2 rounded mb-4"
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
                        className="bg-error text-white px-4 py-2  rounded flex gap-2"
                      >
                        Supprimer
                        <Trash2 />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <label className="block mb-1">Nom* :</label>
                        <input
                          type="text"
                          value={membre.nom}
                          onChange={(e) => updateMembre(index, 'nom', e.target.value)}
                          className={`w - full border p-2 rounded"${errors.membres ? 'border-red-500' : ''}`}
                          required
                        />
                      </div>
                      <div>
                        <label className="block mb-1">Prénom :</label>
                        <input
                          type="text"
                          value={membre.prenom}
                          onChange={(e) => updateMembre(index, 'prenom', e.target.value)}
                          className={`w - full border p-2 rounded"${errors.membres ? 'border-red-500' : ''}`}
                          required
                        />
                      </div>
                      <div>
                        <label className="block mb-1">Date de naissance :</label>
                        <input
                          type="date"
                          value={membre.dateNaissance}
                          onChange={(e) => updateMembre(index, 'dateNaissance', e.target.value)}
                          className={`w - full border p-2 rounded"${errors.membres ? 'border-red-500' : ''}`}
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </fieldset>
            }

            <fieldset className="border p-4 rounded bg-base-100 border-neutral">
              <legend className="px-2 font-semibold">Cotisation</legend>
              <div>
                <label className="block mb-1">Montant :</label>
                <input
                  type="number"
                  step="0.01"
                  value={cotisation.montant}
                  onChange={(e) =>
                    setCotisation({ ...cotisation, montant: e.target.value })
                  }
                  className="w-full border p-2 rounded"
                />
              </div>
              <fieldset className="border p-4 rounded mt-2">
                <legend className="px-2">Facture</legend>
                <div>
                  <label className="block mb-1">Type de paiement :</label>
                  <input
                    type="text"
                    value={cotisation.facture.typePaiement}
                    onChange={(e) =>
                      setCotisation({
                        ...cotisation,
                        facture: { ...cotisation.facture, typePaiement: e.target.value },
                      })
                    }
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block mb-1">Statut du paiement :</label>
                  <input
                    type="text"
                    value={cotisation.facture.statutPaiement}
                    onChange={(e) =>
                      setCotisation({
                        ...cotisation,
                        facture: { ...cotisation.facture, statutPaiement: e.target.value },
                      })
                    }
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block mb-1">Date de paiement :</label>
                  <input
                    type="date"
                    value={cotisation.facture.datePaiement}
                    onChange={(e) =>
                      setCotisation({
                        ...cotisation,
                        facture: { ...cotisation.facture, datePaiement: e.target.value },
                      })
                    }
                    className="w-full border p-2 rounded"
                  />
                </div>
              </fieldset>
            </fieldset>
            <div className='flex justify-end'>

              <button type="submit" className="btn btn-m bg-[#00B074] text-white">
                Créer la famille
              </button>
            </div>
          </form>
        </div >
      }
    </Wrapper >
  );
}