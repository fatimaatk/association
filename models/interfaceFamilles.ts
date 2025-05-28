import { StatutMembre, StatutPaiement, TypePaiement, TypeFamille } from '@prisma/client';

// Interface pour un membre
export interface IMembres {
  id: string;
  nom: string;
  prenom: string;
  dateNaissance: Date;
  familleId: string | null;
  associationId: string;
  createdAt: Date;
  updatedAt: Date;
  dateEntree: Date;
  dateSortie: Date | null;
  statut: StatutMembre;
  annee: number;
}

// Interface pour le type de famille
export interface ITypeFamille {
  id: string;
  nom: string;
  associationId: string;
}

// Interface pour la cotisation
export interface ICotisation {
  id: string;
  familleId: string;
  montant: number;
  facture: {
    id: string;
    cotisationId: string;
    typePaiement: TypePaiement | null;
    statutPaiement: StatutPaiement | null;
    datePaiement: Date | null;
    associationId: string;
  } | null;
  associationId: string;
}

// Interface pour une famille
export interface IFamille {
  id: string;
  typeFamilleId: string;
  type: ITypeFamille;
  chefFamilleId: string;
  chefFamille: {
    id: string;
    nom: string;
    prenom: string;
    dateNaissance: Date | string;
    associationId: string;
  };
  membres: IMembres[];
  cotisation: ICotisation | null;
  adresse: string;
  adresseEmail: string;
  telephone: string;
  associationId: string;
}

// Interface pour l'importation des familles
export interface IFamilleImport {
  chefFamille_nom: string;
  chefFamille_prenom: string;
  chefFamille_dateNaissance: Date;
  typeFamille_nom: string;
  adresse?: string;
  adresseEmail?: string;
  telephone?: string;
  montant_cotisation?: number;
  typePaiement?: string;
  statutPaiement?: string;
  datePaiement?: Date;
  dateEntree?: Date;
  dateSortie?: Date;
  statut?: string;
}

// Interface pour l'importation des membres
export interface IMembreImport {
  nom: string;
  prenom: string;
  dateNaissance: Date;
  familleChefNom: string;
  familleChefPrenom: string;
  dateEntree?: Date;
  dateSortie?: Date;
  statut?: string;
}

// Ré-export des types Prisma
export type { StatutMembre, StatutPaiement, TypePaiement, TypeFamille };

// Fonctions utilitaires
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