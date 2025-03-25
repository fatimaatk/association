// Types d'énumération
export type StatutPaiement = 'ACQUITTE' | 'EN_ATTENTE';
export type TypePaiement = 'ESPECE' | 'VIREMENT' | 'CHEQUE';

// Interface pour un membre de la famille
export interface IMembre {
  id: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
}

// Interface pour le type de la famille
export interface ITypeFamille {
  id: string;
  nom: string;
}

// Interface pour la cotisation
export interface ICotisation {
  id?: string;
  montant?: number;
  facture: {
    id?: string;
    typePaiement?: TypePaiement | null;
    statutPaiement?: StatutPaiement | null;
    datePaiement?: Date | null;
  } | null;
}

export interface IMembres {
  id: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
}

// Interface pour une famille
export interface IFamille {
  id: string;
  typeFamilleId: string;
  type: ITypeFamille;
  chefFamille: {
    id: string;
    nom: string;
    prenom: string;
    dateNaissance: string;
  };
  membres: IMembres[];
  cotisation?: ICotisation | null;
  adresse: string;
  adresseEmail: string;
  telephone: string;
}

//interface pour l'importation des familles via excel 
export interface IFamilleImport {
  chefFamille_nom: string;
  chefFamille_prenom: string;
  chefFamille_dateNaissance: Date;
  typeFamille_nom: string;
  adresse: string;
  adresseEmail?: string; // Optionnel
  telephone?: string; // Optionnel
  montant_cotisation?: number; // Optionnel
  typePaiement?: TypePaiement; // Optionnel
  statutPaiement?: StatutPaiement; // Optionnel
  datePaiement?: Date; // Optionnel 
}

export interface IMembreImport { familleChefNom: string; familleChefPrenom: string; nom: string; prenom: string; dateNaissance: Date } 