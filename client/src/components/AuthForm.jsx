import { Link } from "react-router-dom";
import './AuthForm.css'

const AuthForm = () => {
    return (
        <>
            <form name="sing" action="/uploading" method="POST" className='sing-form'>
                <fieldset name="fieldset">
                        <legend>Register</legend>
                        <label htmlFor=""></label>
                        <input type="text" />
                        <label htmlFor=""></label>
                        <input type="password" />
                        <label htmlFor=""></label>
                        <input type="password" />
                        <button>Upload</button>
                    <Link to='/login'>I have an account.</Link>
                </fieldset>
            </form>
        </>
    );
}

export default AuthForm;