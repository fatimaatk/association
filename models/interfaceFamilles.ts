import { StatutMembre, StatutPaiement, TypePaiement } from '@prisma/client';

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

export { StatutMembre, StatutPaiement, TypePaiement }; 