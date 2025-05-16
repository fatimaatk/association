"use client";
import { useRef, useState } from "react";
import { UploadCloud, Info } from "lucide-react";

export default function ImportFamillesClient() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith(".xlsx")) {
      setImportError("Le fichier doit être au format .xlsx");
      setFileName(null);
      return;
    }
    setFileName(file.name);
    // Ici tu ajoutes la logique de parsing/validation si besoin
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-2 sm:px-4  rounded-lg p-6 mb-8">
      <div className="w-full max-w-lg shadow-md rounded-2xl p-6 sm:p-10 mx-auto mt-8 mb-8">
        {/* Explication */}
        <div className="border border-[#00B074] rounded-lg p-5 mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Info className="text-[#00B074] w-5 h-5" />
            <h2 className="text-lg font-bold text-[#00B074]">Importer vos familles et membres</h2>
          </div>
          <ul className="list-disc list-inside text-gray-700 text-sm mb-2">
            <li>Fichier <span className="font-semibold">Excel (.xlsx)</span> avec <span className="font-semibold">2 onglets : Familles et Membres</span></li>
            <li>Respectez l’ordre et l’intitulé exact des colonnes du modèle</li>
            <li>Dates au format <span className="font-mono">JJ/MM/AAAA</span></li>
            <li>Champs obligatoires signalés dans le modèle</li>
          </ul>
          <a
            href="/samples/fichier_import_20_familles.xlsx"
            download
            className="inline-block mt-2 bg-[#00B074] text-white px-4 py-2 rounded-md font-semibold hover:bg-[#009a66] transition"
          >
            Télécharger le modèle Excel
          </a>
        </div>

        {/* Zone de drop */}
        <div
          className="flex flex-col items-center justify-center border-2 border-dashed border-[#00B074] rounded-xl p-8 bg-[#f9f9f9] hover:bg-[#e6f9f2] transition cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
          tabIndex={0}
          role="button"
          aria-label="Sélectionner un fichier à importer"
          onKeyDown={e => { if (e.key === "Enter") fileInputRef.current?.click(); }}
        >
          <UploadCloud className="w-10 h-10 text-[#00B074] mb-2" />
          <span className="text-[#00B074] font-semibold text-lg text-center">Glissez-déposez votre fichier ici</span>
          <span className="text-gray-500 text-sm text-center">ou cliquez pour sélectionner un fichier</span>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Feedback fichier sélectionné */}
        {fileName && (
          <div className="mt-4 text-gray-700 text-center">
            <span className="font-semibold">Fichier sélectionné :</span> {fileName}
          </div>
        )}

        {/* Affichage des erreurs */}
        {importError && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded text-sm text-center">
            {importError}
          </div>
        )}

        {/* Bouton d'import (désactivé si pas de fichier) */}
        <button
          className="w-full mt-8 bg-[#00B074] text-white py-2 rounded-md font-semibold hover:bg-[#009a66] transition disabled:opacity-50"
          disabled={!fileName}
        >
          Importer les données
        </button>
      </div>
    </div>
  );
}