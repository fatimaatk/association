import React, { useState } from 'react'

interface IProps {
  id: string
}
const AttestationPaiement = ({ handleNewInvoice }) => {
  return (
    <>

      <div className="gap-4 max-w-lg">
        <div className="cursor-pointer border border-accent rounded-xl flex flex-col justify-center items-center p-5"
          onClick={handleNewInvoice}>
          <div className="font-bold text-accent">
            Créer une attestation de paiement
          </div>

        </div>
      </div>


    </>
  )
}

export default AttestationPaiement