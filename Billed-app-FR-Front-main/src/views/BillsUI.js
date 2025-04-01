import VerticalLayout from './VerticalLayout.js'
import ErrorPage from "./ErrorPage.js"
import LoadingPage from "./LoadingPage.js"

import Actions from './Actions.js'

const row = (bill) => {
  return (`
    <tr>
      <td>${bill.type}</td>
      <td>${bill.name}</td>
      <td>${bill.date}</td>
      <td>${bill.amount} €</td>
      <td>${bill.status}</td>
      <td>
        ${Actions(bill.fileUrl)}
      </td>
    </tr>
    `)
  }

const rows = (data) => {
  return (data && data.length) ? data.map(bill => row(bill)).join("") : ""
}

export default ({ data: bills, loading, error }) => {
  /**
 * Bug corrigé : Tri des notes de frais par ordre décroissant de date
 * 
 * Description du bug :
 * Les notes de frais n'étaient pas triées par ordre décroissant de date (du plus récent au moins récent) 
 * dans l'interface utilisateur, ce qui faisait échouer le test "bills should be ordered from earliest to latest".
 * 
 * Cause du bug :
 * Dans le fichier BillsUI.js, les notes de frais étaient affichées dans l'ordre où elles étaient reçues,
 * sans tri préalable. Le test attend que les factures soient triées par date décroissante.
 * 
 * Solution :
 * Ajout d'une étape de tri des factures avant leur affichage dans la fonction BillsUI.
 * Les factures sont maintenant triées en utilisant une comparaison de chaînes pour respecter
 * la logique de tri utilisée dans le test (fonction antiChrono).
 * 
 * billsSorted = [...bills].sort((a, b) => a.date < b.date ? 1 : -1)
 * 
 * Cette modification assure que les notes de frais sont toujours affichées 
 * de la plus récente à la plus ancienne, comme attendu par les utilisateurs.
 */
  const billsSorted = bills && bills.length ? [...bills].sort((a, b) => {
    return a.date < b.date ? 1 : -1;
  }) : [];
  
  
  const modal = () => (`
    <div class="modal fade" id="modaleFile" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">Justificatif</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
          </div>
        </div>
      </div>
    </div>
  `)

  if (loading) {
    return LoadingPage()
  } else if (error) {
    return ErrorPage(error)
  }
  
  return (`
    <div class='layout'>
      ${VerticalLayout(120)}
      <div class='content'>
        <div class='content-header'>
          <div class='content-title'> Mes notes de frais </div>
          <button type="button" data-testid='btn-new-bill' class="btn btn-primary">Nouvelle note de frais</button>
        </div>
        <div id="data-table">
        <table id="example" class="table table-striped" style="width:100%">
          <thead>
              <tr>
                <th>Type</th>
                <th>Nom</th>
                <th>Date</th>
                <th>Montant</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
          </thead>
          <tbody data-testid="tbody">
            ${rows(billsSorted)}
          </tbody>
          </table>
        </div>
      </div>
      ${modal()}
    </div>`
  )
}