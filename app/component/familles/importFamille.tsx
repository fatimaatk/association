import { useState } from "react";

export default function ImportButton() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file) return alert("Sélectionnez un fichier !");

    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/import", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        setMessage("✅ Importation réussie !");
      } else {
        setMessage(`❌ Erreur : ${result.error}`);
      }
    } catch (error) {
      console.error("Erreur lors de l'importation :", error);
      setMessage("❌ Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept=".xlsx"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Importation..." : "Importer"}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}
