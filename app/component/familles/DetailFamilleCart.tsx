import { IFamille } from '@/models/interfaceFamilles'
import { Pencil } from 'lucide-react'
import React, { useState } from 'react'
import UpdateFamilleModal, { formatDateToYYYYMMDD } from './updateFamille'

interface IProps {
  famille: IFamille
  setFamilleIsUpdated: any
}

export function formatDateToDDMMYYYY(date) {
  if (!date) return "";
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0'); // Les mois commencent à 0
  const day = String(d.getDate()).padStart(2, '0');
  return `${day}-${month}-${year}`;
}
const DetailFamilleCart = ({ famille, setFamilleIsUpdated }: IProps) => {
  const [currentFamille, setCurrentFamille] = useState<IFamille>();

  return (
    <div className="border-base-300 border mb-6 max-w-lg rounded-lg">
      <div>
        <ul className="bg-white  shadow divide-y divide-gray-200 ">
          <li className="grid column px-6 py-4 gap-2">
            <div className='flex justify-between'>

              <span className="text-gray-500 text-xs">Type de famille : {famille.type.nom}</span>

              <UpdateFamilleModal
                famille={famille}
                onUpdate={setCurrentFamille}
                setFamilleIsUpdated={setFamilleIsUpdated}
              />

            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-lg">Informations générales</span>
            </div>
            <p className="text-gray-700"><strong>Représentant familial :
            </strong> {famille.representant.nom} {famille.representant.prenom}</p>
            <p className="text-gray-700"><strong>Adresse :
            </strong> {famille.adresse}</p>
            <p className="text-gray-700"><strong>Adresse Email :
            </strong> {famille.adresseEmail}</p>
          </li>
          <li className="grid column px-6 py-4 gap-2">
            <div className="flex justify-between">
              <span className="font-semibold text-lg">Membres</span>
            </div>
            {famille.membres.map((membre, index) => (
              <span className="text-gray-700" key={index}>{index + 1} - {membre.nom} {membre.prenom} </span>
            ))}
          </li>
          <li className="grid column px-6 py-4 gap-2">
            <div className="flex justify-between">
              <span className="font-semibold text-lg">Cotisations</span>
            </div>
            <p className="text-gray-700"><strong>Montant :
            </strong> {famille?.cotisation?.montant} € </p>
            <p className="text-gray-700"><strong>Statut du paiement :
            </strong> {famille?.cotisation?.facture?.statutPaiement}</p>
            <p className="text-gray-700"><strong>Mode de paiement :
            </strong> {famille?.cotisation?.facture?.typePaiement}</p>
            <p className="text-gray-700"><strong>Date de paiement:
            </strong> {formatDateToDDMMYYYY(famille?.cotisation?.facture?.datePaiement)}</p>
          </li>
        </ul>
      </div>
    </div>




  )
}

export default DetailFamilleCart