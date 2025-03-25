import { NextRequest, NextResponse } from "next/server";
import { importExcel } from "@/lib/importation";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const file = formData.get("file");
    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: "Fichier introuvable ou invalide" }, { status: 400 });
    }


    if (!file) {
      return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 });
    }

    if (!file.name.endsWith(".xlsx")) {
      return NextResponse.json({ error: "Format de fichier non supporté" }, { status: 400 });
    }

    // Lire le fichier directement en mémoire
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Appel de la fonction d'importation avec le buffer
    const data = await importExcel(buffer);

    return NextResponse.json({ message: data.message }, { status: 200 });

  } catch (error) {
    console.error("Erreur lors de l'import :", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
