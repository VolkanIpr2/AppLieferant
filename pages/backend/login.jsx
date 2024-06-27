import { useState } from "react";
import { useRouter } from "next/router";
import { Form, Button } from "react-bootstrap";
import axios from "axios";

const isProduction = process.env.NODE_ENV === 'production';
const API_BASE_URL = isProduction 
  ? process.env.NEXT_PUBLIC_API_BASE_URL_PRODUCTION 
  : process.env.NEXT_PUBLIC_API_BASE_URL_LOCAL;
export default function Login() {
    const [benutzer, setBenutzer] = useState(null);
    const [passwort, setPasswort] = useState(null);
    const [error, setError] = useState(false);
    const router = useRouter();

    const login = async () => {
        try {
          console.log(API_BASE_URL)
          console.log()

            await axios.post(`${API_BASE_URL}/api/login`, {
                benutzer,
                passwort
            });
            router.push("/backend");
        } catch (error) {
            setError(true);
        }
    };

    return (
        <div>
            <h1>Login</h1>
            {error && <p className="text-danger">Login fehlgeschlagen</p>}
            <div className="row mt-4">
                <Form>
                    <Form.Group className="mb-3" controlId="benutzer">
                        <Form.Control type="text" placeholder="Benutzer"
                            onChange={(e) => setBenutzer(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="passwort">
                        <Form.Control type="password" placeholder="Passwort"
                            onChange={(e) => setPasswort(e.target.value)}
                        />
                    </Form.Group>
                    <Button variant="primary" onClick={login}>
                        Login
                    </Button>
                </Form>
            </div>
        </div>
    );
}
