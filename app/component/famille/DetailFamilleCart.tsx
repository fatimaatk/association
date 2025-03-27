import { IFamille } from '@/models/interfaceFamilles'
import { Dot, Trash } from 'lucide-react'
import React, { SetStateAction, useState } from 'react'
import UpdateFamilleModal from './UpdateFamille'
import DeleteFamilleModal from './DeleteFamilleModal'

interface IProps {
  famille: IFamille
  setFamilleIsUpdated: React.Dispatch<SetStateAction<boolean>>;
  deleteFamille: (id: string) => void
}

export function formatDateToDDMMYYYY(date: Date | null | undefined): string {
  if (!date) return "";
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
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

  const confirmDeleteFamille = (id: string) => {
    deleteFamille(id)
    setOpenModalDelete(false)
  }


  return (
    <div className="mb-6 shadow bg-white rounded-lg space-y-4 border">
      <div>
        <ul className="divide-y divide-gray-200">
          <li className="px-4 sm:px-6 py-4 sm:py-6">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-lg sm:text-xl">Informations générales</span>
            </div>
            <div className="space-y-2 text-sm sm:text-base">
              <p className="text-gray-700">
                <span className='font-semibold'>Représentant familial :</span>
                <span className='uppercase ml-2'>
                  {famille.chefFamille.nom} {famille.chefFamille.prenom}
                </span>
              </p>
              <p className="text-gray-700">
                <span className='font-semibold'>Adresse :</span>
                <span className="ml-2">{famille.adresse}</span>
              </p>
              <p className="text-gray-700">
                <span className='font-semibold'>Adresse Email :</span>
                <span className="ml-2">{famille.adresseEmail}</span>
              </p>
              <p className="text-gray-700">
                <span className='font-semibold'>Type de famille :</span>
                <span className="ml-2">{famille.type.nom}</span>
              </p>
            </div>
          </li>

          <li className="px-4 sm:px-6 py-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-lg sm:text-xl">Membres</span>
            </div>
            <div className="space-y-2">
              {famille.membres.map((membre, index) => (
                <span className="text-gray-700 uppercase flex items-center text-sm sm:text-base" key={index}>
                  <Dot className="mr-1" size={16} />
                  {membre.nom} {membre.prenom}
                </span>
              ))}
            </div>
          </li>

          <li className="px-4 sm:px-6 py-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-lg sm:text-xl">Cotisations</span>
            </div>
            <div className="space-y-2 text-sm sm:text-base">
              <p className="text-gray-700">
                <span className='font-semibold'>Montant :</span>
                <span className="ml-2">{famille?.cotisation?.montant} €</span>
              </p>
              <p className="text-gray-700">
                <span className='font-semibold'>Statut du paiement :</span>
                <span className="ml-2">{famille?.cotisation?.facture?.statutPaiement}</span>
              </p>
              <p className="text-gray-700">
                <span className='font-semibold'>Mode de paiement :</span>
                <span className="ml-2">{famille?.cotisation?.facture?.typePaiement}</span>
              </p>
              <p className="text-gray-700">
                <span className='font-semibold'>Date de paiement :</span>
                <span className="ml-2">{formatDateToDDMMYYYY(famille?.cotisation?.facture?.datePaiement)}</span>
              </p>
            </div>
          </li>
        </ul>
      </div>

      <div className='flex gap-2 justify-end p-4'>
        <UpdateFamilleModal
          famille={famille}
          onUpdate={setCurrentFamille}
          setFamilleIsUpdated={setFamilleIsUpdated}
        />
        <button
          onClick={onDeleteModal}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <Trash className="text-gray-500 hover:text-gray-700" size={20} />
        </button>
        {openModalDelete && currentFamille?.id && (
          <DeleteFamilleModal
            confirmDeleteFamille={confirmDeleteFamille}
            cancelDeleteFamille={cancelDeleteFamille}
            id={currentFamille.id}
          />
        )}
      </div>
    </div>
  )
}

export default DetailFamilleCart