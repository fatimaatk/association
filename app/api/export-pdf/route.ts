import { NextRequest, NextResponse } from 'next/server';
import { renderToStream } from '@react-pdf/renderer';
import JSZip from 'jszip';
import { createAttestationPDF, createRelancePDF } from '@/lib/pdfGenerators';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user?.associationId) {
    return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });
  }

  const { type, ids } = await req.json();

  if (!type || !Array.isArray(ids)) {
    return NextResponse.json({ message: 'Paramètres invalides' }, { status: 400 });
  }

  try {
    //const adherents = await getAdherentsByIds(ids, user.associationId);
    const adherents = await prisma.famille.findMany({
      where: {
        id: { in: ids },
        associationId: user.associationId,
      },
      include: {
        type: true,
        membres: true,
        cotisation: { include: { facture: true } },
        chefFamille: true,
      }
    });
    if (adherents.length === 1) {
      const adherent = adherents[0];
      const doc = type === 'attestation' ? createAttestationPDF(adherent) : createRelancePDF(adherent);
      const stream = await renderToStream(doc);
      const chunks: Uint8Array[] = [];
      for await (const chunk of stream) {
        if (typeof chunk === "string") {
          chunks.push(Buffer.from(chunk));
        } else {
          chunks.push(chunk as Uint8Array);
        }
      }
      const pdfBuffer = Buffer.concat(chunks);
      const nom = adherent.chefFamille?.nom || 'inconnu';
      const prenom = adherent.chefFamille?.prenom || '';
      const fileName = `${nom}_${prenom}_${type}.pdf`;

      return new NextResponse(new Uint8Array(pdfBuffer), {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `inline; filename=${fileName}`,
        },
      });
    }

    const zip = new JSZip();

    for (const adherent of adherents) {
      const doc = type === 'attestation' ? createAttestationPDF(adherent) : createRelancePDF(adherent);
      const stream = await renderToStream(doc);
      const chunks: Uint8Array[] = [];
      for await (const chunk of stream) {
        if (typeof chunk === "string") {
          chunks.push(Buffer.from(chunk));
        } else {
          chunks.push(chunk as Uint8Array);
        }
      }
      const pdfBuffer = Buffer.concat(chunks);
      const nom = adherent.chefFamille?.nom || 'inconnu';
      const prenom = adherent.chefFamille?.prenom || '';
      const fileName = `${nom}_${prenom}_${type}.pdf`;
      zip.file(fileName, pdfBuffer);
    }

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

    return new NextResponse(new Uint8Array(zipBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename=export-${type}.zip`,
      },
    });
  } catch (error) {
    console.error('Erreur export-pdf:', error);
    return NextResponse.json({ message: 'Erreur lors de la génération des PDF' }, { status: 500 });
  }
}
