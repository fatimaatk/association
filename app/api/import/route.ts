import { NextRequest, NextResponse } from "next/server";
import { importExcel } from "@/lib/importation";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user?.associationId) {
    return NextResponse.json({ message: "Non authentifié" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: "Fichier invalide" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await importExcel(buffer, user.associationId); // ⬅️ on passe l’association

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error("Erreur lors de l'import :", error);
    const message = error instanceof Error ? error.message : JSON.stringify(error);

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
