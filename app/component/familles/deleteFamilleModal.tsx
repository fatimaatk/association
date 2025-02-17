import { TriangleAlert } from 'lucide-react'
import React from 'react'

const DeleteFamilleModal = ({ confirmDeleteFamille, cancelDeleteFamille, id }) => {
  return (

    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ">
      <div className="bg-white p-6 rounded-lg w-[600px] max-h-[90vh] overflow-y-auto">

        <div className="flex justify-between gap-4 align-items pt-6 pb-6">


          <h1>Attention, vous êtes sur le point de supprimer cette famille ! </h1>

        </div>
        <div className="flex justify-end gap-3">
          <button className="bg-red-500 text-white p-2 rounded" onClick={() => confirmDeleteFamille(id)}>Confirmer la suppression</button>
          <button className="bg-gray-500 text-white p-2 rounded" onClick={cancelDeleteFamille}>Annuler</button>
        </div>
      </div>
    </div>
  )
}

export default DeleteFamilleModal