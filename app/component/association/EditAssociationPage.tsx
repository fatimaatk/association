"use client";

import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useState } from "react";

interface Association {
  nom: string;
  adresse: string;
  siret: string;
  type: string;
  email: string;
  telephone: string;
  // Ajoute d'autres champs si besoin
}

export default function EditAssociationForm({ associationServerData }: { associationServerData: Association }) {
  const [association, setAssociation] = useState(associationServerData);
  const [editMode, setEditMode] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAssociation({ ...association, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const res = await fetch("/api/association/me", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(association),
    });
    if (res.ok) {
      setDialogMessage("Mise à jour réussie !");
      setEditMode(false);
    } else {
      setDialogMessage("Erreur lors de la mise à jour.");
    }
    setDialogOpen(true);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow space-y-6">
      <h1 className="text-2xl font-bold text-center text-[#00B074]">
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        Informations de l'association
      </h1>

      {!editMode ? (
        <div className="space-y-4">
          {Object.entries(association).map(([key, value]) => (
            <div key={key} className="space-y-1">
              <Label className="capitalize text-sm text-gray-600">{key}</Label>
              <p className="text-gray-900 font-medium">{value || "-"}</p>
            </div>
          ))}
          <Button
            type="button"
            onClick={() => setEditMode(true)}
            className="w-full bg-[#00B074] hover:bg-[#009a66] text-white font-semibold"
          >
            Modifier
          </Button>
        </div>
      ) : (
        <form className="space-y-4">
          {Object.entries(association).map(([key, value]) => (
            <div key={key} className="space-y-1">
              <Label htmlFor={key} className="capitalize text-sm text-gray-700">
                {key}
              </Label>
              <Input
                name={key}
                id={key}
                value={value}
                onChange={handleChange}
                className="border border-gray-300 focus:ring-[#00B074] focus:border-[#00B074]"
              />
            </div>
          ))}
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={handleSubmit}
              className="flex-1 bg-[#00B074] hover:bg-[#009a66] text-white font-semibold"
            >
              Enregistrer
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditMode(false)}
              className="flex-1"
            >
              Annuler
            </Button>
          </div>
        </form>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-white rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-lg text-center text-[#00B074] font-bold">
              {dialogMessage.includes("réussie") ? "Succès" : "Erreur"}
            </DialogTitle>
          </DialogHeader>
          <p className="text-center text-gray-700 py-4">{dialogMessage}</p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
