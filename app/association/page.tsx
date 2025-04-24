// app/association/page.tsx
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import EditAssociationForm from "../component/association/EditAssociationPage";
import ProtectedWrapper from "@/app/component/layout/ProtectedWrapper";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export default async function EditPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) throw new Error("Non authentifié");

  const decoded = jwt.verify(token, JWT_SECRET) as { associationId: string };
  const associationServerData = await prisma.association.findUnique({
    where: { id: decoded.associationId },
    select: {
      nom: true,
      adresse: true,
      siret: true,
      email: true,
      telephone: true,
      type: true,
    },
  });

  if (!associationServerData) {
    throw new Error("Association introuvable");
  }

  return (
    <ProtectedWrapper>
      <div className="max-w-2xl mx-auto py-10">
        <EditAssociationForm associationServerData={associationServerData} />
      </div>
    </ProtectedWrapper>
  );
}
