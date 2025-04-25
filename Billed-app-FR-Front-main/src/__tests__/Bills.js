/**
 * @jest-environment jsdom
 */

import {screen, waitFor, fireEvent} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import Bills from "../containers/Bills.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store"
import router from "../app/Router.js";

// Mock du store pour isoler les tests des appels API réels
jest.mock("../app/store", () => mockStore)

/**
 * Tests de la page Bills (notes de frais)
 */
describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    /**
     * Vérifie que l'icône de factures est mise en évidence dans le layout
     */
    test("Then bill icon in vertical layout should be highlighted", async () => {
      // Simulation d'un utilisateur connecté
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      
      // Ajout de l'expression pour vérifier la classe active
      expect(windowIcon.classList.contains("active-icon")).toBe(true)
    })
    
    /**
     * Vérifie le tri antichronologique des factures
     */
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      
      // Extraction des dates affichées via regex
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      
      expect(dates).toEqual(datesSorted)
    })
  })
})

describe('Given I am connected as an employee', () => {
  describe('When I am on Bills Page', () => {
    /**
     * Vérifie la redirection vers la page NewBill
     * lors du clic sur le bouton "Nouvelle note de frais"
     */
    test('Then clicking on New Bill button should redirect to NewBill page', () => {
      const onNavigate = jest.fn()
      const bills = new Bills({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage
      })
      
      bills.handleClickNewBill()
      
      expect(onNavigate).toHaveBeenCalledWith(ROUTES_PATH["NewBill"])
    })

    /**
     * Vérifie l'ouverture de la modale lors du clic sur l'icône de visualisation
     */
    test('Then clicking on eye icon should open bill modal', () => {
      document.body.innerHTML = BillsUI({ data: bills })
      
      // Mock de jQuery.modal
      $.fn.modal = jest.fn()
      
      const billsInstance = new Bills({
        document,
        onNavigate: jest.fn(),
        store: null,
        localStorage: window.localStorage
      })
      
      // Simulation d'une icône avec URL de facture
      const icon = document.createElement('div')
      icon.setAttribute('data-bill-url', 'https://test.storage.tld/bill.jpg')
      
      billsInstance.handleClickIconEye(icon)
      
      expect($.fn.modal).toHaveBeenCalledWith('show')
    })

    /**
     * Vérifie le chargement et l'affichage des factures depuis l'API
     */
    test('Then bills should be fetched from API and displayed', async () => {
      localStorage.setItem('user', JSON.stringify({ type: 'Employee', email: 'a@a' }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByText("Mes notes de frais"))
      
      // Vérification de la présence des éléments clés
      const contentTitle = screen.getByText("Mes notes de frais")
      expect(contentTitle).toBeTruthy()
      const newBillBtn = screen.getByTestId("btn-new-bill")
      expect(newBillBtn).toBeTruthy()
    })
    
    /**
     * Tests d'intégration pour la gestion des erreurs API
     */
    describe('When an error occurs on API', () => {
      beforeEach(() => {
        jest.spyOn(mockStore, "bills")
        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee',
          email: "a@a"
        }))
        const root = document.createElement("div")
        root.setAttribute("id", "root")
        document.body.appendChild(root)
        router()
      })
      
      /**
       * Vérifie la gestion des erreurs 404
       */
      test("fetches bills from an API and fails with 404 message error", async () => {
        mockStore.bills.mockImplementationOnce(() => ({
          list : () => Promise.reject(new Error("Erreur 404"))
        }))
        
        window.onNavigate(ROUTES_PATH.Bills)
        await new Promise(process.nextTick);
        
        const message = await screen.getByText(/Erreur 404/)
        expect(message).toBeTruthy()
      })

      /**
       * Vérifie la gestion des erreurs 500
       */
      test("fetches bills from an API and fails with 500 message error", async () => {
        mockStore.bills.mockImplementationOnce(() => ({
          list : () => Promise.reject(new Error("Erreur 500"))
        }))
        
        window.onNavigate(ROUTES_PATH.Bills)
        await new Promise(process.nextTick);
        
        const message = await screen.getByText(/Erreur 500/)
        expect(message).toBeTruthy()
      })
    })
  })
})