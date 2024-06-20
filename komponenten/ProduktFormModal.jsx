import { Modal, Button, Form, CloseButton } from 'react-bootstrap';
import { useState } from 'react';
import axios from 'axios';

function ProduktFormModal({ show, handleClose }) {
  const [produkt, setProdukt] = useState({
    name: '',
    beschreibung: '',
    kategorie: '',
    preis: '',
    url: '',
    bild: '',
    extras: []
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProdukt({...produkt, [name]: value});
  };

  const handleExtraChange = (index, field, value) => {
    const newExtras = [...produkt.extras];
    newExtras[index][field] = value;
    setProdukt({...produkt, extras: newExtras});
  };

  const addExtra = () => {
    setProdukt({...produkt, extras: [...produkt.extras, { text: '', preis: '' }]});
  };

  const removeExtra = (index) => {
    const newExtras = [...produkt.extras];
    newExtras.splice(index, 1);
    setProdukt({...produkt, extras: newExtras});
  };

  const handleSave = async () => {
    try {
      const response = await axios.post('/api/produkte', produkt);
      if (response.status === 201) {
        handleClose();
      }
    } catch (error) {
      console.log('Ich bin vom handleSave()');
      console.error('Fehler beim Speichern des Produkts:', error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Neues Produkt hinzufügen</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={produkt.name}
              onChange={handleInputChange}
              placeholder="Name des Produkts"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Beschreibung</Form.Label>
            <Form.Control
              type="text"
              name="beschreibung"
              value={produkt.beschreibung}
              onChange={handleInputChange}
              placeholder="Beschreibung"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Kategorie</Form.Label>
            <Form.Control
              type="text"
              name="kategorie"
              value={produkt.kategorie}
              onChange={handleInputChange}
              placeholder="Kategorie"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Preis</Form.Label>
            <Form.Control
              type="number"
              name="preis"
              value={produkt.preis}
              onChange={handleInputChange}
              placeholder="Preis"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>URL</Form.Label>
            <Form.Control
              type="text"
              name="url"
              value={produkt.url}
              onChange={handleInputChange}
              placeholder="URL"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Bild</Form.Label>
            <Form.Control
              type="text"
              name="bild"
              value={produkt.bild}
              onChange={handleInputChange}
              placeholder="Bild URL"
            />
          </Form.Group>
          <h5>Extras</h5>
          {produkt.extras.map((extra, index) => (
            <div key={index} className="mb-3">
              <Form.Control
                type="text"
                placeholder="Text"
                value={extra.text}
                onChange={(e) => handleExtraChange(index, 'text', e.target.value)}
              />
              <Form.Control
                type="number"
                placeholder="Preis"
                value={extra.preis}
                onChange={(e) => handleExtraChange(index, 'preis', e.target.value)}
                className="mt-2"
              />
              <CloseButton onClick={() => removeExtra(index)} className="mt-2" />
            </div>
          ))}
          <Button variant="primary" onClick={addExtra} className="my-2">
            Extra hinzufügen
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Schließen
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Speichern
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ProduktFormModal;
