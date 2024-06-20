import ProduktListe from "../komponenten/ProduktListe";
import Slider from "../komponenten/Slider";
import Produkt from "../models/Produkt";
import mongodb from "../utils/mongodb";

export default function Home({ produkte }) {
  return (
    <div>
      <Slider/>
      <ProduktListe produkte={produkte}/>
    </div>
  )
}

export async function getServerSideProps(){
  await mongodb.dbConnect();
  const produkte = await Produkt.find({}).lean();
  return {
    props: {
      produkte: JSON.parse(JSON.stringify(produkte))
    }
  }
}