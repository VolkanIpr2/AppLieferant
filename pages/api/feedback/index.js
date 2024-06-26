import Feedback from "@/models/Feedback";
import mongodb from "@/utils/mongodb";

export default async function handler(req, res) {
    try {
        await mongodb.dbConnect();

        switch (req.method) {
            case 'POST':
                // Neues Feedback erstellen
                try {
                    const neuesFeedback = new Feedback(req.body);
                    await neuesFeedback.save();
                    res.status(201).json(neuesFeedback);
                } catch (error) {
                    console.error('Error creating feedback:', error);
                    res.status(400).json({ error: error.message });
                }
                break;

            case 'GET':
                // Alle Feedbacks abrufen
                try {
                    const feedbacks = await Feedback.find({});
                    res.status(200).json(feedbacks);
                } catch (error) {
                    console.error('Error fetching feedbacks:', error);
                    res.status(500).json({ error: 'Serverfehler beim Abrufen der Feedbacks' });
                }
                break;

            default:
                // HTTP-Methode nicht unterstützt
                res.setHeader('Allow', ['POST', 'GET']);
                res.status(405).end(`Method ${req.method} Not Allowed`);
                break;
        }
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({ error: 'Serverfehler beim Verbinden mit der Datenbank' });
    }
    // await mongodb.dbDisconnect();
}