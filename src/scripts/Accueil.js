/**
 * @file Accueil.js
 */

import Logo from '../images/Logo.png';
import '../stylesheets/Accueil.scss';
import '../stylesheets/styles.scss';
import { createRoot } from 'react-dom/client';
import root from '../index.js';
import fournisseurApi from '../fournisseur.json';
import React from 'react';
import logoEDF from "../images/logoCompany/EDF_logo.png";
import logoEngie from "../images/logoCompany/Engie_logo.png";
import logoENI from "../images/logoCompany/ENI_logo.png";
import logoTotal from "../images/logoCompany/Total_logo.png";

/**
 * Class to create the main page that inherits from React.Component
 */
class Accueil extends React.Component {
  /**
   * Create the page
   * @param {*} props A parameter that inherits from React.Component
   */
  constructor(props){
    super(props)
    this.state = {
      idType: "gas",
      numPage: 1,
      TypeClient: [],
      TypeClientSelectionner: "",
      filtresSelectionner: [],
      volumeConsoElec: 6,
      volumeConsoGazSelectionner: []
    }
  }
  /**
   * This function takes the energy type id to get a filter array
   * 
   * @param {int} idType The energy type id 
   * @returns {array} The filter array
   */
  ListeFiltre(idType){
    var filtre = [];
    for(let i = 0;i<fournisseurApi.length;i++)
      for(let j = 0;j<fournisseurApi[i].offers.length;j++)
        if(fournisseurApi[i].offers[j].energy_type ==  idType){
          for(let k = 0;k<fournisseurApi[i].offers[j].filters.length;k++)
            if(!filtre.includes(fournisseurApi[i].offers[j].filters[k]))
              filtre.push(fournisseurApi[i].offers[j].filters[k])
          if(!this.state.TypeClient.includes(fournisseurApi[i].offers[j].client_type))
            this.state.TypeClient.push(fournisseurApi[i].offers[j].client_type)
        }
    return(filtre)
  }
  /**
   * 
   * @param {double} volumeConso Value of the electricity consumption in kVA
   * @param {double} prixOffre Value of the price of the offer per kVA
   * @description This function calculate the price of an electricity offer for one year
   * @returns {double} Price over one year 
   */
  calculPrixElec(volumeConso,prixOffre){
    var prix = 0
    if(volumeConso == 6)
      prix = 2267 * prixOffre
    else if(volumeConso == 9)
      prix = 3649 * prixOffre
    else if(volumeConso == 12)
      prix = 5911 * prixOffre
    else if(volumeConso == 15)
      prix = 6973 * prixOffre
    else if(volumeConso == 18)
      prix = 10574 * prixOffre
    else if(volumeConso == 24)
      prix = 16315 * prixOffre
    else if(volumeConso == 30)
      prix = 18570 * prixOffre
    else if(volumeConso == 36)
      prix = 21894 * prixOffre
    return prix
  }
  /**
   * 
   * @param {double} valeurConsoGaz Value of the gas consumption in kWh
   * @param {double} prixOffre Value of the price of the offer per kWh
   * @returns {double} Price over one year
   * @description This function calculate the price of a gas offer for one year
   */
  calculPrixGaz(valeurConsoGaz,prixOffre){
    return (prixOffre*valeurConsoGaz)
  }
  /**
   * 
   * @param {int} idType The energy type id 
   * @param {string} TypeClientSelectionner The client type (pro/particular)
   * @description Get every offers that respect the given filters with the coresponding price.
   * @returns {array} A list of every offers
   */
  ListeFournisseurFiltrer(idType,TypeClientSelectionner){
    if(this.state.idType == "gas" || this.state.idType == "dual"){
      var valeurConsoGaz = 0
      for(let i = 0;i<this.state.volumeConsoGazSelectionner.length;i++)
        valeurConsoGaz = valeurConsoGaz + this.state.volumeConsoGazSelectionner[i]
      
      var categorieGas;
      if(valeurConsoGaz >= 0 && valeurConsoGaz <= 1000)
        categorieGas = "0-1000"
      else if(valeurConsoGaz >= 1001 && valeurConsoGaz <= 6000)
        categorieGas = "1001-6000"
      else if(valeurConsoGaz >= 6001 && valeurConsoGaz <= 30000)
        categorieGas = "6001-30000"
      else
        categorieGas = "30001-300000"

      console.log("Le gaz est " + valeurConsoGaz)
    }

    var fournisseurFiltrer = [];
    for(let i = 0;i<fournisseurApi.length;i++)
      for(let j = 0;j<fournisseurApi[i].offers.length;j++){

        var modelFournisseur = {
          entreprise: fournisseurApi[i].company,
          nomOffre: fournisseurApi[i].offers[j].name,
          isActive: fournisseurApi[i].offers[j].is_active,
          subPrix: undefined,
          prix: undefined,
          filtres:fournisseurApi[i].offers[j].filters,
        }

        if(fournisseurApi[i].offers[j].energy_type ==  idType && (TypeClientSelectionner == "" ? true : fournisseurApi[i].offers[j].client_type ==  TypeClientSelectionner)){
          var verifFiltre = false
          if(this.state.filtresSelectionner.length != 0){
            var toutFiltresPresent = true
            for(let k = 0;k<this.state.filtresSelectionner.length;k++){
              if(!fournisseurApi[i].offers[j].filters.includes(this.state.filtresSelectionner[k])){
                toutFiltresPresent = false
              }  
            }
            if(toutFiltresPresent){
              verifFiltre = true
            }
          }else{
            verifFiltre = true
          }
          for(let l = 0;l<fournisseurApi[i].offers[j].prices.length;l++){
            if(this.state.idType == "electricity"){
              if(fournisseurApi[i].offers[j].prices[l].power == this.state.volumeConsoElec){
                modelFournisseur.subPrix = fournisseurApi[i].offers[j].prices[l].subscription_price
                modelFournisseur.prix = this.calculPrixElec(this.state.volumeConsoElec, fournisseurApi[i].offers[j].prices[l].price)
              }
            }else if(this.state.idType == "gas"){
              if(fournisseurApi[i].offers[j].prices[l].consumption_class == categorieGas || fournisseurApi[i].offers[j].prices[l].consumption_class ==  "Unknown"){
                modelFournisseur.subPrix = fournisseurApi[i].offers[j].prices[l].subscription_price
                modelFournisseur.prix = this.calculPrixGaz(valeurConsoGaz, fournisseurApi[i].offers[j].prices[l].price)
              }
            }else{
              if(fournisseurApi[i].offers[j].prices[l].power == this.state.volumeConsoElec){
                modelFournisseur.subPrix = fournisseurApi[i].offers[j].prices[l].subscription_price
                modelFournisseur.prix = this.calculPrixElec(this.state.volumeConsoElec, fournisseurApi[i].offers[j].prices[l].price)
              }
              if(fournisseurApi[i].offers[j].prices[l].consumption_class == categorieGas || fournisseurApi[i].offers[j].prices[l].consumption_class ==  "Unknown"){
                modelFournisseur.subPrix = modelFournisseur.subPrix + fournisseurApi[i].offers[j].prices[l].subscription_price
                modelFournisseur.prix = modelFournisseur.prix + this.calculPrixGaz(valeurConsoGaz, fournisseurApi[i].offers[j].prices[l].price)
              }
            }  
          }
          if(verifFiltre)
            fournisseurFiltrer.push(modelFournisseur)
        }
      }
    return(fournisseurFiltrer)
  }
  /**
   * 
   * @returns {div} The div containing the choose of energy type
   * @description This function implements the div in which you can choose your energy type 
   */
  PageTypeClass() { 
    return (
      <div className="Element-container-PageTypeClass">
                <div className="option-Gaz" value="Gaz">
                    <input className="btn-Gaz" type="radio" defaultChecked name="typeF" id="Gaz" value="GAZ" onInput={
                      ()=>{
                        this.state.idType="gas"
                      }
                    }/>
                    <label className="label-btn-Gaz" htmlFor="Gaz"></label>
                    <h5>Gaz</h5>
                </div>
                <div className="option-Elec" value="Elec">
                    <input className="btn-Elec" type="radio" name="typeF" id="Elec" value="ELECTRICITE" onInput={
                      ()=>{
                        this.state.idType="electricity"
                      }
                    }/>
                    <label className="label-btn-Elec" htmlFor="Elec"></label>
                    <h5>Électricité</h5>
                </div>
                <div className="option-Gaz-Elec" value="GazElec">
                    <input className="btn-Gaz-Elec" type="radio" name="typeF" id="Gaz-Elec" value="DUAL" onInput={
                      ()=>{
                        this.state.idType="dual"
                      }
                    }/>
                    <label className="label-btn-Gaz-Elec" htmlFor="Gaz-Elec"></label>
                    <h5>Gaz et Électricité</h5>
                </div>
            </div>
    );
  } 
  /**
   * 
   * @param {int} idType The energy type of the offer
   * @returns {div} The div containing all the choices for the filters
   * @description This functions returns the div used for choosing the filters and your electricity meter value/ type of gas consommation depending on idType
   */
  PageFiltre(idType) {
    this.state.filtresSelectionner = []
    this.state.TypeClientSelectionner = ""
    var filtres = this.ListeFiltre(idType)
    filtres.sort();
    const listItemsFiltres = filtres.map((filtre) =>
      <div key={filtre} className='itemListeFiltres'>
        <input id={filtre} className="btn-Filtres" type="checkbox" name={filtre} value={filtre} onClick={
          ()=>{
            if(this.state.filtresSelectionner.includes(filtre))
              this.state.filtresSelectionner.slice(filtre)
            else
              this.state.filtresSelectionner.push(filtre)
          }
        }/>
        <label className="label-btn-Filtres" htmlFor={filtre}>{filtre}</label>
      </div>
    )

    var filtreElec = 
    <div className='filtreSelonType'>
        <h2>Quelle est la puissance de votre compteur ?</h2>
        <div className='listItemsConso'>
            <select id='volumeElec'>
              <option value="6">6 kVA</option>
              <option value="9">9 kVA</option>
              <option value="12">12 kVA</option>
              <option value="15">15 kVA</option>
              <option value="18">18 kVA</option>
              <option value="24">24 kVA</option>
              <option value="30">30 kVA</option>
              <option value="36">36 kVA</option>
            </select>
        </div>
      </div>

    var filtreGaz = 
    <div className='filtreSelonType'>
        <h2>Quel type de consommation de gaz utilisé-vous ?</h2>
        <div key="Cuisine" className='itemListeFiltresGaz'>
          <input id="Cuisine" className="btn-Filtres" type="checkbox" name="Cuisine" value="Cuisine" onClick={
            ()=>{
              if(this.state.volumeConsoGazSelectionner.includes(660))
                this.state.volumeConsoGazSelectionner.splice(this.state.volumeConsoGazSelectionner.indexOf(660),1)
              else
                this.state.volumeConsoGazSelectionner.push(660)
            }
          }/>
          <label className="label-btn-Filtres" htmlFor="Cuisine">Cuisine ≈ 660kWh</label>
          <input id="EauChaude" className="btn-Filtres" type="checkbox" name="EauChaude" value="EauChaude" onClick={
            ()=>{
              if(this.state.volumeConsoGazSelectionner.includes(3100))
                this.state.volumeConsoGazSelectionner.splice(this.state.volumeConsoGazSelectionner.indexOf(3100),1)
              else
                this.state.volumeConsoGazSelectionner.push(3100)
            }
          }/>
          <label className="label-btn-Filtres" htmlFor="EauChaude">Eau Chaude ≈ 3100kWh</label>
          <input id="Chauffage-200" className="btn-Filtres" type="checkbox" name="Chauffage-200" value="Chauffage-200" onClick={
            ()=>{
              if(this.state.volumeConsoGazSelectionner.includes(17000))
                this.state.volumeConsoGazSelectionner.splice(this.state.volumeConsoGazSelectionner.indexOf(17000),1)
              else
                this.state.volumeConsoGazSelectionner.push(17000)
            }
          }/>
          <label className="label-btn-Filtres" htmlFor="Chauffage-200">Chauffage -200m² ≈ 17000kWh</label>
          <input id="Chauffage+200" className="btn-Filtres" type="checkbox" name="Chauffage+200" value="Chauffage+200" onClick={
            ()=>{
              if(this.state.volumeConsoGazSelectionner.includes(64300))
                this.state.volumeConsoGazSelectionner.splice(this.state.volumeConsoGazSelectionner.indexOf(64300),1)
              else
                this.state.volumeConsoGazSelectionner.push(64300)
            }
          }/>
          <label className="label-btn-Filtres" htmlFor="Chauffage+200">Chauffage +200m² ≈ 64300kWh</label>
        </div>
      </div>

    var filtreType
    if(this.state.idType == "electricity")
      filtreType = filtreElec
    else if(this.state.idType == "gas")
      filtreType = filtreGaz
    else
      filtreType = <div>
        {filtreElec}
        {filtreGaz}
      </div>

    return (
      <div className='Element-container-PageFiltre'>
        <h2>Recherchez-vous des fournisseurs pour un :</h2>
        <div className='listItemsClientsType'>
          <div key="LesDeux" className='itemListeclients'>
            <input className="btn-clients" type="radio" name="typeClient" defaultChecked id="LesDeux" value="LesDeux" onInput={
                          ()=>{
                            this.state.TypeClientSelectionner= "";
                          }
                        }/>
            <label className="label-btn-clients" htmlFor="LesDeux">Les deux</label>
          </div>
          <div key="Particulier" className='itemListeclients'>
            <input className="btn-clients" type="radio" name="typeClient" id="Particulier" value="Particulier" onInput={
                          ()=>{
                            this.state.TypeClientSelectionner="Particulier"
                          }
                        }/>
            <label className="label-btn-clients" htmlFor="Particulier">Particulier</label>
          </div>
          <div key="Professionnel" className='itemListeclients'>
            <input className="btn-clients" type="radio" name="typeClient" id="Professionnel" value="Professionnel" onInput={
                          ()=>{
                            this.state.TypeClientSelectionner="Professionnel"
                          }
                        }/>
            <label className="label-btn-clients" htmlFor="Professionnel">Professionnel</label>
          </div>
        </div>
        <h2>Sélectionnez les filtres recherchés.</h2>
        <div className='listItemsFiltres'>
          {listItemsFiltres}
        </div>
        <div className='listItemsFiltres'>
          {filtreType}
        </div>
      </div>
    );
  }
  /**
   * 
   * @returns {div} The div containing the classement
   * @description This function returns the div containing the offers 
   */
  PageClassement() {
    const informationFournisseur = {
      EDF: {
        logo: logoEDF,
        lien: "https://www.edf.fr/"
      },
      Engie: {
        logo: logoEngie,
        lien: "https://www.engie.com/"
      },
      Eni: {
        logo: logoENI,
        lien: "https://fr.eni.com"
      },
      TotalEnergies: {
        logo: logoTotal,
        lien: "https://www.totalenergies.fr/"
      }
    }

    const fournisseurs = this.ListeFournisseurFiltrer(this.state.idType,this.state.TypeClientSelectionner)
    fournisseurs.sort(function (a, b) {
      return (a.prix+a.subPrix) - (b.prix+b.subPrix);
    });
    
    var fournisseursInactif = []
    var copieFournisseurs = fournisseurs

    for(let i = 0;i<fournisseurs.length;i++){
      if(!copieFournisseurs[i].isActive){
        var temp = fournisseurs[0]
        fournisseurs.shift()
        fournisseursInactif.push(temp)
      }
    }

    var listFournisseurs;
    if(fournisseurs.length != 0 ){
      listFournisseurs = fournisseurs.map((fournisseur) => 
      <div className='fournisseur'>
      <div className='headerFournisseur'>
        <img className='logoEntreprise' src={informationFournisseur[fournisseur.entreprise].logo} alt="Logo" />
        <p>{(fournisseur.prix + fournisseur.subPrix).toFixed(2)}€/An</p>
        <a href={informationFournisseur[fournisseur.entreprise].lien} target="_blank">Voir le site</a>
      </div>
      <div className='contentFournisseur'>
        <div className='nameFournisseur'>
          <h3>{fournisseur.nomOffre}</h3>
        </div> 
        <div className='prixFournisseur'>
          <p><strong>Prix mensuel:</strong> {(fournisseur.prix/12).toFixed(2)}€/mois</p>
          <p><strong>Abonnement: </strong>{ fournisseur.subPrix == null ? 0  : (fournisseur.subPrix).toFixed(2)}€</p>
        </div>
        <div className='footerFournisseur'>
          {fournisseur.filtres.map( filtre =>
            <div className='divFiltre'>{filtre}</div>
          )}
        </div>
      </div>
    </div>
      )
    }else{
      listFournisseurs = <p>Il semblerait qu'aucun fournisseur d'énergie ne propose d'offre pour vos critères !</p>
    }
    
    return (
      <div className='Element-container-PageClassement'>
        {listFournisseurs}
      </div>
    );
  }
  /**
   * 
   * @returns {div} Div containing the whole page 
   * @description This functions implements all the divs necessary for the main page 
   */
  render() { 
    return (
      <div className="container-Accueil">
        <div className ="Upper-Bar"> 
            <div className="Upper-Bar-Button">
              <button onClick={
                  function (){
                    import('../scripts/LogIn.js').then(LogIn => {
                      root.render(<LogIn.default />);
                    });
                  }
                }
                className="btn-Login" type = 'button'>Se connecter</button>
              <button onClick={
                function (){
                  import('./Register.js').then(Register => {
                    root.render(<Register.default />);
                  });
                }
              }
            className="btn-Register" type = 'button'>Créer un compte</button>
          </div>
          <img src= {Logo} alt="Logo" className="img-Logo" />
        </div>
        <div className ="Middle-Bar">
              <div className='Presentation'>
                <h2>Qui sommes-nous ?</h2>
                <p className='description'>HUSKY est une entreprise spécialisée dans le comparateur de fournisseurs d'énergie. L'entreprise a pour mission de permettre aux consommateurs de trouver le meilleur fournisseur d'énergie en fonction de leurs besoins et de leur budget. Pour cela, HUSKY compare les tarifs et les offres de différents fournisseurs d'énergie afin de proposer aux utilisateurs les options les plus avantageuses. En utilisant les outils et les services de HUSKY, les consommateurs peuvent non seulement économiser de l'argent sur leur facture d'énergie, mais aussi contribuer à la transition énergétique en optant pour des sources d'énergie renouvelables.</p>
              </div>
        </div>
        <div className="Lower-Bar">
            <div id="Element-container"> 
              {this.PageTypeClass()}
            </div>
            <div className='Carrousel'>
              <button id="boutonPrecedent" onClick={
                    ()=>{
                        const buttonPrecedent = document.getElementById("boutonPrecedent");
                        const buttonSuivant = document.getElementById("boutonSuivant");
                        const ItemCarouselPage1 = document.getElementById("ItemCarouselPage1");
                        const ItemCarouselPage2 = document.getElementById("ItemCarouselPage2");
                        const ItemCarouselPage3 = document.getElementById("ItemCarouselPage3");
                        buttonSuivant.classList.remove('boutonSupprimer')
                        if(this.state.numPage!=1){
                          buttonPrecedent.classList.remove('boutonSupprimer')
                          this.state.numPage--
                          const rootElement = document.getElementById("Element-container");
                          const rootContainer = createRoot(rootElement);
                          if(this.state.numPage==2){
                            this.state.volumeConsoGazSelectionner = []
                            ItemCarouselPage3.classList.remove('pageActive')
                            ItemCarouselPage2.classList.add('pageActive')
                            rootContainer.render(this.PageFiltre(this.state.idType))
                          }
                          else if(this.state.numPage==1){
                            ItemCarouselPage2.classList.remove('pageActive')
                            ItemCarouselPage1.classList.add('pageActive')
                            buttonPrecedent.classList.add('boutonSupprimer')
                            this.state.idType="gas"
                            rootContainer.render(this.PageTypeClass())
                          }
                        }
                    }
                  }
                className="btn-Next boutonSupprimer" type = 'button'>Précédent</button>
              <div id="ItemCarouselPage1" className='ItemCarousel pageActive'></div>
              <div id="ItemCarouselPage2" className='ItemCarousel'></div>
              <div id="ItemCarouselPage3" className='ItemCarousel'></div>
              <button id="boutonSuivant" onClick={
                    () =>{
                        const buttonPrecedent = document.getElementById("boutonPrecedent");
                        const buttonSuivant = document.getElementById("boutonSuivant");
                        const ItemCarouselPage1 = document.getElementById("ItemCarouselPage1");
                        const ItemCarouselPage2 = document.getElementById("ItemCarouselPage2");
                        const ItemCarouselPage3 = document.getElementById("ItemCarouselPage3");
                        buttonPrecedent.classList.remove('boutonSupprimer')
                        if(this.state.numPage!=3){
                          this.state.numPage++
                          const rootElement = document.getElementById("Element-container");
                          const rootContainer = createRoot(rootElement);
                          if(this.state.numPage==2){
                            ItemCarouselPage1.classList.remove('pageActive')
                            ItemCarouselPage2.classList.add('pageActive')
                            rootContainer.render(this.PageFiltre(this.state.idType))
                          }else if(this.state.numPage==3){
                            ItemCarouselPage2.classList.remove('pageActive')
                            ItemCarouselPage3.classList.add('pageActive')
                            buttonSuivant.classList.add('boutonSupprimer')
                            if(this.state.idType == "electricity" || this.state.idType == "dual")
                              this.state.volumeConsoElec = document.getElementById("volumeElec").value
                            rootContainer.render(this.PageClassement())
                          }
                        }
                    }
                  }
                className="btn-Next" type = 'button'>Suivant</button>
            </div>
        </div>
      </div>
    );
  }
}

export default Accueil;