import ClientFamilleDetails from "@/app/component/famille/ClientFamilleDetails";
import Wrapper from "@/app/component/Wrapper";
import { getFamilleById } from "@/lib/famille";
import { Metadata } from "next";

// 👇 Fonction principale
export default async function FamillePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const initialData = await getFamilleById(id);

  return (
    <Wrapper>
      <ClientFamilleDetails initialData={initialData} id={id} />
    </Wrapper>
  );
}

// 👇 Fonction SEO dynamique
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const famille = await getFamilleById(params.id);

  if (!famille) {
    return {
      title: "Famille non trouvée",
      description: "Aucune information disponible pour cette famille.",
    };
  }
  const chef = famille.chefFamille;
  const fullName = `${chef.prenom} ${chef.nom}`;

  return {
    title: `Famille de ${fullName}`,
    description: `Informations détaillées sur la famille de ${fullName}.`,
  };
}
