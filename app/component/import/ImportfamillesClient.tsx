"use client";
import { useRef, useState, useEffect } from "react";
import { CheckCircle, AlertCircle, UploadCloud, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import * as XLSX from "xlsx";
import { useRouter } from "next/navigation";

export default function ImportFamillesClient() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  const router = useRouter();
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0); // 0: rien, 1: lecture, 2: envoi, 3: succès

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    setImportSuccess(null);
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith(".xlsx")) {
      setImportError("Le fichier doit être au format .xlsx");
      setFileName(null);
      return;
    }
    setFileName(file.name);
  };

  const handleImport = async () => {
    setImportError(null);
    setImportSuccess(null);
    setStep(1); // Lecture du fichier
    if (!fileInputRef.current?.files?.[0]) return;
    setIsImporting(true);
    try {
      const file = fileInputRef.current.files[0];
      setStep(2); // Envoi au serveur
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/import", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        setImportError(result.error || "Erreur lors de l'import.");
        setStep(0);
      } else {
        setImportSuccess("Import réussi ! Vos familles et membres ont été ajoutés.");
        setFileName(null);
        fileInputRef.current.value = "";
        setStep(3); // Succès
      }
    } catch (err: any) {
      setImportError("Erreur lors de l'envoi du fichier.");
      setStep(0);
    }
    setIsImporting(false);
  };

  // Redirection automatique après succès
  useEffect(() => {
    if (step === 3) {
      const timeout = setTimeout(() => {
        router.push("/familles");
      }, 2000); // 2 secondes avant redirection
      return () => clearTimeout(timeout);
    }
  }, [step, router]);

  // Timeline d'import
  function ImportSteps() {
    const steps = [
      { label: "Lecture du fichier", done: step > 0 },
      { label: "Envoi au serveur", done: step > 1 },
      { label: "Traitement serveur", done: step > 2 },
      { label: "Import terminé", done: step === 3 },
    ];
    return (
      <ol className="flex flex-col gap-2 mt-6 mb-2">
        {steps.map((s, i) => (
          <li key={i} className="flex items-center gap-2">
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold
                ${s.done ? "bg-[#00B074] text-white" : "bg-gray-200 text-gray-400"}`}
            >
              {s.done ? <CheckCircle className="w-4 h-4" /> : i + 1}
            </span>
            <span className={s.done ? "text-[#00B074] font-semibold" : "text-gray-500"}>
              {s.label}
            </span>
          </li>
        ))}
      </ol>
    );
  }

  // Toast de succès
  function SuccessToast() {
    return (
      <AnimatePresence>
        {importSuccess && (
          <motion.div
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#00B074] text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
          >
            <CheckCircle className="w-5 h-5" />
            {importSuccess}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <div className="min-h-[80vh] flex flex-col md:flex-row gap-6 items-center justify-center px-2 sm:px-4 py-8">
      {/* Zone d'import */}
      <div className="w-full max-w-lg shadow-xl rounded-3xl p-6 sm:p-10 bg-white flex-1">
        <h2 className="text-2xl font-bold text-[#00B074] mb-6 flex items-center gap-2">
          <UploadCloud className="w-7 h-7" /> Importer vos familles
        </h2>
        {/* Zone de drop */}
        <motion.div
          className="flex flex-col items-center justify-center border-2 border-dashed border-[#00B074] rounded-2xl p-10 bg-[#f9f9f9] hover:bg-[#e6f9f2] transition cursor-pointer shadow-sm"
          onClick={() => fileInputRef.current?.click()}
          tabIndex={0}
          role="button"
          aria-label="Sélectionner un fichier à importer"
          onKeyDown={e => { if (e.key === "Enter") fileInputRef.current?.click(); }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <UploadCloud className="w-12 h-12 text-[#00B074] mb-2" />
          <span className="text-[#00B074] font-semibold text-lg text-center">Glissez-déposez votre fichier ici</span>
          <span className="text-gray-500 text-sm text-center">ou cliquez pour sélectionner un fichier</span>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx"
            className="hidden"
            onChange={handleFileChange}
          />
        </motion.div>
        {/* Feedback fichier sélectionné */}
        <AnimatePresence>
          {fileName && !importError && (
            <motion.div
              className="mt-4 flex items-center justify-center gap-2 text-[#00B074] text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">Fichier sélectionné :</span> {fileName}
            </motion.div>
          )}
        </AnimatePresence>
        {/* Timeline d'import */}
        {isImporting || step > 0 ? <ImportSteps /> : null}
        {/* Affichage des erreurs */}
        <AnimatePresence>
          {importError && (
            <motion.div
              className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded text-sm text-center flex items-center justify-center gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <AlertCircle className="w-5 h-5" />
              {importError}
            </motion.div>
          )}
        </AnimatePresence>
        {/* Bouton d'import */}
        <motion.button
          className="w-full mt-8 bg-gradient-to-r from-[#00B074] to-[#009a66] text-white py-3 rounded-lg font-bold text-lg shadow-md hover:from-[#009a66] hover:to-[#00B074] transition disabled:opacity-50"
          disabled={!fileName || isImporting}
          whileTap={{ scale: 0.98 }}
          onClick={handleImport}
        >
          {isImporting ? "Import en cours..." : "Importer les données"}
        </motion.button>
        {/* Bouton d'aide (mobile) */}
        <button
          className="md:hidden mt-6 flex items-center gap-2 text-[#00B074] underline"
          onClick={() => setShowHelp(true)}
        >
          <Info className="w-5 h-5" /> Besoin d'aide sur le format ?
        </button>
      </div>
      {/* Colonne pédagogique (desktop) */}
      <div className="hidden md:block w-[340px] ml-8">
        <AideImport />
      </div>
      {/* Popup pédagogique (mobile) */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowHelp(false)}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={e => e.stopPropagation()}
            >
              <AideImport />
              <button
                className="mt-4 w-full bg-[#00B074] text-white py-2 rounded font-semibold"
                onClick={() => setShowHelp(false)}
              >
                Fermer
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Toast de succès */}
      <SuccessToast />
    </div>
  );
}

// Composant d'aide réutilisable
function AideImport() {
  return (
    <div className="bg-gradient-to-br from-[#e6f9f2] to-[#f0fef8] border border-[#00B074]/30 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Info className="w-5 h-5 text-[#00B074]" />
        <span className="font-bold text-[#00B074] text-lg">Format attendu</span>
      </div>
      <div className="space-y-3">
        <div className="flex items-start gap-2">

          <div>
            <span className="font-semibold text-[#00B074]">Onglet Familles</span>
            <ul className="list-disc list-inside text-gray-700 text-xs ml-3 mt-1">
              <li>typeFamille_nom</li>
              <li>chefFamille_nom</li>
              <li>prenom</li>
              <li>dateNaissance</li>
              <li>adresse </li>
              <li>adresseEmail </li>
              <li>téléphone</li>
              <li>montant_cotisation</li>
              <li>typePaiement</li>
              <li>statutPaiement</li>
              <li>datePaiement</li>
            </ul>
          </div>
        </div>
        <div className="flex items-start gap-2">

          <div>
            <span className="font-semibold text-[#00B074]">Onglet Membres</span>
            <ul className="list-disc list-inside text-gray-700 text-xs ml-3 mt-1">
              <li>familleChefNom</li>
              <li>familleChefPrenom</li>
              <li>chefFamille_dateNaissance</li>
              <li>familleId</li>
              <li>nom</li>
              <li> prenom</li>
              <li>dateNaissance</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-4 text-xs text-gray-600 space-y-1">
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        <div>• Respectez l'intitulé exact des colonnes (casse, accents, ordre).</div>
        <div>• Dates au format <span className="font-mono">JJ/MM/AAAA</span>.</div>
      </div>
      <a
        href="/samples/fichier_import_20_familles.xlsx"
        className="block mt-5 bg-[#00B074] text-white text-center px-4 py-2 rounded-md font-semibold hover:bg-[#009a66] transition text-sm shadow"
        download
      >
        Télécharger le modèle Excel
      </a>
    </div>
  );
}