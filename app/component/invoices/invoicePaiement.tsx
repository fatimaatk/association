import { IFamille } from "@/models/interfaceFamilles";
import { useState, ChangeEvent } from "react";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Pencil } from "lucide-react";

function formatDate(dateString: Date | null | undefined | string): string {
  if (!dateString) return "";
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

interface IProps {
  famille: IFamille;
  factureRef: React.RefObject<HTMLDivElement | null>;
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

export const InvoicePaiement = ({ famille, factureRef }: IProps) => {
  const [customContent, setCustomContent] = useState<CustomContent>({
    associationName: "Association",
    associationAddress: "Adresse",
    associationCity: "Ville",
    associationSiret: "Siret",
    associationPhone: "0606060606",
    attestationTitle: "ATTESTATION D’ADHÉSION",
    attestationContent: `Je soussigné, représentant de l’association atteste que ${famille?.chefFamille?.nom} ${famille?.chefFamille?.prenom}, représentant légal de la famille ${famille?.chefFamille?.nom}, est adhérent pour l’année en cours.

L’adhésion a été enregistrée en date du ${formatDate(famille?.cotisation?.facture?.datePaiement)}, accompagnée du paiement de la cotisation d’un montant de ${famille?.cotisation?.montant} euros, réglé par ${famille?.cotisation?.facture?.typePaiement}.`,
    signatureTitle: "Signature du représentant",
  });
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof CustomContent) => {
    setCustomContent(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className="w-full space-y-6">
      {/* Bouton d'édition et Modal */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full sm:w-auto">
            <Pencil className="w-4 h-4 mr-2" />
            Éditer le PDF
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-2xl font-bold text-gray-900">Personnaliser le contenu du PDF</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                {/* eslint-disable-next-line react/no-unescaped-entities */}
                <Label className="text-sm font-medium text-gray-700">Nom de l'association</Label>
                <Input
                  value={customContent.associationName}
                  onChange={(e) => handleInputChange(e, 'associationName')}
                  className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                {/* eslint-disable-next-line react/no-unescaped-entities */}
                <Label className="text-sm font-medium text-gray-700">Adresse de l'association</Label>
                <Input
                  value={customContent.associationAddress}
                  onChange={(e) => handleInputChange(e, 'associationAddress')}
                  className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Ville</Label>
                <Input
                  value={customContent.associationCity}
                  onChange={(e) => handleInputChange(e, 'associationCity')}
                  className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">SIRET</Label>
                <Input
                  value={customContent.associationSiret}
                  onChange={(e) => handleInputChange(e, 'associationSiret')}
                  className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Téléphone</Label>
                <Input
                  value={customContent.associationPhone}
                  onChange={(e) => handleInputChange(e, 'associationPhone')}
                  className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                {/* eslint-disable-next-line react/no-unescaped-entities */}
                <Label className="text-sm font-medium text-gray-700">Titre de l'attestation</Label>
                <Input
                  value={customContent.attestationTitle}
                  onChange={(e) => handleInputChange(e, 'attestationTitle')}
                  className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              <Label className="text-sm font-medium text-gray-700">Contenu de l'attestation</Label>
              <Textarea
                value={customContent.attestationContent}
                onChange={(e) => handleInputChange(e, 'attestationContent')}
                className="mt-1 h-32 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Titre de la signature</Label>
              <Input
                value={customContent.signatureTitle}
                onChange={(e) => handleInputChange(e, 'signatureTitle')}
                className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Aperçu du PDF */}
      <div className="border-2 border-dashed rounded-xl">
        <div
          className="p-4 sm:p-8 md:p-12 bg-white rounded-lg shadow-md"
          ref={factureRef}
          data-pdf-content
        >
          {/* En-tête */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            {customContent.associationName && (
              <div className="flex flex-col">
                <p className="text-sm font-bold italic">{customContent.associationName}</p>
                <p className="text-sm text-gray-500">{customContent.associationAddress}</p>
                <p className="text-sm text-gray-500">{customContent.associationCity}</p>
                <p className="text-sm text-gray-500">SIRET : {customContent.associationSiret}</p>
                <p className="text-sm text-gray-500">Téléphone : {customContent.associationPhone}</p>
              </div>
            )}
          </div>

          {/* Informations destinataire */}
          <div className="flex justify-end mb-6">
            <div className="text-left">
              <p className="text-sm font-bold italic">
                {famille?.chefFamille?.nom} {famille?.chefFamille?.prenom}
              </p>
              <p className="text-sm text-gray-500">{famille?.adresse}</p>
            </div>
          </div>

          {/* Détails du paiement */}
          <div className="border-gray-300">
            <p className="text-lg sm:text-xl font-bold mb-4">
              {customContent.attestationTitle}
            </p>
            <div className="space-y-4 text-sm sm:text-base whitespace-pre-line">
              {customContent.attestationContent}
            </div>
          </div>

          {/* Membres de la famille */}
          <div className="mt-8 sm:mt-10">
            <p className="font-bold mb-2">Membres de la famille :</p>
            <div className="space-y-1">
              {famille?.membres?.map((membre, index) => (
                <p key={index} className="uppercase text-sm sm:text-base">
                  {membre.nom} {membre.prenom}
                </p>
              ))}
            </div>
          </div>

          {/* Signature */}
          <div className="text-right mt-8 sm:mt-12">
            <p className="text-sm italic mb-4">Fait le {getFormattedDate()}</p>
            <p className="font-bold">{customContent.signatureTitle}</p>
          </div>
        </div>
      </div>
    </div>
  );
};