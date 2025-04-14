'use client'

import { useState } from 'react';
import { FileUp, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

export default function ImportClientPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [importStats, setImportStats] = useState({ familles: 0, membres: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFile(e.target.files[0]);
      setMessage('');
      setProgress(0);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Veuillez sélectionner un fichier.');
      return;
    }

    setIsLoading(true);
    setProgress(5);
    setCurrentStep('Préparation');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/import', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        throw new Error(result.error || 'Erreur inconnue');
      }

      const steps = [
        { progress: 30, step: 'Traitement des familles...' },
        { progress: 50, step: 'Importation des familles...' },
        { progress: 70, step: 'Traitement des membres...' },
        { progress: 90, step: 'Importation des membres...' },
      ];

      for (const step of steps) {
        await new Promise((res) => setTimeout(res, 800));
        setProgress(step.progress);
        setCurrentStep(step.step);
        setMessage(step.step);
      }

      setProgress(100);
      setCurrentStep('Terminé');
      setMessage(result.message);

      const famillesMatch = result.message.match(/(\d+) familles/);
      const membresMatch = result.message.match(/(\d+) membres/);

      setImportStats({
        familles: famillesMatch ? parseInt(famillesMatch[1]) : 0,
        membres: membresMatch ? parseInt(membresMatch[1]) : 0,
      });

      setShowSuccessDialog(true);

      setTimeout(() => router.push('/familles'), 5000);
    } catch (err) {
      console.error(err);
      setMessage('Erreur d’import. Vérifiez le format du fichier.');
      setProgress(0);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8">
        <div className="flex flex-col items-center mb-8">
          <FileUp className="w-16 h-16 text-[#00B074] mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Importation Excel</h2>
          <p className="text-gray-600 text-center">
            Importez vos données depuis un fichier Excel. Assurez-vous que le fichier contient les onglets &quot;Familles&quot; et &quot;Membres&quot;.
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Fichier Excel</label>
            <input
              type="file"
              accept=".xlsx"
              onChange={handleFileChange}
              className="file-input file-input-bordered w-full bg-white border-gray-300"
              disabled={isLoading}
            />
          </div>

          <button
            onClick={handleUpload}
            disabled={!file || isLoading}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white flex justify-center items-center gap-2 ${!file || isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#00B074] hover:bg-[#009A63]'
              }`}
          >
            {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> {currentStep}</> : 'Importer'}
          </button>

          {progress > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-[#00B074] h-2.5 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
          )}

          {message && !message.includes('succès') && (
            <div className="p-4 bg-red-50 text-red-700 rounded flex gap-2 items-center">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">{message}</span>
            </div>
          )}
        </div>
      </div>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#00B074]">
              <CheckCircle2 className="w-6 h-6" />
              Importation réussie !
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 text-gray-600 text-sm text-center">
            <p className="mb-4">Votre fichier a été importé avec succès.</p>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 text-left">
              <p>Familles importées : <strong>{importStats.familles}</strong></p>
              <p>Membres importés : <strong>{importStats.membres}</strong></p>
            </div>
            <div className="mt-4 flex items-center justify-center gap-2 text-gray-400 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              Redirection en cours...
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
