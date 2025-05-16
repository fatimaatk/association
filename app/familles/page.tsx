// app/familles/page.tsx
export const dynamic = "force-dynamic";

import { getFamilles } from "@/lib/famille";
import { notFound } from "next/navigation";
import ProtectedWrapper from "../component/layout/ProtectedWrapper";
import { getUserFromCookies } from "@/lib/auth";
import FamilleListWithFilters from "../component/familles/FamillesListWithFilters";

export default async function FamillePage() {
  const user = await getUserFromCookies();
  const associationId = user?.associationId;
  if (!associationId) return notFound();

  const familles = await getFamilles(associationId);
  if (!familles) return notFound();

  return (
    <ProtectedWrapper>
      <FamilleListWithFilters familles={familles} />
    </ProtectedWrapper>
  );
}
