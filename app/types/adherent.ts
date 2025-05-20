export type StatutPaiement = 'EN_ATTENTE' | 'ACQUITTE';

export type TypePaiement = 'CARTE' | 'VIREMENT' | 'CHEQUE' | 'ESPECES';

export interface Facture {
  id: string;
  statutPaiement: StatutPaiement;
  typePaiement: TypePaiement;
  datePaiement: Date | null;
}

export interface Cotisation {
  id: string;
  montant: number;
  facture: Facture;
}

export interface Adherent {
  id: string;
  nom: string;
  prenom: string;
  cotisation: Cotisation[];
  adresse: string;
  adresseEmail: string;
  telephone: string;
} 