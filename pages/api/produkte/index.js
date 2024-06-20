// pages/api/produkte/index.js
import mongodb from "../../../utils/mongodb";
import Produkt from "../../../models/Produkt";

export default async function handler(req, res) {
  await mongodb.dbConnect();

  switch (req.method) {
    case 'POST':
      // Neues Produkt erstellen
      try {
        const neuesProdukt = new Produkt(req.body);
        await neuesProdukt.save();
        res.status(201).json(neuesProdukt);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
      break;

    case 'GET':
      // Alle Produkte abrufen
      try {
        const produkte = await Produkt.find({});
        res.status(200).json(produkte);
      } catch (error) {
        res.status(500).json({ error: 'Serverfehler beim Abrufen der Produkte' });
      }
      break;

    case 'DELETE':
        // Produkt löschen
      try {
          const { id } = req.query;
          if (!id) {
            return res.status(400).json({ error: 'Produkt ID fehlt' });
          }
          const deleteResult = await Produkt.findByIdAndDelete(id);
          if (!deleteResult) {
            return res.status(404).json({ error: 'Produkt nicht gefunden' });
          }
          res.status(200).json({ message: 'Produkt erfolgreich gelöscht', product: deleteResult });
        } catch (error) {
          res.status(500).json({ error: 'Serverfehler beim Löschen des Produkts' });
        }
        break;
  
      default:
        // HTTP-Methode nicht unterstützt
        res.setHeader('Allow', ['POST', 'GET', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  await mongodb.dbDisconnect();
}
