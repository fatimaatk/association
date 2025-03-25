"use client"

import { useCallback, useEffect, useRef, useState } from "react";
import DetailFamilleCart from "@/app/component/famille/DetailFamilleCart";
import { InvoicePaiement } from "@/app/component/invoices/invoicePaiement";
import Loader from "@/app/component/loader";
import { IFamille } from "@/models/interfaceFamilles";
import confetti from "canvas-confetti";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { ArrowDownFromLine, FileUser } from "lucide-react";

interface IProps {
  initialData: IFamille | null;
  id: string;
}

export default function ClientFamilleDetails({ initialData, id }: IProps) {
  const factureRef = useRef<HTMLDivElement | null>(null);
  const [famille, setFamille] = useState<IFamille | null>(initialData);
  const [isGenerating, setIsGenerating] = useState(false);
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
      const payload = {
        id
      };

      const res = await fetch(`/api/familles/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error("Famille non supprimée");
      }
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        zIndex: 9999,
      });
      await res.json();
      fetchFamille();
    } catch (error) {
      console.error("Erreur lors du chargement des factures", error);
    }
  };

  const handleDownloadPdf = async () => {
    const element = factureRef.current;
    if (element) {
      setIsGenerating(true);
      try {
        const canvas = await html2canvas(element, { scale: 3, useCORS: true });
        const imgData = canvas.toDataURL('image/png');

        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'A4',
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`facture-${famille?.chefFamille?.nom}.pdf`);

        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          zIndex: 9999,
        });
      } catch (error) {
        console.error('Erreur lors de la génération du PDF :', error);
      } finally {
        setIsGenerating(false);
      }
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
        <div className="relative mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-xl sm:text-2xl font-semibold uppercase flex items-center gap-2">
              <FileUser size={24} className="sm:w-[30px] sm:h-[30px]" color='#00B074' />
              {famille?.chefFamille?.nom} {famille?.chefFamille?.prenom}
            </h1>

            <button
              onClick={handleDownloadPdf}
              disabled={isGenerating}
              className="btn btn-m bg-[#00B074] text-white w-full sm:w-auto"
            >
              {isGenerating ? 'Génération...' : 'Télécharger PDF'}
              <ArrowDownFromLine className="w-4" />
            </button>
          </div>
          <div className="flex flex-col lg:flex-row gap-6 mt-5">
            <div className="w-full lg:w-1/3">
              <DetailFamilleCart
                famille={famille}
                setFamilleIsUpdated={setFamilleIsUpdated}
                deleteFamille={deleteFamille}
              />
            </div>
            <div className="w-full lg:w-2/3">
              <InvoicePaiement famille={famille} factureRef={factureRef} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}