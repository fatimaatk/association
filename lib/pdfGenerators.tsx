// lib/pdfGenerators.tsx
import { Document, DocumentProps, Page, Text, StyleSheet, View } from '@react-pdf/renderer';
import type { IFamille } from '@/models/interfaceFamilles';

const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontSize: 12,
    fontFamily: 'Helvetica',
    lineHeight: 1.5,
  },
  title: {
    fontSize: 14,
    marginBottom: 40,
    textAlign: 'left',
    fontWeight: 'bold',
    textDecoration: 'underline',
  },
  paragraph: {
    marginBottom: 20,
    textAlign: 'justify',
  },
  signatureBlock: {
    marginTop: 80,
    textAlign: 'right',
  },
  signatureLine: {
    marginTop: 40,
    textAlign: 'right',
  },
  infoBlock: {
    marginBottom: 30,
    lineHeight: 1.4,
  },
});

function formatDate(dateString: string | Date | null | undefined): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export const createAttestationPDF = (famille: IFamille): React.ReactElement<DocumentProps> => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.infoBlock}>
        <Text>Destinataire</Text>
        <Text>{famille.chefFamille?.nom?.toUpperCase()} {famille.chefFamille?.prenom}</Text>
        <Text>{famille.adresse || ''}</Text>
        <Text>{famille.adresseEmail || ''}</Text>
      </View>

      <Text style={styles.title}>Objet : Attestation d’adhésion à l’association</Text>

      <Text style={styles.paragraph}>
        Je soussigné(e), représentant de l’association, atteste par la présente que {famille.chefFamille?.nom} {famille.chefFamille?.prenom}, représentant légal de la famille {famille.chefFamille?.nom}, est adhérent(e) à notre association pour l’année en cours.
      </Text>

      <Text style={styles.paragraph}>
        L’adhésion a été enregistrée le {formatDate(famille.cotisation?.facture?.datePaiement)} accompagnée du paiement de la cotisation d’un montant de {famille.cotisation?.montant} euros, réglé par {famille.cotisation?.facture?.typePaiement}. À ce titre, il/elle bénéficie des droits afférents aux membres actifs de notre structure.
      </Text>

      <View style={styles.signatureBlock}>
        <Text>Fait à ……………………………</Text>
        <Text>Le {formatDate(new Date())}</Text>

        <View style={styles.signatureLine}>
          <Text>Signature</Text>
          <Text>Cachet de l’association</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export const createRelancePDF = (famille: IFamille): React.ReactElement<DocumentProps> => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.infoBlock}>
        <Text>Destinataire</Text>
        <Text>{famille.chefFamille?.nom?.toUpperCase()} {famille.chefFamille?.prenom}</Text>
        <Text>{famille.adresse || ''}</Text>
        <Text>{famille.adresseEmail || ''}</Text>
      </View>

      <Text style={styles.title}>Objet : Relance pour paiement de cotisation</Text>

      <Text style={styles.paragraph}>
        Sauf erreur ou omission de notre part, nous n’avons pas encore reçu le règlement de votre cotisation pour l’année en cours.
        Nous vous invitons à régulariser votre situation dans les plus brefs délais afin de continuer à bénéficier de l’ensemble des services proposés par notre association.
      </Text>

      <Text style={styles.paragraph}>
        Nous restons à votre disposition pour tout complément d’information et vous prions d’agréer nos salutations distinguées.
      </Text>

      <View style={styles.signatureBlock}>
        <Text>Fait à ……………………………</Text>
        <Text>Le {formatDate(new Date())}</Text>

        <View style={styles.signatureLine}>
          <Text>Signature</Text>
          <Text>Cachet de l’association</Text>
        </View>
      </View>
    </Page>
  </Document>
);
