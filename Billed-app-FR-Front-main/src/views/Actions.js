import eyeBlueIcon from "../assets/svg/eye_blue.js"
import downloadBlueIcon from "../assets/svg/download_blue.js"


/**
 * Bug corrigé : Justificatifs non visibles dans la modale
 * 
 * Description du bug :
 * Lorsqu'un utilisateur cliquait sur l'icône "voir", l'image du justificatif 
 * ne s'affichait pas dans la modale.
 * 
 * Cause du bug :
 * L'attribut data-bill-url n'était pas entouré de guillemets, ce qui pouvait causer 
 * des problèmes de syntaxe HTML si l'URL contenait des caractères spéciaux.
 * 
 * Solution :
 * Ajout de guillemets autour de l'URL dans l'attribut data-bill-url pour garantir 
 * que l'URL complète est correctement stockée dans l'attribut.
 */
export default (billUrl) => {
  return (
    `<div class="icon-actions">
      <div id="eye" data-testid="icon-eye" data-bill-url="${billUrl}">
      ${eyeBlueIcon}
      </div>
    </div>`
  )
}