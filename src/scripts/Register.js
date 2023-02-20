/**
 * @file Register.js
 */

import root from '../index.js';
import Logo from '../images/Logo.png';
import '../stylesheets/Register.scss';

/**
 * @returns {JSX.Element} The register page
 * @description This function creates a div containing all the informations needed to create an account
 * @function Register
 */
function Register() {
    return(
        <div className="body-Register">
            <div className="container">
            <button onClick={
                    function (){
                        import('./Accueil.js').then(Accueil => {
                            root.render(<Accueil.default />);
                        });
                    }
                }className="btn-Back" type = 'button'>Retour</button>
            <img src={Logo} alt = "Logo" className="img-Logo"/>
            <h3 className = "fadded-Text">Créer mon compte</h3>
            <form>
                <div className="form-group">
                    <div className="input-email">
                        <input type="email" className="field-email" id="email" placeholder="Email"/>
                    </div>
                    <div className="input-password">
                        <input type="password" className="field-password" id="password" placeholder="Mot de passe"/>
                    </div>
                    <div className="input-password">
                        <input type="password" className="field-password-confirm" id="password" placeholder="Confirmer mot de passe"/>
                    </div>
                    <div className="input-checkbox">
                        <input type="checkbox" className="field-checkbox" id="checkbox"/>
                        <label >Se souvenir de moi</label>
                        <a href="#" className="forgot-password">Mot de passe oublié ?</a>
                    </div>
                    <button onClick= {
                        function (){
                            let password = document.querySelector('.field-password').value;
                            let passwordConfirm = document.querySelector('.field-password-confirm').value;
                            if (password === passwordConfirm){

                                fetch('http://localhost:3001/addClient', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        email: document.getElementById('email').value,
                                        password: password,
                                    })
                                }).then(response => response.json())
                                .then(data => {
                                    console.log('Success:', data);
                                }
                                ).catch((error) => {
                                    console.error('Error:', error);
                                });
                            }
                            
                        }
                    } type="button" className="btn-submit-LogIn">Créer mon compte</button>
                    <p className = "noPassword">Déjà membre ? <a href="#" className="LogIn">S'identifier</a></p>
                </div>
            </form>
        </div>
        </div>
    )
}

export default Register;