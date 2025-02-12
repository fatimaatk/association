import html2canvas from 'html2canvas-pro';
import React, { useRef, useState } from 'react';
import jsPDF from 'jspdf';
import confetti from 'canvas-confetti';
import { ArrowDownFromLine } from 'lucide-react';

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };
  return date.toLocaleDateString('fr-FR', options);
}

function getFormattedDate(): string {
  const today = new Date();
  return today.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
export const InvoicePaiement = ({ famille }) => {
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
    <div className="mt-4">
      <div className="border-2 border-dashed rounded-xl p-5">
        <button
          onClick={handleDownloadPdf}
          disabled={isGenerating}
          className="btn btn-sm btn-accent m-4"
        >
          {isGenerating ? 'Génération...' : 'Télécharger PDF'}
          <ArrowDownFromLine className="w-4" />
        </button>

        <div
          className="p-12 bg-white rounded-lg shadow-md"
          ref={factureRef}
          data-pdf-content
        // style={{ maxWidth: '210mm', margin: '0 auto' }}
        >
          {/* En-tête */}
          <div className="flex justify-between items-center ">
            <div className="flex flex-col">
              <div className="flex items-center">
                <div>
                  <p className="text-sm font-bold italic">Association SOLIDARITE SEDDOUK</p>
                  <p className="text-sm text-gray-500">14 rue Félix Martigny</p>
                  <p className="text-sm text-gray-500">02880 CUFFIES</p>
                  <p className="text-sm text-gray-500">SIRET : </p>
                  <p className="text-sm text-gray-500">Téléphone : </p>
                </div>
              </div>
            </div>
          </div>

          {/* Informations destinataire */}
          <div className="flex justify-end mb-6">
            <div className="text-left">
              <p className="text-sm font-bold italic">
                {famille?.representant?.nom} {famille?.representant?.prenom}
              </p>
              <p className="text-sm text-gray-500">{famille?.adresse}</p>
            </div>
          </div>

          {/* Détails du paiement */}
          <div className=" border-gray-300">
            <p className="text-xl font-bold mb-2">
              ATTESTATION D'ADHÉSION
            </p>
            <p className="mb-2">
              Nous, Association SOLIDARITE SEDDOUK, située à [Adresse de l'association], attestons que <strong>
                {famille?.representant?.nom} {famille?.representant?.prenom}
              </strong>, représentant légal de la famille
              <strong>{' ' + famille?.representant?.nom}</strong>, est adhérent de notre association pour l'année en cours.
            </p>
            <p className="mb-2">
              L'adhésion a été enregistrée en date du <strong>
                {formatDate(famille?.cotisation?.facture?.datePaiement) + ' '}
              </strong>
              accompagnée du paiement de la cotisation d'un montant de <strong>
                {famille?.cotisation?.montant} euros
              </strong>, réglé par {famille?.cotisation?.facture?.typePaiement}.
            </p>
          </div>

          {/* Membres de la famille */}
          <div className="mb-4 mt-10">
            <p className="font-bold ">Membres de la famille : </p>

            {famille?.membres?.map((membre, index) => (
              <div key={index}>
                <p  >{membre.nom} {membre.prenom}</p>
              </div>

            ))}
          </div>

          {/* Signature */}
          <div className="text-right mt-12">
            <p className="text-sm italic mb-4">Fait à Cuffies, le {getFormattedDate()}</p>
            <p className="font-bold">Signature du représentant</p>
          </div>
        </div>
      </div >
    </div >
  );
};