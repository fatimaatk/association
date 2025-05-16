'use client'

import { useSearchParams } from 'next/navigation';
import { IFamille } from '@/models/interfaceFamilles';
import DetailFamillesBoard from './DetailFamillesBoard';
import Link from 'next/link';
import { utils, writeFile } from "xlsx";

export default function FamilleListWithFilters({ familles }: { familles: IFamille[] }) {
  const searchParams = useSearchParams();
  const filter = searchParams.get('filter');

  const filteredFamilles = familles.filter((famille) => {
    if (filter === "famille") {
      return famille.type.nom === "Famille";
    } else if (filter === "individuel") {
      return famille.type.nom === "Individuel";
    } else if (filter === "acquitte") {
      return famille.cotisation?.facture?.statutPaiement === "ACQUITTE";
    } else if (filter === "attente") {
      return famille.cotisation?.facture?.statutPaiement === "EN_ATTENTE";
    }
    return true;
  });

  const getButtonClass = (key: string) => {
    const base = "btn px-4 py-2 rounded";
    const active = "bg-[#00B074] text-white hover:bg-[#01965e]";
    const inactive = "bg-gray-200 text-gray-800 hover:bg-gray-300";
    if (!filter && key === "") return `${base} ${active}`;
    return `${base} ${filter === key ? active : inactive}`;
  };

  // Fonction d'export
  const handleExportExcel = () => {
    // 1. Préparation des données pour l'onglet Familles
    const famillesSheet = filteredFamilles.map(famille => ({
      id: famille.id,
      Famille: famille.type?.nom || "",
      ChefFamille: famille.chefFamille?.nom || "",
      ChefPrenom: famille.chefFamille?.prenom || "",
      Chef_dateNaissance: famille.chefFamille?.dateNaissance || "",
      adresse: famille.adresse || "",
      adresseEmail: famille.adresseEmail || "",
      téléphone: famille.telephone || "",
      montant_cotisation: famille.cotisation?.montant ?? "",
      typePaiement: famille.cotisation?.facture?.typePaiement || "",
      statutPaiement: famille.cotisation?.facture?.statutPaiement || "",
      datePaiement: famille.cotisation?.facture?.datePaiement
        ? new Date(famille.cotisation.facture.datePaiement).toLocaleDateString("fr-FR")
        : "",
    }));

    // 2. Préparation des données pour l'onglet Membres
    // On suppose que chaque famille a un tableau membres
    const membresSheet = filteredFamilles.flatMap(famille =>
      (famille.membres || []).map(membre => ({
        nom: membre.nom || "",
        prenom: membre.prenom || "",
        dateNaissance: membre.dateNaissance || "",
        familleId: famille.id,
        id: membre.id,
      }))
    );

    // 3. Création des feuilles
    const wb = utils.book_new();
    const wsFamilles = utils.json_to_sheet(famillesSheet, {
      header: [
        "id", "Famille", "ChefFamille", "ChefPrenom", "Chef_dateNaissance", "adresse", "adresseEmail", "téléphone", "montant_cotisation", "typePaiement", "statutPaiement", "datePaiement"
      ]
    });
    const wsMembres = utils.json_to_sheet(membresSheet, {
      header: [
        "nom", "prenom", "dateNaissance", "familleId", "id"
      ]
    });

    utils.book_append_sheet(wb, wsFamilles, "Familles");
    utils.book_append_sheet(wb, wsMembres, "Membres");

    // 4. Export du fichier
    writeFile(wb, "export_familles_membres.xlsx");
  };

  return (
    <>
      <div className="mb-6 flex flex-wrap gap-4 justify-start items-center">
        <button
          onClick={handleExportExcel}
          className="btn px-4 py-2 rounded bg-[#00B074] text-white hover:bg-[#01965e] font-semibold"
        >
          Exporter en Excel
        </button>
        <Link href="/familles" className={getButtonClass("")}>Voir toutes les familles</Link>
        <Link href="/familles?filter=attente" className={getButtonClass("attente")}>Paiements en attente</Link>
        <Link href="/familles?filter=acquitte" className={getButtonClass("acquitte")}>Paiements acquittés</Link>
        <Link href="/familles?filter=famille" className={getButtonClass("famille")}>Adhérents familles</Link>
        <Link href="/familles?filter=individuel" className={getButtonClass("individuel")}>Adhérents individuels</Link>
      </div>

      <DetailFamillesBoard familles={filteredFamilles} />
    </>
  )
}
