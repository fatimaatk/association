import { useCallback, useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { IFamille } from "@/models/interfaceFamilles";
import CustomPdfEditor from "./CustomPdfEditor";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";

interface GeneratedPdfViewerProps {
  famille: IFamille;
}

export default function GeneratedPdfViewer({ famille }: GeneratedPdfViewerProps) {
  const statut = famille?.cotisation?.facture?.statutPaiement;
  const isAcquitte = statut === "ACQUITTE";

  const [viewMode, setViewMode] = useState<'attestation' | 'relance' | 'personnalise'>(isAcquitte ? 'attestation' : 'relance');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  const fetchPdf = useCallback(async (type: 'attestation' | 'relance') => {
    setLoading(true);
    try {
      const res = await fetch('/api/export-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, ids: [famille.id] }),
      });

      if (!res.ok) throw new Error("Erreur lors de la récupération du PDF");

      const blob = await res.blob();
      const fileType = res.headers.get("Content-Type");

      if (fileType?.includes("pdf")) {
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      } else {
        setPdfUrl(null);
        console.warn("Format inattendu reçu (non PDF)");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [famille.id, setLoading, setPdfUrl]);

  const handleDownload = async () => {
    if (viewMode === 'personnalise' && pdfRef.current) {
      try {
        setLoading(true);
        const canvas = await html2canvas(pdfRef.current, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({ unit: "mm", format: "a4" });
        const width = pdf.internal.pageSize.getWidth();
        const height = (canvas.height * width) / canvas.width;
        pdf.addImage(imgData, "PNG", 0, 0, width, height);
        pdf.save(`personnalise-famille-${famille.chefFamille.nom}.pdf`);
      } catch (err) {
        console.error("Erreur PDF personnalisé:", err);
      } finally {
        setLoading(false);
      }
    } else if (pdfUrl) {
      const a = document.createElement("a");
      a.href = pdfUrl;
      a.download = `${viewMode}-famille-${famille.chefFamille.nom}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  useEffect(() => {
    if (viewMode === 'attestation' || viewMode === 'relance') {
      fetchPdf(viewMode);
    } else {
      setPdfUrl(null);
    }
  }, [viewMode, fetchPdf]);

  return (
    <div className="space-y-6 mb-10">
      <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4">
        <select
          value={viewMode}
          onChange={(e) => setViewMode(e.target.value as 'attestation' | 'relance' | 'personnalise')}
          className="border px-4 py-2 rounded w-full sm:w-auto"
        >
          {isAcquitte && <option value="attestation">Attestation</option>}
          {!isAcquitte && <option value="relance">Relance</option>}
          <option value="personnalise">Personnalisation</option>
        </select>

        <Button onClick={handleDownload} disabled={loading}>
          {loading ? "Chargement..." : "Télécharger le PDF"}
        </Button>
      </div>

      {viewMode === 'personnalise' ? (
        <div ref={pdfRef}>
          <CustomPdfEditor famille={famille} factureRef={pdfRef} />
        </div>
      ) : pdfUrl ? (
        <div className="relative w-full h-[70vh] border rounded-lg overflow-hidden shadow">
          <embed
            src={pdfUrl}
            type="application/pdf"
            className="absolute top-0 left-0 w-full h-full"
          />
        </div>
      ) : null}
    </div>
  );
}
