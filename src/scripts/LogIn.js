/**
 * @file LogIn.js
 */

import Logo from '../images/Logo.png'
import root from '../index.js';
import '../stylesheets/LogIn.scss'
import Accueil from './Accueil.js';


/**
 * 
 * @description Display an error message if the user's mail or password is wrong
 * @returns {void} Error
 */
function showError() {
    let container = document.querySelector('.error-container');
    container.innerHTML = "";
    let error = document.createElement('p');
    error.className = "error";
    error.innerHTML = "Wrong email or password";
    container.appendChild(error);
    error.style.display = "block";
    error.style.backgroundColor = "rgba(212, 68, 68,0.9)";
    error.style.fontSize = "1.5rem";
    error.style.borderRadius = "5px";
}
/**
 * 
 * @returns {JSX.Element} The LogIn page
 * @description This function creates the div containing all the information needed to log in
 */
function LogIn() {
        return (
            <div className="body-LogIn">
                <div className="container">
                    <button onClick={
                        function (){
                            import('./Accueil.js').then(Accueil => {
                                root.render(<Accueil.default />);
                            });
                        }
                    } className="btn-Back" type = 'button'>Retour</button>
                    <img src={Logo} alt = "Logo" className="img-Logo"/>
                    <h3 className = "fadded-Text">Se connecter</h3>
                    <div className='error-container'></div>
                    <form>
                        <div className="form-group">
                            <div className="input-email">
                                <input type="email" className="field-email" id="email" placeholder="Email"/>
                            </div>
                            <div className="input-password">
                                <input type="password" className="field-password" id="password" placeholder="Mot de passe"/>
                            </div>
                            <div className="input-checkbox">
                                <input type="checkbox" className="field-checkbox" id="checkbox"/>
                                <label htmlFor="checkbox">Se souvenir de moi</label>
                                <a className="forgot-password">Mot de passe oublié ?</a>
                            </div> 



                            <button onClick={
                                async function (){
                                    let email = document.querySelector('.field-email').value;
                                    let password = document.querySelector('.field-password').value;
                                    let response = await fetch('http://localhost:3001/login', {
                                        method: 'POST',
                                       
                                        body: JSON.stringify({
                                            email: email,
                                            password: password
                                        }),
                                        headers: {
                                            'Content-Type': 'application/json'
                                        }
                                    });
                                    let data = await response.json();
                                    console.log(data);
                                    if(data === false){
                                        showError();
                                    }
                                    else{
                                        import('./Accueil.js').then(Accueil => {
                                            root.render(<Accueil.default />);
                                        });
                                    }
                                       
                                }
                            } type='button' className="btn-submit-LogIn">Se connecter</button>


                            <p className = "noPassword">Pas encore membre ? <a onClick={
                                function (){
                                import('./Register.js').then(Register => {
                                    root.render(<Register.default />);
                                });
                                }
                            } className="register">Créer un compte</a></p>
                        </div>
                    </form>
                </div>
            </div>
                 
        );
}
export default LogIn;


