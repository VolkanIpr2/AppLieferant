import { Table, Button, CloseButton } from 'react-bootstrap';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from "next/link";
import ProduktFormModal from '../../komponenten/ProduktFormModal';
import { useState } from 'react';

const isProduction = process.env.NODE_ENV === 'production';
const API_BASE_URL = isProduction 
  ? process.env.NEXT_PUBLIC_API_BASE_URL_PRODUCTION 
  : process.env.NEXT_PUBLIC_API_BASE_URL_LOCAL;

export default function Bestellung({ bestellungen }) {
    
    const [modalShow, setModalShow] = useState(false);
    const router = useRouter();

    const saveProdukt = async (produkt) => {
        // API-Aufruf zum Speichern des Produkts
        await axios.post(`${API_BASE_URL}/api/produkte`, produkt);
        router.reload();
    };

    const status = ["Eingegangen", "Zubereitung", "Unterwegs", "Ausgeliefert"];

    const statusUpdate = async (id, aktuellerStatus) => {
        try {
            if (aktuellerStatus <= 2) {
                await axios.put(`${API_BASE_URL}/api/bestellungen/` + id, { status: aktuellerStatus + 1 });
                router.reload();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const bestellungEntfernen = async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/api/bestellungen/` + id);
            router.reload();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <div>
                <Button variant="primary" onClick={() => setModalShow(true)}>
                    Artikel hinzufügen
                </Button>
                <ProduktFormModal
                    show={modalShow}
                    handleClose={() => setModalShow(false)}
                    saveProdukt={saveProdukt}
                />
            </div>
            <h1>Admin Backend</h1>
            <div className="row mt-4">
                <div className="col-12">
                    <Table hover responsive>
                        <thead>
                            <tr>
                                <th>Bestell Nr.</th>
                                <th>Kunde</th>
                                <th>Adresse</th>
                                <th>Status</th>
                                <th><CloseButton disabled /></th>
                            </tr>
                        </thead>
                        {bestellungen.map((bestellung) => (
                            <tbody key={bestellung._id}>
                                <tr>
                                    <td>
                                        <Link href={`/bestellungen/${bestellung._id}`} className='text-danger' style={{ textDecoration: 'none' }}>
                                            {bestellung._id}
                                        </Link>
                                    </td>
                                    <td>{bestellung.kunde}</td>
                                    <td>{bestellung.adresse}</td>
                                    <td>
                                        <Button onClick={() => statusUpdate(bestellung._id, bestellung.status)}>{status[bestellung.status]}</Button>
                                    </td>
                                    <td>
                                        <Button variant="danger" onClick={() => bestellungEntfernen(bestellung._id)}>x</Button>
                                    </td>
                                </tr>
                            </tbody>
                        ))}
                    </Table>
                </div>
            </div>
        </div>
    );
}

export async function getServerSideProps(ctx) {
    const meinCookie = ctx.req?.cookies || "";
    if (meinCookie.token !== process.env.TOKEN) {
        return {
            redirect: {
                destination: "/backend/login",
                permanent: false
            }
        };
    }
    const isProduction = process.env.NODE_ENV === 'production';
    const API_BASE_URL = isProduction 
        ? process.env.NEXT_PUBLIC_API_BASE_URL_PRODUCTION 
        : process.env.NEXT_PUBLIC_API_BASE_URL_LOCAL;

    const res = await axios.get(`${API_BASE_URL}/api/bestellungen`);
    
    return {
        props: { bestellungen: res.data },
    };
}
