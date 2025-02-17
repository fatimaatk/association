
"use client";

import { getFamilies } from "@/services/familles";
import Wrapper from "./component/Wrapper"
import Link from "next/link";
import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import confetti from "canvas-confetti";
import Loader from "./component/loader";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [familles, setFamilles] = useState<any>([])

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const deleteFamille = async (id) => {
    try {
      const payload = {
        id
      };

      const res = await fetch(`/api/familles/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error("Famille non supprimée");
      }
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        zIndex: 9999,
      });
      const data = await res.json();
      router.push('/')
    } catch (error) {
      console.error("Erreur lors du chargement des factures", error);
    }
  }

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
        <div className='grid grid-cols-4 gap-4'>
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

        </div>
      }
    </Wrapper>
  );
}

