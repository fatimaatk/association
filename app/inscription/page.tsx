"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import WrapperVitrine from "../component/layout/PublicLayout";
import { useUser } from "@/context/UserContext";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import AddressAutocomplete from '../component/AddressAutocomplete';
import { Info, CheckCircle, Circle } from "lucide-react";

// Types pour la validation
interface FormData {
  nom: string;
  email: string;
  siret: string;
  telephone: string;
  type: string;
  password: string;
  confirmPassword: string;
  adresse: string;
  adresseDetails: AdresseDetails;
}

type AdresseDetails = {
  city: string;
  postcode: string;
  street: string;
};

interface ValidationErrors {
  [key: string]: string;
}

// Composant d'aide contextuelle
const HelpTooltip = ({ text }: { text: string }) => (
  <div className="group relative inline-block ml-2">
    <Info className="h-5 w-5 text-gray-400 hover:text-gray-600 cursor-help" />
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
      {text}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-800"></div>
    </div>
  </div>
);

// Composant de validation en temps réel
const ValidationIndicator = ({ isValid, message }: { isValid: boolean; message: string }) => (
  <div className={`flex items-center mt-1 text-sm ${isValid ? 'text-green-600' : 'text-gray-500'}`}>
    {isValid ? (
      <CheckCircle className="h-4 w-4 mr-1" />
    ) : (
      <div className="h-4 w-4 mr-1 border-2 border-gray-300 rounded-full"></div>
    )}
    {message}
  </div>
);

