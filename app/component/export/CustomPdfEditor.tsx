import { useState, useEffect, ChangeEvent, RefObject } from "react";
import { IFamille } from "@/models/interfaceFamilles";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { ArrowDownFromLine, RotateCw } from "lucide-react";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import confetti from "canvas-confetti";

interface IProps {
  famille: IFamille;
  factureRef: RefObject<HTMLDivElement | null>;
}

interface CustomContent {
  associationName: string;
  associationAddress: string;
  associationCity: string;
  associationSiret: string;
  associationPhone: string;
  attestationTitle: string;
  attestationContent: string;
  signatureTitle: string;
}

export default function CustomPdfEditor({ famille, factureRef }: IProps) {
  const datePaiement = famille.cotisation?.facture?.datePaiement
    ? new Date(famille.cotisation.facture.datePaiement).toLocaleDateString("fr-FR")
    : "...";

  const [customContent, setCustomContent] = useState<CustomContent>({
    associationName: "",
    associationAddress: "",
    associationCity: "",
    associationSiret: "",
    associationPhone: "",
    attestationTitle: "ATTESTATION D’ADHÉSION",
    attestationContent: `Je soussigné, représentant de l’association atteste que ${famille.chefFamille.nom} ${famille.chefFamille.prenom}, est adhérent pour l’année en cours.\n\nAdhésion enregistrée en date du ${datePaiement} avec un paiement de ${famille.cotisation?.montant ?? "..."} € par ${famille.cotisation?.facture?.typePaiement ?? "..."}.`,
    signatureTitle: "Signature du représentant",
  });

  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetchAssociation = async () => {
      try {
        const res = await fetch("/api/association/me");
        const data = await res.json();
        setCustomContent((prev) => ({
          ...prev,
          associationName: data.nom || "",
          associationAddress: data.adresse || "",
          associationCity: data.ville || "",
          associationSiret: data.siret || "",
          associationPhone: data.telephone || "",
        }));
      } catch (err) {
        console.error("Erreur lors du chargement de l'association", err);
      }
    };
    fetchAssociation();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof CustomContent
  ) => {
    setCustomContent((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const resetContent = () => {
    setCustomContent((prev) => ({
      ...prev,
      attestationTitle: "ATTESTATION D’ADHÉSION",
      attestationContent: `Je soussigné, représentant de l’association atteste que ${famille.chefFamille.nom} ${famille.chefFamille.prenom}, est adhérent pour l’année en cours.\n\nAdhésion enregistrée en date du ${datePaiement} avec un paiement de ${famille.cotisation?.montant ?? "..."} € par ${famille.cotisation?.facture?.typePaiement ?? "..."}.`,
      signatureTitle: "Signature du représentant"
    }));
  };

  const generatePdf = async () => {
    const element = factureRef.current;
    if (!element) return;

    setIsGenerating(true);
    try {
      const canvas = await html2canvas(element, { scale: 3 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, "PNG", 0, 0, width, height);
      pdf.save(`attestation-${famille.chefFamille.nom}.pdf`);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } catch (err) {
      console.error("Erreur PDF :", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white p-6 rounded-lg shadow">
        <fieldset className="space-y-4">
          <legend className="font-semibold text-[#00B074] mb-2 text-sm uppercase tracking-wide">Association</legend>
          <div>
            <Label>Nom</Label>
            <Input value={customContent.associationName} onChange={(e) => handleChange(e, "associationName")} />
          </div>
          <div>
            <Label>Adresse</Label>
            <Input value={customContent.associationAddress} onChange={(e) => handleChange(e, "associationAddress")} />
          </div>
          <div>
            <Label>Ville</Label>
            <Input value={customContent.associationCity} onChange={(e) => handleChange(e, "associationCity")} />
          </div>
          <div>
            <Label>SIRET</Label>
            <Input value={customContent.associationSiret} onChange={(e) => handleChange(e, "associationSiret")} />
          </div>
          <div>
            <Label>Téléphone</Label>
            <Input value={customContent.associationPhone} onChange={(e) => handleChange(e, "associationPhone")} />
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="font-semibold text-[#00B074] mb-2 text-sm uppercase tracking-wide">Document</legend>
          <div>
            <Label>Titre</Label>
            <Input value={customContent.attestationTitle} onChange={(e) => handleChange(e, "attestationTitle")} />
          </div>
          <div>
            <Label>Contenu</Label>
            <Textarea rows={6} value={customContent.attestationContent} onChange={(e) => handleChange(e, "attestationContent")} />
          </div>
          <div>
            <Label>Signature</Label>
            <Input value={customContent.signatureTitle} onChange={(e) => handleChange(e, "signatureTitle")} />
          </div>
        </fieldset>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-start sm:justify-between items-start sm:items-center">
        <Button onClick={generatePdf} disabled={isGenerating} className="bg-[#00B074] text-white hover:bg-[#009a66]">
          {isGenerating ? "Génération..." : "Télécharger le PDF personnalisé"}
          <ArrowDownFromLine className="ml-2 w-4 h-4" />
        </Button>
        <Button variant="outline" onClick={resetContent} className="flex items-center gap-2">
          <RotateCw size={16} /> Réinitialiser
        </Button>
      </div>

      <div
        ref={factureRef}
        className="mx-auto w-[794px] h-[1123px] px-[48px] py-[64px] bg-white border rounded-[6px] text-[14px] leading-[1.8] text-gray-900 flex flex-col justify-between"
      >
        <div className="space-y-4">
          <h2 className="text-center text-[16px] font-bold uppercase mb-6">
            {customContent.attestationTitle}
          </h2>
          <div className="space-y-2">
            <p><strong>Objet :</strong> Attestation d’adhésion à l’association {customContent.associationName}</p>
            <p><strong>Structure :</strong> {customContent.associationName}, située au {customContent.associationAddress} {customContent.associationCity}</p>
            <p><strong>SIRET :</strong> {customContent.associationSiret}</p>
            <p><strong>Téléphone :</strong> {customContent.associationPhone}</p>
          </div>
          <p className="whitespace-pre-line mt-4">{customContent.attestationContent}</p>
        </div>

        <div className="text-right mt-8 space-y-2">
          <p>Fait à {customContent.associationCity}, le {new Date().toLocaleDateString("fr-FR")}</p>
          <p>{customContent.signatureTitle}</p>
          <p className="text-sm italic text-gray-500">
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            Cachet de 'association</p>
        </div>
      </div>
    </div>
  );
}
