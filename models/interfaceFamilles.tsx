// Types d'énumération
export enum TypePaiement {
  ESPECE = "ESPECE",
  VIREMENT = "VIREMENT",
  CHEQUE = "CHEQUE"
}

export enum StatutPaiement {
  ACQUITTE = "ACQUITTE",
  EN_ATTENTE = "EN_ATTENTE"
}

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
    typePaiement?: string | null;
    statutPaiement?: string | null;
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
  typePaiement?: string | null;
  statutPaiement?: string | null;
  datePaiement?: Date; // Optionnel 
}

export interface IMembreImport { familleChefNom: string; familleChefPrenom: string; nom: string; prenom: string; dateNaissance: Date }

export function convertToEnum<T>(value: string | null): T | null {
  if (!value) return null;
  return value as unknown as T;
}

export function getTypePaiement(value: string | null | undefined): TypePaiement | null {
  if (!value) return null;
  const upperValue = value.toUpperCase();
  if (upperValue in TypePaiement) {
    return TypePaiement[upperValue as keyof typeof TypePaiement];
  }
  return null;
}

export function getStatutPaiement(value: string | null | undefined): StatutPaiement | null {
  if (!value) return null;
  const upperValue = value.toUpperCase();
  if (upperValue in StatutPaiement) {
    return StatutPaiement[upperValue as keyof typeof StatutPaiement];
  }
  return null;
}