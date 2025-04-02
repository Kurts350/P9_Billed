import { ROUTES_PATH } from '../constants/routes.js'
import Logout from "./Logout.js"

export default class NewBill {
  constructor({ document, onNavigate, store, localStorage }) {
    this.document = document
    this.onNavigate = onNavigate
    this.store = store
    const formNewBill = this.document.querySelector(`form[data-testid="form-new-bill"]`)
    formNewBill.addEventListener("submit", this.handleSubmit)
    const file = this.document.querySelector(`input[data-testid="file"]`)
    file.addEventListener("change", this.handleChangeFile)
    this.fileUrl = null
    this.fileName = null
    this.billId = null
    new Logout({ document, localStorage, onNavigate })
  }

  /**
 * Bug corrigé : Justificatifs non visibles dans la modale
 * 
 * Description du bug :
 * Lorsqu'un employé ou un administrateur cliquait sur l'icône "voir" pour consulter 
 * un justificatif, la modale s'ouvrait mais l'image n'apparaissait pas.
 * 
 * Cause du bug :
 * Deux problèmes principaux ont été identifiés :
 * 1. L'URL du fichier (fileUrl) était undefined car la réponse du backend 
 *    ne contenait pas cette propriété mais plutôt "filePath"
 * 2. Aucune validation n'était effectuée sur le type de fichier téléchargé
 * 
 * Solution :
 * 1. Construction de l'URL complète à partir du filePath retourné par le backend
 * 2. Ajout d'une validation des extensions de fichiers pour n'accepter que les formats 
 *    jpg, jpeg et png
 * 3. Ajout de logs pour faciliter le débogage
 */
  handleChangeFile = e => {
    e.preventDefault()
    const file = this.document.querySelector(`input[data-testid="file"]`).files[0]
    const filePath = e.target.value.split(/\\/g)
    const fileName = filePath[filePath.length-1]
  
    // Vérification de l'extension du fichier
    const fileExtension = fileName.split('.').pop().toLowerCase()
    const allowedExtensions = ['jpg', 'jpeg', 'png']
    
    if (!allowedExtensions.includes(fileExtension)) {
      // Afficher un message d'erreur
      alert("Seuls les fichiers jpg, jpeg et png sont acceptés")
      // Réinitialiser le champ de fichier
      this.document.querySelector(`input[data-testid="file"]`).value = ""
      return
    }
  
    const formData = new FormData()
    const email = JSON.parse(localStorage.getItem("user")).email
    formData.append('file', file)
    formData.append('email', email)
  
    this.store
      .bills()
      .create({
        data: formData,
        headers: {
          noContentType: true
        }
      })
      .then((response) => {
        console.log("Réponse complète du backend:", response)
        
        // Construire l'URL complète du fichier
        const baseUrl = "http://localhost:3000/"
        this.billId = response.key
        this.fileUrl = baseUrl + response.filePath
        this.fileName = fileName
        
        console.log("URL du fichier construite:", this.fileUrl)
      }).catch(error => console.error("Erreur lors de l'upload:", error))
  }
  handleSubmit = e => {
    e.preventDefault()
    console.log('e.target.querySelector(`input[data-testid="datepicker"]`).value', e.target.querySelector(`input[data-testid="datepicker"]`).value)
    const email = JSON.parse(localStorage.getItem("user")).email
    const bill = {
      email,
      type: e.target.querySelector(`select[data-testid="expense-type"]`).value,
      name:  e.target.querySelector(`input[data-testid="expense-name"]`).value,
      amount: parseInt(e.target.querySelector(`input[data-testid="amount"]`).value),
      date:  e.target.querySelector(`input[data-testid="datepicker"]`).value,
      vat: e.target.querySelector(`input[data-testid="vat"]`).value,
      pct: parseInt(e.target.querySelector(`input[data-testid="pct"]`).value) || 20,
      commentary: e.target.querySelector(`textarea[data-testid="commentary"]`).value,
      fileUrl: this.fileUrl,
      fileName: this.fileName,
      status: 'pending'
    }
    this.updateBill(bill)
    this.onNavigate(ROUTES_PATH['Bills'])
  }

  // not need to cover this function by tests
  updateBill = (bill) => {
    if (this.store) {
      this.store
      .bills()
      .update({data: JSON.stringify(bill), selector: this.billId})
      .then(() => {
        this.onNavigate(ROUTES_PATH['Bills'])
      })
      .catch(error => console.error(error))
    }
  }
}