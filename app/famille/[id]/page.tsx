
"use client";
import DetailFamilleCart from "@/app/component/familles/DetailFamilleCart";
import AttestationPaiement from "@/app/component/invoices/AttestationPaiement";
import { InvoicePaiement } from "@/app/component/invoices/invoicePaiement";
import Loader from "@/app/component/loader";
import Wrapper from "@/app/component/Wrapper";
import { IFamille } from "@/models/interfaceFamilles";
import confetti from "canvas-confetti";
import { ArrowDownFromLine, File, FileUser } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";



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
      setFamilleIsUpdated(false)
    } catch (error) {
      console.error("Erreur lors du chargement des factures", error);
    } finally {
      setFamilleIsUpdated(false)
      setLoading(false);
    }
  }

  const deleteFamille = async (id) => {
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
      const data = await res.json();
      fetchFamille()
    } catch (error) {
      console.error("Erreur lors du chargement des factures", error);
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

  const factureRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

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
        pdf.save(`facture-${famille.representant.nom}.pdf`);

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

  return (
    <Wrapper>
      {loading ?
        <Loader loading={loading} />
        :
        <div className=" flex-1    rounded-lg">
          <div className="relative mb-6">
            <div className="flex justify-between items-center">

              <h1 className="text-2xl font-semibold uppercase flex items-center gap-2"> <FileUser size={30} color='#00B074' />{famille?.representant?.nom} {famille?.representant?.prenom}</h1 >

              <button
                onClick={handleDownloadPdf}
                disabled={isGenerating}
                className="btn btn-m bg-[#00B074] text-white  "
              >
                {isGenerating ? 'Génération...' : 'Télécharger PDF'}
                <ArrowDownFromLine className="w-4" />
              </button>
            </div>
            <div className="flex flex-row gap-12 mt-5">


              <DetailFamilleCart famille={famille} setFamilleIsUpdated={setFamilleIsUpdated} deleteFamille={deleteFamille} />

              <div className="basis-2/3 ">

                <InvoicePaiement famille={famille} factureRef={factureRef} />
              </div>

            </div>
          </div>
        </div>
      }
    </Wrapper>
  );
}
