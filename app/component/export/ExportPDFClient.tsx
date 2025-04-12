// app/component/export/ExportPDFClient.tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Download, FileText } from "lucide-react";
import { IFamille } from "@/models/interfaceFamilles";


export default function ExportPDFClient() {
  const [type, setType] = useState("attestation");
  const [loading, setLoading] = useState(false);
  const [adherents, setAdherents] = useState<IFamille[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    const fetchAdherents = async () => {
      try {
        const res = await fetch("/api/adherents");
        const data: IFamille[] = await res.json();
        console.log(data)
        // Filtrage selon le type de PDF
        const filtered = type === "attestation"
          ? data.filter((a) => a.cotisation?.facture?.statutPaiement === "ACQUITTE")
          : data.filter((a) => a.cotisation?.facture?.statutPaiement === "EN_ATTENTE");
        setAdherents(filtered);
        setSelectedIds([]);
        setSelectAll(false);
      } catch (err) {
        console.error("Erreur lors du chargement des adhérents", err);
      }
    };

    fetchAdherents();
  }, [type]);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
    } else {
      setSelectedIds(adherents.map((a) => a.id));
    }
    setSelectAll(!selectAll);
  };

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleExport = async () => {
    if (selectedIds.length === 0) {
      alert("Sélectionne au moins un adhérent.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/export-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, ids: selectedIds }),
      });

      if (!res.ok) throw new Error("Erreur lors de l'exportation");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `export-${type}.zip`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Une erreur est survenue lors de l'exportation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <FileText className="w-6 h-6 text-[#00B074]" />
        Exporter des documents PDF
      </h1>

      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium">Type de document :</label>
        <select
          className="border rounded px-4 py-2 w-full"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="attestation">Attestation de paiement</option>
          <option value="relance">Relance de paiement</option>
        </select>
      </div>

      <div className="mb-6 border p-4 rounded">
        <div className="mb-2 flex justify-between items-center">
          <span className="font-medium">Sélection des adhérents :</span>
          <button
            type="button"
            className="text-sm text-blue-600 underline"
            onClick={handleSelectAll}
          >
            {selectAll ? "Tout désélectionner" : "Tout sélectionner"}
          </button>
        </div>
        <div className="max-h-64 overflow-y-auto space-y-2">
          {adherents && adherents.map((a) => (
            <label key={a.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedIds.includes(a.id)}
                onChange={() => toggleSelection(a.id)}
              />
              <span>{a.nom.toUpperCase()} {a.prenom}</span>
            </label>
          ))}
          {adherents.length === 0 && <p className="text-sm text-gray-500">Aucun adhérent trouvé.</p>}
        </div>
      </div>

      <Button onClick={handleExport} disabled={loading || selectedIds.length === 0}>
        <Download className="w-4 h-4 mr-2" />
        {loading ? "Génération en cours..." : "Exporter les PDF"}
      </Button>
    </div>
  );
}
