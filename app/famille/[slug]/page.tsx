import ClientFamilleDetails from "@/app/component/famille/ClientFamilleDetails";
import { getFamilleById } from "@/lib/famille";
import { Metadata } from "next";
import { getUserFromCookies } from "@/lib/auth";
import ProtectedWrapper from "@/app/component/layout/ProtectedWrapper";

// 👇 Fonction principale
export default async function FamillePage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const user = await getUserFromCookies();
  if (!user?.associationId) return null;

  const initialData = await getFamilleById(decodedSlug, user.associationId);

  return (
    <ProtectedWrapper>
      <ClientFamilleDetails initialData={initialData} id={slug} />
    </ProtectedWrapper>
  );
}

// 👇 Fonction SEO dynamique
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const { id } = await params;
  const user = await getUserFromCookies();
  if (!user?.associationId)
    return {
      title: "Non authentifié",
      description: "Connectez-vous pour voir les données.",
    };

  const famille = await getFamilleById(id, user.associationId);

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
