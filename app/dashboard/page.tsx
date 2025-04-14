'use server'
import Wrapper from "@/app/component/layout/Wrapper";
import { ChartNoAxesCombined, User, Users, } from "lucide-react";
import Link from "next/link";
import { getFamilles } from "@/lib/famille";
import AccueilInfos from "../component/layout/AccueilInfo";

export default async function Home() {
  const familles = await getFamilles();

  const uniqueAdherents = familles?.filter(x => x.type.nom === "Individuel");
  const familleAdherents = familles?.filter(x => x.type.nom === "Famille");

  const paiementR = familles?.filter((famille) =>
    famille.cotisation?.facture?.statutPaiement === "ACQUITTE"
  ) || [];

  const emptyPaiement = familles?.filter((famille) =>
    famille.cotisation?.facture?.statutPaiement === "EN_ATTENTE"
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
        <AccueilInfos />
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white p-5 shadow-md rounded-lg text-center hover:bg-[#e6f7f1] transition duration-200 group">
            <Link href="/familles?filter=famille">
              <Users size={40} className="text-[#00B074] mx-auto transform transition duration-200 group-hover:scale-110 group-hover:text-[#00965e]" />
              <h2 className="text-2xl font-bold">{familleAdherents?.length}</h2>
              <p className="text-gray-500">Nombre de familles</p>
            </Link>
          </div>
          <div className="bg-white p-5 shadow-md rounded-lg text-center hover:bg-[#e6f7f1] transition duration-200 group">
            <Link href="/familles?filter=individuel">
              <User size={40} className="text-[#00B074] mx-auto transform transition duration-200 group-hover:scale-110 group-hover:text-[#00965e]" />
              <h2 className="text-2xl font-bold">{uniqueAdherents?.length}</h2>
              <p className="text-gray-500">Nombre d&lsquo;adhérent unique</p>
            </Link>
          </div>
          <div className="bg-white p-5 shadow-md rounded-lg text-center hover:bg-[#e6f7f1] transition duration-200 group">
            <Link href="/familles?filter=acquitte">
              <ChartNoAxesCombined size={40} className="text-[#00B074] mx-auto transform transition duration-200 group-hover:scale-110 group-hover:text-[#00965e]" />
              <h2 className="text-2xl font-bold">{tresoryReceived} €</h2>
              <p className="text-gray-500">Trésorerie en cours</p>
            </Link>
          </div>
          <div className="bg-white p-5 shadow-md rounded-lg text-center hover:bg-[#e6f7f1] transition duration-200 group">
            <Link href="/familles?filter=attente">
              <ChartNoAxesCombined size={40} className="text-[#00B074] mx-auto transform transition duration-200 group-hover:scale-110 group-hover:text-[#00965e]" />
              <h2 className="text-2xl font-bold">{tresoryWaiting} €</h2>
              <p className="text-gray-500">Trésorerie en attente</p>
            </Link>
          </div>
        </div>

      </div>
    </Wrapper>
  );
}


