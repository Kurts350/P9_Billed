/**
 * @jest-environment jsdom
 */

import { screen, fireEvent } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES_PATH } from "../constants/routes.js"
import { localStorageMock } from "../__mocks__/localStorage.js"
import mockStore from "../__mocks__/store"

// Mock du store pour isoler les tests des appels API réels
jest.mock("../app/store", () => mockStore)

/**
 * Tests de la page NewBill (création de notes de frais)
 */
describe("Given I am connected as an employee", () => {
  // Configuration du localStorage avant chaque test
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    window.localStorage.setItem('user', JSON.stringify({
      type: 'Employee',
      email: 'employee@test.com'
    }))
  })
  
  describe("When I am on NewBill Page", () => {
    /**
     * Vérifie la présence du formulaire et des éléments essentiels
     */
    test("Then the form should be visible", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      
      expect(screen.getByTestId("form-new-bill")).toBeTruthy()
      expect(screen.getByTestId("file")).toBeTruthy()
    })

    /**
     * Tests de la fonctionnalité d'upload de fichier
     */
    describe("When I upload a file with correct extension", () => {
      /**
       * Vérifie l'acceptation des fichiers avec extension valide
       */
      test("Then the file should be accepted", () => {
        document.body.innerHTML = NewBillUI()
        
        const onNavigate = jest.fn()
        
        const newBill = new NewBill({
          document,
          onNavigate,
          store: mockStore,
          localStorage: window.localStorage
        })
        
        // Mock de la méthode bills().create
        const createBill = jest.fn().mockResolvedValue({ fileUrl: 'http://localhost:3000/images/test.jpg', key: '1234' })
        newBill.store.bills = () => ({ create: createBill })
        
        // Simulation de l'upload de fichier
        const handleChangeFile = jest.fn(() => newBill.handleChangeFile)
        const inputFile = screen.getByTestId("file")
        
        // Copie de la méthode originale pour éviter l'erreur
        inputFile.addEventListener("change", handleChangeFile)
        
        // Simulation de la valeur et des fichiers
        Object.defineProperty(inputFile, 'value', {
          value: 'C:\\fakepath\\test.jpg',
          writable: true
        })
        
        Object.defineProperty(inputFile, 'files', {
          value: [new File(['file content'], 'test.jpg', { type: 'image/jpeg' })],
          writable: true
        })
        
        // Appel direct à la méthode pour éviter les problèmes avec fireEvent
        newBill.handleChangeFile({
          preventDefault: () => {},
          target: inputFile
        })
        
        // Vérification
        expect(createBill).toHaveBeenCalled()
      })
    })

    /**
     * Tests de validation des extensions de fichier
     */
    describe("When I upload a file with incorrect extension", () => {
      /**
       * Vérifie le rejet des fichiers avec extension invalide
       */
      test("Then an error should appear", () => {
        document.body.innerHTML = NewBillUI()
        
        const newBill = new NewBill({
          document,
          onNavigate: jest.fn(),
          store: mockStore,
          localStorage: window.localStorage
        })
        
        // Mock de l'alerte
        global.alert = jest.fn()
        
        const inputFile = screen.getByTestId("file")
        
        // Simulation d'un fichier PDF (format non accepté)
        Object.defineProperty(inputFile, 'value', {
          value: 'C:\\fakepath\\document.pdf',
          writable: true
        })
        
        // Appel direct à la méthode
        newBill.handleChangeFile({
          preventDefault: () => {},
          target: inputFile
        })
        
        // Vérification
        expect(global.alert).toHaveBeenCalled()
      })
    })

    /**
     * Tests de soumission du formulaire
     */
    describe("When I submit the form with complete data", () => {
      /**
       * Vérifie la création de note de frais et la redirection
       */
      test("Then the bill should be created and I should be redirected", () => {
        document.body.innerHTML = NewBillUI()
        
        const onNavigate = jest.fn()
        
        const newBill = new NewBill({
          document,
          onNavigate,
          store: mockStore,
          localStorage: window.localStorage
        })
        
        // Configuration préalable de l'URL et du nom de fichier
        newBill.fileUrl = 'http://localhost:3000/images/test.jpg'
        newBill.fileName = 'test.jpg'
        
        // Mock de la méthode bills().update
        const updateBill = jest.fn().mockResolvedValue({})
        newBill.store.bills = () => ({ update: updateBill })
        
        // Simulation de la soumission du formulaire
        const form = screen.getByTestId('form-new-bill')
        
        // Appel direct à la méthode handleSubmit
        const handleSubmit = jest.spyOn(newBill, 'handleSubmit')
        
        // Déclencher l'événement submit
        form.addEventListener('submit', newBill.handleSubmit)
        fireEvent.submit(form)
        
        // Vérification
        expect(handleSubmit).toHaveBeenCalled()
        expect(onNavigate).toHaveBeenCalledWith(ROUTES_PATH['Bills'])
      })
    })

    /**
     * Tests d'intégration avec l'API
     */
    describe("When I submit a new bill via the API", () => {
      /**
       * Vérifie l'intégration avec l'API pour la création de note de frais
       */
      test("Then the bill should be created", async () => {
        const updateBill = jest.fn().mockResolvedValue({})
        mockStore.bills = () => ({ update: updateBill })
        
        document.body.innerHTML = NewBillUI()
        
        const newBill = new NewBill({
          document,
          onNavigate: jest.fn(),
          store: mockStore,
          localStorage: window.localStorage
        })
        
        // Configuration d'une note de frais complète pour le test
        const bill = {
          email: 'employee@test.com',
          type: 'Transports',
          name: 'Test',
          amount: 100,
          date: '2023-01-01',
          vat: '20',
          pct: 10,
          commentary: 'Test',
          fileUrl: 'http://localhost:3000/images/test.jpg',
          fileName: 'test.jpg',
          status: 'pending'
        }
        
        await newBill.updateBill(bill)
        
        expect(updateBill).toHaveBeenCalled()
      })
    })
  })
})