// Composant de timeline
export function Timeline({ currentStep }: { currentStep: number }) {
  const steps = [
    { title: "Informations de base", description: "Nom, type et adresse" },
    { title: "Contact", description: "Email et téléphone" },
    { title: "Administration", description: "SIRET et mot de passe" },
    { title: "Confirmation", description: "Vérification et création" },
  ];

  return (
    <div className="mb-8">
      {/* Desktop */}
      <div className="hidden sm:flex justify-between items-center">
        {steps.map((step, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div
              className={`flex items-center justify-center rounded-full border-2 w-8 h-8 mb-2
                ${index + 1 < currentStep ? "border-[#00B074] bg-[#00B074] text-white" : ""}
                ${index + 1 === currentStep ? "border-[#00B074] bg-white text-[#00B074]" : ""}
                ${index + 1 > currentStep ? "border-gray-300 bg-white text-gray-400" : ""}
              `}
            >
              {index + 1 < currentStep ? (
                <CheckCircle className="w-6 h-6" />
              ) : index + 1 === currentStep ? (
                <span>{currentStep}</span>
              ) : (
                <Circle className="w-6 h-6" />
              )}
            </div>
            <div className="text-xs font-semibold text-center">{step.title}</div>
            <div className="text-[11px] text-gray-500 text-center">{step.description}</div>
          </div>
        ))}
      </div>
      {/* Mobile */}
      <div className="sm:hidden h-24">
        <div className="flex overflow-x-auto no-scrollbar gap-4 pb-2">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex-shrink-0 w-40 flex flex-col items-center transition-transform duration-300 pt-2
                ${index + 1 === currentStep ? "scale-105" : "opacity-60"}
              `}
            >
              <div
                className={`flex items-center justify-center rounded-full border-2 w-8 h-8 mb-2
                  ${index + 1 < currentStep ? "border-[#00B074] bg-[#00B074] text-white" : ""}
                  ${index + 1 === currentStep ? "border-[#00B074] bg-white text-[#00B074]" : ""}
                  ${index + 1 > currentStep ? "border-gray-300 bg-white text-gray-400" : ""}
                `}
              >
                {index + 1 < currentStep ? (
                  <CheckCircle className="w-6 h-6" />
                ) : index + 1 === currentStep ? (
                  <span>{currentStep}</span>
                ) : (
                  <Circle className="w-6 h-6" />
                )}
              </div>
              <div className="text-xs font-semibold text-center">{step.title}</div>
              <div className="text-[11px] text-gray-500 text-center">{step.description}</div>
            </div>
          ))}
        </div>
        {/* Barre de progression mobile */}
        <div className="relative mt-2 h-1 bg-gray-200 rounded-full">
          <div
            className="absolute top-0 left-0 h-1 bg-[#00B074] rounded-full transition-all duration-300"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default function InscriptionPage() {
  const user = useUser();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    nom: "",
    email: "",
    siret: "",
    telephone: "",
    type: "",
    password: "",
    confirmPassword: "",
    adresse: "",
    adresseDetails: {
      city: "",
      postcode: "",
      street: "",
    },
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [associationExists, setAssociationExists] = useState(false);

  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  const validateStep = (step: number): boolean => {
    const newErrors: ValidationErrors = {};

    switch (step) {
      case 1:
        if (!formData.nom.trim()) {
          newErrors.nom = "Le nom de l'association est requis";
        } else if (formData.nom.length < 3) {
          newErrors.nom = "Le nom doit contenir au moins 3 caractères";
        }

        if (!formData.type.trim()) {
          newErrors.type = "Le type d'association est requis";
        }

        if (!formData.adresse.trim()) {
          newErrors.adresse = "L'adresse est requise";
        } else if (!formData.adresseDetails.postcode) {
          newErrors.adresse = "Veuillez sélectionner une adresse valide dans la liste";
        }
        break;
      case 2:
        if (!formData.email.trim()) {
          newErrors.email = "L'email est requis";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = "Format d'email invalide";
        }
        if (!formData.telephone.trim()) {
          newErrors.telephone = "Le téléphone est requis";
        } else if (!/^[0-9]{10}$/.test(formData.telephone.replace(/\s/g, ""))) {
          newErrors.telephone = "Format de téléphone invalide";
        }
        break;
      case 3:
        if (!formData.siret.trim()) {
          newErrors.siret = "Le numéro SIRET est requis";
        } else if (!/^[0-9]{14}$/.test(formData.siret.replace(/\s/g, ""))) {
          newErrors.siret = "Le numéro SIRET doit contenir 14 chiffres";
        }
        if (!formData.password) {
          newErrors.password = "Le mot de passe est requis";
        } else if (formData.password.length < 8) {
          newErrors.password = "Le mot de passe doit contenir au moins 8 caractères";
        }
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleAddressChange = (address: string, details: AdresseDetails) => {
    setFormData(prev => ({
      ...prev,
      adresse: address,
      adresseDetails: {
        city: details.city || '',
        postcode: details.postcode || '',
        street: details.street || '',
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    setLoading(true);
    try {
      const res = await fetch("/api/association", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: formData.nom,
          email: formData.email,
          siret: formData.siret,
          telephone: formData.telephone,
          type: formData.type,
          adresse: formData.adresse,
          adresseDetails: formData.adresseDetails,
          compte: {
            email: formData.email,
            motDePasse: formData.password,
            nom: "Admin",
            prenom: "Admin",
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          setAssociationExists(true);

          // Construction du message détaillé
          const details = [];
          if (data.fields?.includes("email") && data.email) {
            details.push(`email : ${data.email}`);
          }
          if (data.fields?.includes("siret") && data.siret) {
            details.push(`SIRET : ${data.siret}`);
          }
          if (data.fields?.includes("nom") && data.nom) {
            details.push(`nom : ${data.nom}`);
          }

          let message = "Un compte existe déjà";
          if (details.length > 0) {
            message += " avec " + details.join(" et ");
          } else {
            message += ".";
          }

          toast.error(message);

          // Ramener à l'étape à corriger
          if (data.fields?.includes("siret")) setCurrentStep(3);
          else if (data.fields?.includes("email")) setCurrentStep(2);
          else if (data.fields?.includes("nom")) setCurrentStep(1);
          else setCurrentStep(1);
          return;
        } else {
          toast.error(data.message || "Erreur lors de la création");
        }
        return;
      }

      toast.success("Association créée avec succès !");
      router.push("/dashboard");
    } catch (error) {
      console.error("Erreur lors de la soumission :", error);
      toast.error("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">  {/* eslint-disable-next-line react/no-unescaped-entities */}
                  Informations de l'association</h3>
                <HelpTooltip text="Ces informations permettront d'identifier votre association et de la catégoriser correctement." />
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
                    {/* eslint-disable-next-line react/no-unescaped-entities */}
                    Nom de l'association <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nom"
                    id="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    placeholder="Ex: Association Sportive de Paris"
                    className={`mt-1 block w-full border px-4 py-2 rounded-md shadow-sm focus:ring focus:ring-[#00B074] ${errors.nom ? "border-red-500" : ""
                      }`}
                  />
                  <ValidationIndicator
                    isValid={formData.nom.length >= 3}
                    message="Le nom doit contenir au moins 3 caractères"
                  />
                  {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom}</p>}
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                    {/* eslint-disable-next-line react/no-unescaped-entities */}
                    Type d'association <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="type"
                    id="type"
                    value={formData.type}
                    onChange={handleSelectChange}
                    className={`mt-1 block w-full border px-4 py-2 rounded-md shadow-sm focus:ring focus:ring-[#00B074] ${errors.type ? "border-red-500" : ""
                      }`}
                  >
                    <option value="">Sélectionnez un type</option>
                    <option value="Sportive">Sportive</option>
                    <option value="Culturelle">Culturelle</option>
                    <option value="Éducative">Éducative</option>
                    <option value="Sociale">Sociale</option>
                    <option value="Humanitaire">Humanitaire</option>
                    <option value="Loisirs">Loisirs</option>
                    <option value="Autre">Autre</option>
                  </select>
                  <p className="text-sm text-gray-500 mt-1">
                    Choisissez la catégorie qui correspond le mieux à votre association
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {/* eslint-disable-next-line react/no-unescaped-entities */}
                  Adresse de l'association</h3>
                <HelpTooltip text="L'adresse complète de votre association est nécessaire pour la communication officielle et les documents administratifs." />
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="adresse" className="block text-sm font-medium text-gray-700">
                    Adresse <span className="text-red-500">*</span>
                  </label>
                  <AddressAutocomplete
                    value={formData.adresse}
                    onChange={handleAddressChange}
                    error={errors.adresse}
                  />
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-500">
                      {/* eslint-disable-next-line react/no-unescaped-entities */}
                      Commencez à taper pour voir les suggestions d'adresse
                    </p>
                    <p className="text-sm text-gray-500">
                      {/* eslint-disable-next-line react/no-unescaped-entities */}
                      Exemple: "3 rue de la Paix" ou "15 avenue des Champs-Élysées"
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {formData.adresseDetails.postcode && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Code postal
                      </label>
                      <div className="mt-1 px-4 py-2 bg-white rounded-md border border-gray-200">
                        {formData.adresseDetails.postcode}
                      </div>
                    </div>
                  )}
                  {formData.adresseDetails.city && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Ville
                      </label>
                      <div className="mt-1 px-4 py-2 bg-white rounded-md border border-gray-200">
                        {formData.adresseDetails.city}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Info className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Conseil</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      Assurez-vous que les informations saisies sont exactes. Elles seront utilisées pour :
                    </p>
                    <ul className="list-disc list-inside mt-1">
                      <li>La création de votre compte administrateur</li>
                      <li>  {/* eslint-disable-next-line react/no-unescaped-entities */}
                        Les documents officiels de l'association</li>
                      <li>La communication avec les membres</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Coordonnées de contact</h3>
                <HelpTooltip text="Ces informations seront utilisées pour vous contacter et pour la communication avec les membres de l'association." />
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email de contact <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="contact@votre-association.fr"
                    className={`mt-1 block w-full border px-4 py-2 rounded-md shadow-sm focus:ring focus:ring-[#00B074] ${errors.email ? "border-red-500" : ""
                      }`}
                  />
                  <ValidationIndicator
                    isValid={/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)}
                    message="Format d'email valide requis"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="telephone" className="block text-sm font-medium text-gray-700">
                    Téléphone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="telephone"
                    id="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    placeholder="06 12 34 56 78"
                    className={`mt-1 block w-full border px-4 py-2 rounded-md shadow-sm focus:ring focus:ring-[#00B074] ${errors.telephone ? "border-red-500" : ""
                      }`}
                  />
                  <ValidationIndicator
                    isValid={/^[0-9]{10}$/.test(formData.telephone.replace(/\s/g, ""))}
                    message="Format: 10 chiffres (ex: 0612345678)"
                  />
                  {errors.telephone && <p className="text-red-500 text-sm mt-1">{errors.telephone}</p>}
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Info className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Information importante</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      {/* eslint-disable-next-line react/no-unescaped-entities */}
                      L'email que vous renseignez sera utilisé pour :
                    </p>
                    <ul className="list-disc list-inside mt-1">
                      <li>La connexion à votre espace administrateur</li>
                      <li>La réception des notifications importantes</li>
                      <li>La communication avec les membres</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Informations administratives</h3>
                <HelpTooltip text="Ces informations sont nécessaires pour l'identification administrative de votre association." />
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="siret" className="block text-sm font-medium text-gray-700">
                    Numéro SIRET <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="siret"
                    id="siret"
                    value={formData.siret}
                    onChange={handleChange}
                    placeholder="14 chiffres"
                    className={`mt-1 block w-full border px-4 py-2 rounded-md shadow-sm focus:ring focus:ring-[#00B074] ${errors.siret ? "border-red-500" : ""
                      }`}
                  />
                  <ValidationIndicator
                    isValid={/^[0-9]{14}$/.test(formData.siret.replace(/\s/g, ""))}
                    message="Le numéro SIRET doit contenir exactement 14 chiffres"
                  />
                  {errors.siret && <p className="text-red-500 text-sm mt-1">{errors.siret}</p>}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Mot de passe administrateur <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`mt-1 block w-full border px-4 py-2 rounded-md shadow-sm focus:ring focus:ring-[#00B074] ${errors.password ? "border-red-500" : ""
                      }`}
                  />
                  <div className="mt-2 space-y-1">
                    <ValidationIndicator
                      isValid={formData.password.length >= 8}
                      message="Minimum 8 caractères"
                    />
                    <ValidationIndicator
                      isValid={/[A-Z]/.test(formData.password)}
                      message="Au moins une majuscule"
                    />
                    <ValidationIndicator
                      isValid={/[0-9]/.test(formData.password)}
                      message="Au moins un chiffre"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirmer le mot de passe <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`mt-1 block w-full border px-4 py-2 rounded-md shadow-sm focus:ring focus:ring-[#00B074] ${errors.confirmPassword ? "border-red-500" : ""
                      }`}
                  />
                  <ValidationIndicator
                    isValid={formData.password === formData.confirmPassword && formData.password !== ""}
                    message="Les mots de passe doivent correspondre"
                  />
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Info className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Sécurité du mot de passe</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      Pour la sécurité de votre compte, votre mot de passe doit :
                    </p>
                    <ul className="list-disc list-inside mt-1">
                      <li>Contenir au moins 8 caractères</li>
                      <li>Inclure au moins une majuscule</li>
                      <li>Inclure au moins un chiffre</li>
                      <li>Être différent de votre email</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            {associationExists ? (
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Info className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Association déjà existante</h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        Cette association existe déjà. Veuillez vérifier les informations saisies.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Récapitulatif de votre inscription</h3>
                  <HelpTooltip text="Vérifiez bien toutes les informations avant de valider la création de votre association." />
                </div>
                <div className="space-y-4">
                  <div>
                    <span className="block text-sm font-medium text-gray-700">
                      {/* eslint-disable-next-line react/no-unescaped-entities */}
                      Nom de l'association :</span>
                    <span className="block text-base text-gray-900">{formData.nom}</span>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-700">Type :</span>
                    <span className="block text-base text-gray-900">{formData.type}</span>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-700">Adresse :</span>
                    <span className="block text-base text-gray-900">
                      {formData.adresseDetails.street}<br />
                      {formData.adresseDetails.postcode} {formData.adresseDetails.city}
                    </span>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-700">Email de contact :</span>
                    <span className="block text-base text-gray-900">{formData.email}</span>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-700">Téléphone :</span>
                    <span className="block text-base text-gray-900">{formData.telephone}</span>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-700">Numéro SIRET :</span>
                    <span className="block text-base text-gray-900">{formData.siret}</span>
                  </div>
                </div>
              </div>
            )}
            <div className="flex justify-between pt-4">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Retour
                </button>
              )}
              {!associationExists && (
                <button
                  type="submit"
                  disabled={loading}
                  className="ml-auto px-4 py-2 bg-[#00B074] text-white rounded-md hover:bg-[#009a66] transition disabled:opacity-50"
                >
                  {loading ? "Création en cours..." : "Créer mon association"}
                </button>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <WrapperVitrine>
      <div className="min-h-[80vh] flex items-center justify-center px-2 sm:px-4">
        <div className="w-full max-w-2xl bg-white shadow-md rounded-xl p-4 sm:p-8 mx-auto">
          <h1 className="text-2xl font-bold text-center text-[#00B074] mb-6">
            Créer votre association
          </h1>

          <Timeline currentStep={currentStep} />

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-between pt-4">
              {currentStep > 1 && currentStep !== 4 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Retour
                </button>
              )}
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="ml-auto px-4 py-2 bg-[#00B074] text-white rounded-md hover:bg-[#009a66] transition"
                >
                  Suivant
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="ml-auto px-4 py-2 bg-[#00B074] text-white rounded-md hover:bg-[#009a66] transition disabled:opacity-50"
                >
                  {loading ? "Création en cours..." : "Créer mon association"}
                </button>
              )}
            </div>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Déjà un compte ?{" "}
            <Link href="/connexion" className="text-[#00B074] hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </WrapperVitrine>
  );
}
