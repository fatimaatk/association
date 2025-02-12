export interface IMembre {
  id: string
  nom: string
  prenom: string
  dateNaissance: Date
}

export interface IFamille {
  id: string
  typeFamilleId: string
  type: {
    id: string
    nom: string
  }
  representantId: string
  representant: IMembre
  membres: IMembre[]
  cotisation?: {
    id: string
    montant: number
    facture?: {
      id: string
      typePaiement?: string
      statutPaiement: string
      datePaiement?: Date
    }
  }
  adresse: string
  adresseEmail: string
}