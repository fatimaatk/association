
"use client";


import Wrapper from "./component/Wrapper"
import { useEffect, useState } from "react";
import { ChartNoAxesCombined, File, HomeIcon, UserRoundPlus } from "lucide-react";
import Loader from "./component/loader";
import { useRouter } from "next/navigation";
import { IFamille } from "@/models/interfaceFamilles";

export default function Home() {
  const [familles, setFamilles] = useState<IFamille[]>([])

  const [loading, setLoading] = useState<boolean>(true);

  const fetchFamille = async () => {
    try {
      const res = await fetch(`/api/familles`);
      if (!res.ok) {
        throw new Error("Famille non trouvée");
      }
      const data = await res.json();
      setFamilles(data);
      setTimeout(() => { setLoading(false); }, 2000)
    } catch (error) {
      console.error("Erreur lors du chargement des factures", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFamille()
  }, [])


  return (
    <Wrapper>
      {loading ?
        <Loader loading={loading} />
        :
        <div className=" flex-1">

          <h1 className="text-2xl font-semibold mb-4">Accueil</h1>
          <p className="text-gray-600 mb-6">Bienvenue dans votre tableau de bord</p>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white p-5 shadow-md rounded-lg text-center">
              <HomeIcon size={40} className="text-[#00B074] mx-auto" />
              <h2 className="text-2xl font-bold">{familles.length}</h2>
              <p className="text-gray-500">Nombre de familles</p>
            </div>
            <div className="bg-white p-5 shadow-md rounded-lg text-center">
              <UserRoundPlus size={40} className="text-[#00B074] mx-auto" />
              <h2 className="text-2xl font-bold">357</h2>
              <p className="text-gray-500">Nombre de membres</p>
            </div>
            <div className="bg-white p-5 shadow-md rounded-lg text-center">
              <File size={40} className="text-[#00B074] mx-auto" />
              <h2 className="text-2xl font-bold">65</h2>
              <p className="text-gray-500">Paiement en attente</p>
            </div>
            <div className="bg-white p-5 shadow-md rounded-lg text-center">
              <ChartNoAxesCombined size={40} className="text-[#00B074] mx-auto" />
              <h2 className="text-2xl font-bold">320€</h2>
              <p className="text-gray-500">Trésorerie en cours</p>
            </div>
          </div>
        </div>

      }
    </Wrapper>
  );
}



{/* <div className='grid grid-cols-4 gap-4'>
  {familles?.map((famille) => (
    <div className="card bg-base-100 max-w-96 shadow-xl" key={famille.id}>
      <div className="card-body">
        <div className='flex justify-between'>

          <h2 className="card-title">{famille.representant.nom} {famille.representant.prenom} </h2>
          <button onClick={() => deleteFamille(famille.id)}>

            <Trash2 />
          </button>
        </div>
        <ul >
          <li >Type de famille : {famille.type.nom}</li>
          <li >Montant du paiement : {famille.cotisation?.montant}</li>
          <li >Statut du paiement : {famille.cotisation?.facture?.statutPaiement}</li>
          <li key={famille.id}>Membres :
            <div>
              {famille.membres.map((membre, index) => (
                <ul key={index}>
                  <li>
                    {membre.nom} {membre.prenom}
                  </li>
                </ul>
              ))}
            </div>

          </li>

        </ul>
      </div>
      <Link className="btn" href={`/famille/${famille.id}`}>
        CONSULTER
      </Link>
    </div>
  ))}

</div> */}