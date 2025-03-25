'use client';

import { useState } from 'react';
import Wrapper from '../component/Wrapper';
import { FileUp, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../component/ui/dialog';

export default function ImportPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [importStats, setImportStats] = useState({ familles: 0, membres: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
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
    setProgress(0);
    const formData = new FormData();
    formData.append('file', file);

    try {
      setMessage('Préparation de l\'importation...');
      setProgress(5);
      setCurrentStep('Préparation');

      const response = await fetch('/api/import', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Erreur lors de l&apos;importation');

      setProgress(20);
      setCurrentStep('Lecture du fichier');
      setMessage('Lecture du fichier Excel...');

      // Simulation de la progression pendant le traitement
      const progressSteps = [
        { progress: 30, step: 'Traitement des familles...' },
        { progress: 50, step: 'Importation des familles...' },
        { progress: 70, step: 'Traitement des membres...' },
        { progress: 90, step: 'Importation des membres...' }
      ];

      for (const step of progressSteps) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setProgress(step.progress);
        setCurrentStep(step.step);
        setMessage(step.step);
      }

      const result = await response.json();
      setProgress(100);
      setCurrentStep('Terminé');
      setMessage(result.message);

      // Extraction des statistiques du message
      const famillesMatch = result.message.match(/(\d+) familles/);
      const membresMatch = result.message.match(/(\d+) membres/);

      setImportStats({
        familles: famillesMatch ? parseInt(famillesMatch[1]) : 0,
        membres: membresMatch ? parseInt(membresMatch[1]) : 0
      });

      setShowSuccessDialog(true);

      // Redirection après 5 secondes
      setTimeout(() => {
        router.push('/familles');
      }, 5000);
    } catch (error) {
      console.error('Erreur lors de l&apos;importation:', error);
      setProgress(0);
      setMessage('Échec de l&apos;importation. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Wrapper>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-6">
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
              <label className="text-sm font-medium text-gray-700">
                Sélectionnez votre fichier Excel
              </label>
              <input
                type="file"
                accept=".xlsx"
                onChange={handleFileChange}
                className="file-input file-input-bordered w-full bg-white border-gray-300 hover:bg-gray-50"
                disabled={isLoading}
              />
            </div>

            <button
              onClick={handleUpload}
              disabled={!file || isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors flex items-center justify-center gap-2
                ${!file || isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#00B074] hover:bg-[#009A63]'
                }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {currentStep}
                </>
              ) : (
                'Importer'
              )}
            </button>

            {progress > 0 && (
              <div className="space-y-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-[#00B074] h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 text-center">{message}</p>
              </div>
            )}

            {message && !message.includes('succès') && (
              <div className="p-4 rounded-lg flex items-center gap-2 bg-red-50 text-red-700">
                <AlertCircle className="w-5 h-5" />
                <p className="text-sm">{message}</p>
              </div>
            )}
          </div>
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
          <div className="py-4">
            <p className="text-center text-gray-600 mb-4">
              Votre fichier a été importé avec succès !
            </p>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <h3 className="font-medium text-gray-700 mb-2">Récapitulatif :</h3>
              <ul className="space-y-2">
                <li className="flex justify-between items-center">
                  <span className="text-gray-600">Familles importées :</span>
                  <span className="font-medium text-[#00B074] bg-[#00B074]/10 px-3 py-1 rounded-full">
                    {importStats.familles}
                  </span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-gray-600">Membres importés :</span>
                  <span className="font-medium text-[#00B074] bg-[#00B074]/10 px-3 py-1 rounded-full">
                    {importStats.membres}
                  </span>
                </li>
              </ul>
            </div>
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              Redirection vers la liste des familles...
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Wrapper>
  );
}