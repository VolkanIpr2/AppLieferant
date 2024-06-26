import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Bestellung from './Bestellung';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { useRouter } from 'next/router';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const mockAxios = new MockAdapter(axios);

const bestellungenMock = [
  {
    _id: '1',
    kunde: 'John Doe',
    adresse: '123 Main St',
    status: 0,
  },
  {
    _id: '2',
    kunde: 'Jane Smith',
    adresse: '456 Elm St',
    status: 1,
  },
];

beforeEach(() => {
  mockAxios.reset();
  useRouter.mockImplementation(() => ({
    reload: jest.fn(),
  }));
});

test('renders Bestellung component', async () => {
  render(<Bestellung bestellungen={bestellungenMock} />);
  
  expect(screen.getByText('Admin Backend')).toBeInTheDocument();
  expect(screen.getByText('Artikel hinzufügen')).toBeInTheDocument();

  bestellungenMock.forEach((bestellung) => {
    expect(screen.getByText(bestellung.kunde)).toBeInTheDocument();
    expect(screen.getByText(bestellung.adresse)).toBeInTheDocument();
  });
});

test('adds a new product', async () => {
  render(<Bestellung bestellungen={bestellungenMock} />);
  
  fireEvent.click(screen.getByText('Artikel hinzufügen'));
  
  const modal = screen.getByRole('dialog');
  expect(modal).toBeInTheDocument();

  // Add form interactions and submit actions here
});

test('updates the status of a bestellung', async () => {
  render(<Bestellung bestellungen={bestellungenMock} />);

  const statusButton = screen.getAllByText('Eingegangen')[0];

  fireEvent.click(statusButton);

  expect(mockAxios.history.put.length).toBe(1);
  expect(mockAxios.history.put[0].url).toBe(`${process.env.NEXT_PUBLIC_API_BASE_URL_LOCAL}/api/bestellungen/1`);

  // Check if the router reload function is called
  expect(useRouter().reload).toHaveBeenCalled();
});

test('removes a bestellung', async () => {
  render(<Bestellung bestellungen={bestellungenMock} />);

  const deleteButton = screen.getAllByText('x')[0];

  fireEvent.click(deleteButton);

  expect(mockAxios.history.delete.length).toBe(1);
  expect(mockAxios.history.delete[0].url).toBe(`${process.env.NEXT_PUBLIC_API_BASE_URL_LOCAL}/api/bestellungen/1`);

  // Check if the router reload function is called
  expect(useRouter().reload).toHaveBeenCalled();
});
