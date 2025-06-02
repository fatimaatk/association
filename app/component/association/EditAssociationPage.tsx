"use client";

import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useState } from "react";
import { Building2, Mail, Phone, MapPin, FileText, Users } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface Association {
  nom: string;
  adresse: string;
  siret: string;
  type: string;
  email: string;
  telephone: string;
}

const TYPES_ASSOCIATION = [
  { id: "sportive", nom: "Sportive" },
  { id: "culturelle", nom: "Culturelle" },
  { id: "educative", nom: "Éducative" },
  { id: "sociale", nom: "Sociale" },
  { id: "humanitaire", nom: "Humanitaire" },
  { id: "loisirs", nom: "Loisirs" },
  { id: "autre", nom: "Autre" }
];

const fieldLabels: Record<string, string> = {
  nom: "Nom de l'association",
  adresse: "Adresse",
  siret: "Numéro SIRET",
  type: "Type d'association",
  email: "Email de contact",
  telephone: "Téléphone",
};

const fieldIcons: Record<string, React.ReactNode> = {
  nom: <Building2 className="w-5 h-5 text-[#00B074]" />,
  adresse: <MapPin className="w-5 h-5 text-[#00B074]" />,
  siret: <FileText className="w-5 h-5 text-[#00B074]" />,
  type: <Users className="w-5 h-5 text-[#00B074]" />,
  email: <Mail className="w-5 h-5 text-[#00B074]" />,
  telephone: <Phone className="w-5 h-5 text-[#00B074]" />,
};

export default function EditAssociationForm({ associationServerData }: { associationServerData: Association }) {
  const [association, setAssociation] = useState(associationServerData);
  const [editMode, setEditMode] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAssociation({ ...association, [e.target.name]: e.target.value });
  };

  const handleTypeChange = (value: string) => {
    setAssociation({ ...association, type: value });
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

  const renderField = (key: string, value: string) => {
    if (key === "type") {
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-600">
            {fieldIcons[key]}
            <Label htmlFor={key} className="capitalize text-sm font-medium">
              {fieldLabels[key]}
            </Label>
          </div>
          {editMode ? (
            <Select value={value} onValueChange={handleTypeChange}>
              <SelectTrigger className="w-full h-10 border border-gray-300 focus:ring-[#00B074] focus:border-[#00B074] pl-7 bg-white rounded-md">
                <SelectValue placeholder="Sélectionnez un type" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 rounded-md shadow-lg">
                {TYPES_ASSOCIATION.map((type) => (
                  <SelectItem
                    key={type.id}
                    value={type.nom}
                    className="cursor-pointer hover:bg-gray-50 focus:bg-gray-50 focus:text-[#00B074] data-[state=checked]:bg-[#00B074] data-[state=checked]:text-white"
                  >
                    {type.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p className="text-gray-900 font-medium pl-7">{value || "-"}</p>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-gray-600">
          {fieldIcons[key]}
          <Label htmlFor={key} className="capitalize text-sm font-medium">
            {fieldLabels[key]}
          </Label>
        </div>
        {editMode ? (
          <Input
            name={key}
            id={key}
            value={value}
            onChange={handleChange}
            className="border border-gray-300 focus:ring-[#00B074] focus:border-[#00B074] pl-7"
            placeholder={`Entrez ${fieldLabels[key].toLowerCase()}`}
          />
        ) : (
          <p className="text-gray-900 font-medium pl-7">{value || "-"}</p>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-[#004d3b]">
          Informations de l&apos;association
        </h1>
        <p className="text-gray-600">
          Gérez les informations de votre association. Ces informations seront utilisées pour générer vos documents.
        </p>
      </div>

      {!editMode ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(association).map(([key, value]) => (
            <div key={key} className="p-4 bg-gray-50 rounded-lg space-y-2">
              {renderField(key, value)}
            </div>
          ))}
          <div className="md:col-span-2">
            <Button
              type="button"
              onClick={() => setEditMode(true)}
              className="w-full bg-[#00B074] hover:bg-[#009a66] text-white font-semibold py-6 text-lg"
            >
              Modifier les informations
            </Button>
          </div>
        </div>
      ) : (
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(association).map(([key, value]) => (
              <div key={key} className="p-4 bg-gray-50 rounded-lg space-y-2">
                {renderField(key, value)}
              </div>
            ))}
          </div>
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              onClick={handleSubmit}
              className="flex-1 bg-[#00B074] hover:bg-[#009a66] text-white font-semibold py-6 text-lg"
            >
              Enregistrer les modifications
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditMode(false)}
              className="flex-1 py-6 text-lg"
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
