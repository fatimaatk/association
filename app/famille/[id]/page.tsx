
"use client";
import DetailFamilleCart from "@/app/component/familles/DetailFamilleCart";
import AttestationPaiement from "@/app/component/invoices/AttestationPaiement";
import { InvoicePaiement } from "@/app/component/invoices/invoicePaiement";
import Loader from "@/app/component/loader";
import Wrapper from "@/app/component/Wrapper";
import { IFamille } from "@/models/interfaceFamilles";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";



export default function FamillePage() {

  const params = useParams()
  const id = params?.id as string;
  const [famille, setFamille] = useState<IFamille>([])
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newInvoice, setNewInvoice] = useState(false);
  const [familleIsUpdated, setFamilleIsUpdated] = useState(false)


  const fetchFamille = async () => {
    try {
      const res = await fetch(`/api/familles/${id}`);
      if (!res.ok) {
        throw new Error("Famille non trouvée");
      }
      const data = await res.json();
      setFamille(data);
      setLoading(false);
      setFamilleIsUpdated(false)
    } catch (error) {
      console.error("Erreur lors du chargement des factures", error);
    } finally {
      setFamilleIsUpdated(false)
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFamille()

  }, [id, familleIsUpdated])




  if (error) {
    return <h1>{error}</h1>;
  }

  if (!famille) {
    return <h1>Famille non trouvée</h1>;
  }

  const handleNewInvoice = () => {
    setNewInvoice(true)
  }
  return (
    <Wrapper>
      {loading ?
        <Loader loading={loading} />
        :
        <div className="flex flex-row gap-12">
          <div className="flex flex-col space-y-4 basis-1/3">

            <h1 className="text-lg font-bold">Tableau de bord</h1 >
            <DetailFamilleCart famille={famille} setFamilleIsUpdated={setFamilleIsUpdated} />
            <AttestationPaiement handleNewInvoice={handleNewInvoice} />
          </div>
          {newInvoice
            &&
            <div className="basis-2/3 mt-6">

              <InvoicePaiement famille={famille} />
            </div>
          }
        </div>
      }
    </Wrapper>
  );
}
