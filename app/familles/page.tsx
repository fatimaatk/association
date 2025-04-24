import { getFamilles } from "@/lib/famille";
import DetailFamillesBoard from "../component/familles/DetailFamillesBoard";
import { notFound } from "next/navigation";
import ProtectedWrapper from "../component/layout/ProtectedWrapper";
import { getUserFromCookies } from "@/lib/auth";

interface SearchParams {
  searchParams?: {
    filter?: string;
  };
}

export default async function FamillePage({ searchParams }: SearchParams) {
  const user = await getUserFromCookies();
  const associationId = user?.associationId;

  if (!associationId) return notFound();

  const familles = await getFamilles(associationId);
  if (!familles) return notFound();

  const filter = searchParams?.filter;

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

  return (
    <ProtectedWrapper>
      <div className="mb-6 flex flex-wrap gap-4 justify-start">
        <a
          href="/familles"
          className={`${getButtonClass("")}`}
        >
          Voir toutes les familles
        </a>
        <a
          href="/familles?filter=attente"
          className={getButtonClass("attente")}
        >
          Paiements en attente
        </a>
        <a
          href="/familles?filter=acquitte"
          className={getButtonClass("acquitte")}
        >
          Paiements acquittés
        </a>
        <a
          href="/familles?filter=famille"
          className={getButtonClass("famille")}
        >
          Adhérents familles
        </a>
        <a
          href="/familles?filter=individuel"
          className={getButtonClass("individuel")}
        >
          Adhérents individuels
        </a>
      </div>
      <DetailFamillesBoard familles={filteredFamilles} />
    </ProtectedWrapper>
  );
};