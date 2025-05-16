"use client"

import { useCallback, useEffect, useState } from "react";
import DetailFamilleCart from "@/app/component/famille/DetailFamilleCart";
import Loader from "@/app/component/ui/loader";
import { IFamille } from "@/models/interfaceFamilles";
import GeneratedPdfViewer from "../export/GeneratedPdfViewer";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { FileUser } from "lucide-react";

interface IProps {
  initialData: IFamille | null;
  id: string;
}

export default function ClientFamilleDetails({ initialData, id }: IProps) {
  const router = useRouter();
  const [famille, setFamille] = useState<IFamille | null>(initialData);
  const [loading, setLoading] = useState<boolean>(false);
  const [familleIsUpdated, setFamilleIsUpdated] = useState(false);

  const fetchFamille = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/familles/${id}`);
      if (!res.ok) {
        throw new Error("Famille non trouvée");
      }
      const data = await res.json();
      setFamille(data);
      setFamilleIsUpdated(false);
    } catch (error) {
      console.error("Erreur lors du chargement des factures", error);
    } finally {
      setFamilleIsUpdated(false);
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (familleIsUpdated) {
      fetchFamille();
    }
  }, [id, familleIsUpdated, fetchFamille]);

  const deleteFamille = async (id: string) => {
    try {
      const res = await fetch(`/api/familles/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error("Famille non supprimée");

      setTimeout(() => {
        router.push('/familles?deleted=true');
      }, 1500);
    } catch (error) {
      console.error("Erreur lors de la suppression", error);
      toast.error("Erreur lors de la suppression");
    }
  };

  if (!famille) {
    return <div>Famille non trouvée</div>;
  }

  return (
    <div className="flex-1 rounded-lg">
      {loading ? (
        <Loader loading={loading} />
      ) : (
        <div className="space-y-12">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-xl sm:text-2xl font-semibold uppercase flex items-center gap-2">
              <FileUser size={24} className="sm:w-[30px] sm:h-[30px]" color='#00B074' />
              {famille.chefFamille.nom} {famille.chefFamille.prenom}
              {famille?.cotisation?.facture?.statutPaiement && (
                <span
                  className={`inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-md
      ${famille.cotisation.facture.statutPaiement === 'ACQUITTE'
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-orange-50 text-orange-700 border border-orange-200'
                    }
    `}
                >
                  {famille.cotisation.facture.statutPaiement === 'ACQUITTE' ? (
                    <>
                      ✅ <span>Paiement effectué</span>
                    </>
                  ) : (
                    <>
                      ⏳ <span>Paiement en attente</span>
                    </>
                  )}
                </span>
              )}

            </h1>
          </div>

          <DetailFamilleCart
            famille={famille}
            setFamilleIsUpdated={setFamilleIsUpdated}
            deleteFamille={deleteFamille}
          />
          <GeneratedPdfViewer famille={famille} />



        </div>
      )}
    </div>
  );
}