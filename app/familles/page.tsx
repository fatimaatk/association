
import { getFamilles } from "@/lib/famille";
import DetailFamillesBoard from "../component/familles/DetailFamillesBoard";
import Wrapper from "../component/Wrapper";


export default async function FamillePage() {
  const familles = await getFamilles();
  return (
    <Wrapper>
      <DetailFamillesBoard familles={familles} />
    </Wrapper>
  );
};


