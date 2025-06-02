"use client";
import { useRef, useState, useEffect } from "react";
import { CheckCircle, AlertCircle, UploadCloud, Info, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function ImportFamillesClient() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [importErrorDetails, setImportErrorDetails] = useState<string[]>([]);
  const [showHelp, setShowHelp] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const router = useRouter();
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0); // 0: rien, 1: lecture, 2: envoi, 3: succès

  const handleFileChange = (file: File) => {
    setImportError(null);
    setImportErrorDetails([]);
    setImportSuccess(null);
    if (!file) return;
    if (!file.name.endsWith(".xlsx")) {
      setImportError("Format de fichier incorrect");
      setImportErrorDetails([
        "Le fichier doit être au format .xlsx",
        "Veuillez utiliser le modèle Excel fourni"
      ]);
      setFileName(null);
      setSelectedFile(null);
      return;
    }
    setFileName(file.name);
    setSelectedFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      setImportError("Aucun fichier sélectionné");
      setImportErrorDetails([
        "Veuillez sélectionner un fichier Excel à importer",
        "Utilisez le bouton ci-dessus ou glissez-déposez votre fichier"
      ]);
      return;
    }

    setImportError(null);
    setImportErrorDetails([]);
    setImportSuccess(null);
    setStep(1);
    setIsImporting(true);

    try {
      setStep(2);
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await fetch("/api/import", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        let errorMessage = "Erreur lors de l'import";
        let errorDetails: string[] = [];

        if (result.error) {
          if (result.error.includes("Date invalide")) {
            errorMessage = "Format de date incorrect";
            errorDetails = [
              "Les dates doivent être au format JJ/MM/AAAA",
              "Vérifiez les colonnes : chefFamille_dateNaissance, dateNaissance, datePaiement",
              "Exemple de date valide : 01/01/2024"
            ];
          } else if (result.error.includes("colonnes requises")) {
            errorMessage = "Format de fichier incorrect";
            errorDetails = [
              "Certaines colonnes obligatoires sont manquantes",
              "Vérifiez que vous utilisez bien le modèle Excel fourni",
              "Les colonnes doivent avoir exactement les mêmes noms que dans le modèle"
            ];
          } else if (result.error.includes("typeFamille")) {
            errorMessage = "Type de famille incorrect";
            errorDetails = [
              "Le type de famille spécifié n'existe pas",
              "Vérifiez la colonne typeFamille_nom",
              "Les types de famille doivent correspondre à ceux de votre association"
            ];
          } else {
            errorDetails = [
              "Vérifiez que votre fichier respecte le format attendu",
              "Utilisez le modèle Excel fourni comme référence",
              "Assurez-vous que toutes les données sont correctement formatées"
            ];
          }
        }

        setImportError(errorMessage);
        setImportErrorDetails(errorDetails);
        setStep(0);
      } else {
        setImportSuccess("Import réussi ! Vos familles et membres ont été ajoutés.");
        setFileName(null);
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        setStep(3);
      }
    } catch (err) {
      console.error("Erreur lors de l'import:", err);
      setImportError("Erreur lors de l'envoi du fichier");
      setImportErrorDetails([
        "Une erreur est survenue lors de la communication avec le serveur",
        "Vérifiez votre connexion internet",
        "Si le problème persiste, contactez le support"
      ]);
      setStep(0);
    } finally {
      setIsImporting(false);
    }
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
            className="fixed bottom-4 sm:bottom-6 left-4 sm:left-1/2 sm:-translate-x-1/2 right-4 sm:right-auto bg-[#00B074] text-white px-4 sm:px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50 max-w-[calc(100vw-2rem)] sm:max-w-none"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
          >
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm sm:text-base truncate">{importSuccess}</span>
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
          ref={dropZoneRef}
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-10 transition-all duration-200 cursor-pointer
            ${isDragging
              ? 'border-[#00B074] bg-[#e6f9f2] scale-105'
              : 'border-[#00B074] bg-[#f9f9f9] hover:bg-[#e6f9f2]'
            }`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          tabIndex={0}
          role="button"
          aria-label="Sélectionner un fichier à importer"
          onKeyDown={e => { if (e.key === "Enter") fileInputRef.current?.click(); }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <UploadCloud className={`w-12 h-12 mb-2 transition-colors duration-200 ${isDragging ? 'text-[#00B074] scale-110' : 'text-[#00B074]'}`} />
          <span className="text-[#00B074] font-semibold text-lg text-center">
            {isDragging ? 'Déposez votre fichier ici' : 'Glissez-déposez votre fichier ici'}
          </span>
          <span className="text-gray-500 text-sm text-center mt-1">
            ou cliquez pour sélectionner un fichier
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx"
            className="hidden"
            onChange={handleFileInputChange}
          />
        </motion.div>
        {/* Feedback fichier sélectionné */}
        <AnimatePresence>
          {fileName && !importError && (
            <motion.div
              className="mt-4 flex items-center justify-between gap-2 text-[#00B074] bg-[#e6f9f2] p-3 rounded-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <div className="flex items-center gap-2 min-w-0">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span className="font-semibold flex-shrink-0">Fichier sélectionné :</span>
                <span className="truncate">{fileName}</span>
              </div>
              <button
                onClick={() => {
                  setFileName(null);
                  setSelectedFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                aria-label="Supprimer le fichier"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Timeline d'import */}
        {isImporting || step > 0 ? <ImportSteps /> : null}
        {/* Affichage des erreurs */}
        <AnimatePresence>
          {importError && (
            <motion.div
              className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="font-semibold">{importError}</span>
              </div>
              {importErrorDetails.length > 0 && (
                <ul className="list-disc list-inside text-sm space-y-1 ml-7">
                  {importErrorDetails.map((detail, index) => (
                    <li key={index}>{detail}</li>
                  ))}
                </ul>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        {/* Bouton d'import */}
        <motion.button
          className="w-full mt-8 bg-gradient-to-r from-[#00B074] to-[#009a66] text-white py-3 rounded-lg font-bold text-lg shadow-md hover:from-[#009a66] hover:to-[#00B074] transition disabled:opacity-50"
          disabled={!selectedFile || isImporting}
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
          <Info className="w-5 h-5" />
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          Besoin d'aide sur le format ?
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
              <li>chefFamille_prenom</li>
              <li>chefFamille_dateNaissance</li>
              <li>adresse </li>
              <li>adresseEmail </li>
              <li>telephone</li>
              <li>montant_cotisation</li>
              <li>typePaiement</li>
              <li>statutPaiement</li>
              <li>datePaiement</li>
              <li>statutMembre</li>
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
        href="/samples/fichier_import_familles_et_membres.xlsx"
        className="block mt-5 bg-[#00B074] text-white text-center px-4 py-2 rounded-md font-semibold hover:bg-[#009a66] transition text-sm shadow"
        download
      >
        Télécharger le modèle Excel
      </a>
    </div>
  );
}