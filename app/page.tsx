import Wrapper from "./component/Wrapper"
import { ChartNoAxesCombined, File, HomeIcon } from "lucide-react";
import Link from "next/link";
import { getFamilles } from "@/lib/famille";

export default async function Home() {
  const familles = await getFamilles();

  const paiementR = familles?.filter((famille) =>
    famille.cotisation?.facture?.statutPaiement != null
  ) || [];

  const emptyPaiement = familles?.filter((famille) =>
    famille.cotisation?.facture?.statutPaiement === null
  ) || [];

  const tresoryWaiting = emptyPaiement.reduce((acc, famille) =>
    acc + (famille.cotisation?.montant || 0), 0
  );

  const tresoryReceived = paiementR.reduce((acc, famille) =>
    acc + (famille.cotisation?.montant || 0), 0
  );


  return (
    <Wrapper>
      <div className=" flex-1">
        <h1 className="text-2xl font-semibold mb-4">Accueil</h1>
        <p className="text-gray-600 mb-6">Bienvenue dans votre tableau de bord</p>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white p-5 shadow-md rounded-lg text-center">
            <Link href="/familles">
              <HomeIcon size={40} className="text-[#00B074] mx-auto" />
              <h2 className="text-2xl font-bold">{familles?.length}</h2>
              <p className="text-gray-500">Nombre de familles</p>
            </Link>
          </div>
          <div className="bg-white p-5 shadow-md rounded-lg text-center">
            <File size={40} className="text-[#00B074] mx-auto" />
            <h2 className="text-2xl font-bold">{emptyPaiement?.length}</h2>
            <p className="text-gray-500">Paiement en attente</p>
          </div>
          <div className="bg-white p-5 shadow-md rounded-lg text-center">
            <ChartNoAxesCombined size={40} className="text-[#00B074] mx-auto" />
            <h2 className="text-2xl font-bold">{tresoryReceived}</h2>
            <p className="text-gray-500">Trésorerie en cours</p>
          </div>
          <div className="bg-white p-5 shadow-md rounded-lg text-center">
            <ChartNoAxesCombined size={40} className="text-[#00B074] mx-auto" />
            <h2 className="text-2xl font-bold">{tresoryWaiting} €</h2>
            <p className="text-gray-500">Trésorerie en attente</p>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}


