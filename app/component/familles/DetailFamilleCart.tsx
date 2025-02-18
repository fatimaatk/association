import { IFamille } from '@/models/interfaceFamilles'
import { Dot, Pencil, Trash } from 'lucide-react'
import React, { useState } from 'react'
import UpdateFamilleModal, { formatDateToYYYYMMDD } from './updateFamille'
import DeleteFamilleModal from './deleteFamilleModal'


interface IProps {
  famille: IFamille
  setFamilleIsUpdated: any
  deleteFamille: any
}

export function formatDateToDDMMYYYY(date) {
  if (!date) return "";
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0'); // Les mois commencent à 0
  const day = String(d.getDate()).padStart(2, '0');
  return `${day}-${month}-${year}`;
}
const DetailFamilleCart = ({ famille, setFamilleIsUpdated, deleteFamille }: IProps) => {
  const [currentFamille, setCurrentFamille] = useState<IFamille>();
  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);

  const onDeleteModal = () => {
    setOpenModalDelete(true)
  }

  const cancelDeleteFamille = () => {
    setOpenModalDelete(false)
  }

  const confirmDeleteFamille = (id) => {
    deleteFamille(id)
    setOpenModalDelete(false)

  }
  return (
    <div className="mb-6  shadow bg-white  rounded-lg space-y-4 basis-1/3 border">
      <div>
        <ul className=" divide-y divide-gray-200 ">
          <li className="grid column px-6 py-6 gap-2 ">

            <div className="flex justify-between items-center mb-4 ">
              <span className="font-bold text-xl">Informations générales</span>







            </div>
            <p className="text-gray-700 "><span className='font-semibold'>Représentant familial :
            </span> <span className='uppercase'>
                {famille.representant.nom} {famille.representant.prenom}
              </span>
            </p>
            <p className="text-gray-700"><span className='font-semibold'>Adresse :
            </span> {famille.adresse}</p>
            <p className="text-gray-700"><span className='font-semibold'>Adresse Email :
            </span> {famille.adresseEmail}</p>
            <span className="text-gray-700"><span className='font-semibold'>Type de famille :
            </span> {famille.type.nom}</span>
          </li>
          <li className="grid column px-6 py-4 gap-2">

            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-xl">Membres</span>
            </div>
            {famille.membres.map((membre, index) => (
              <span className="text-gray-700 uppercase flex" key={index}><Dot /> {membre.nom} {membre.prenom} </span>
            ))}
          </li>
          <li className="grid column px-6 py-4 gap-2">
            <div className="flex justify-between items-center mb-2 ">
              <span className="font-bold text-xl">Cotisations</span>
            </div>
            <p className="text-gray-700"><span className='font-semibold'>Montant :
            </span> {famille?.cotisation?.montant} € </p>
            <p className="text-gray-700"><span className='font-semibold'>Statut du paiement :
            </span> {famille?.cotisation?.facture?.statutPaiement}</p>
            <p className="text-gray-700"><span className='font-semibold'>Mode de paiement :
            </span> {famille?.cotisation?.facture?.typePaiement}</p>
            <p className="text-gray-700"><span className='font-semibold'>Date de paiement:
            </span> {formatDateToDDMMYYYY(famille?.cotisation?.facture?.datePaiement)}</p>
          </li>
        </ul>
      </div>
      <div className='flex gap-2 justify-end pr-4'>
        <UpdateFamilleModal
          famille={famille}
          onUpdate={setCurrentFamille}
          setFamilleIsUpdated={setFamilleIsUpdated}
        />
        <button onClick={onDeleteModal}>
          <Trash className="text-gray-500 hover:text-gray-700" size={20} />
        </button>
        {openModalDelete && <DeleteFamilleModal confirmDeleteFamille={confirmDeleteFamille} cancelDeleteFamille={cancelDeleteFamille} id={currentFamille?.id} />}
      </div>
    </div>




  )
}

export default DetailFamilleCart