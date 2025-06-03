import { Link } from "react-router-dom";
import './AuthForm.css'
import { useState } from "react";
import { useDispatch } from "react-redux";
import { post } from "../shared/utils/api";

const AuthForm = (props) => {
    const dispatch = useDispatch();
    const [textFields, setTextFields] = useState({
        username: '',
        password: '',
        repeatPassword: ''
    });

    const [errormsg, setErrormsg] = useState('');

    const changeHandler = (e) => {
        setErrormsg('');

        setTextFields({ ...textFields, [e.target.name]: e.target.value });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        setErrormsg('');
        
        if (textFields.username.length < 3) {
            setErrormsg('User name is to short');
            return;
        } else if (textFields.password.length < 4) {
            setErrormsg('User password is to short');
            return;
        }

        const response = await post(props.action, textFields);


        if (!response.status || response.status !== 200) {
            setErrormsg(response);
            return;
        }

        dispatch({ type: 'login', username: textFields.username, userid: response.data._id });
    }

    return (
        <>
            <form onSubmit={submitHandler} className='sing-form'>
                <fieldset name="fieldset">
                    <legend>{props.fieldset}</legend>
                    <span>or <Link to={props.spanLink}>{props.span}</Link></span>
                    <div className="input-wrapper">
                        <input
                            type="text"
                            name="username"
                            value={textFields.username}
                            onChange={changeHandler}
                            placeholder="Username"
                            required
                        />
                    </div>
                    <div className="input-wrapper">
                        <input
                            type="password"
                            name="password"
                            value={textFields.password}
                            onChange={changeHandler}
                            placeholder="Password"
                            autoComplete="off"
                            required
                        />
                    </div>
                    {props.action === '/user/singup' && <div className="input-wrapper">
                        <input
                            type="password"
                            name="repeatPassword"
                            value={textFields.repeatPassword}
                            onChange={changeHandler}
                            placeholder="Repeat Password"
                            autoComplete="off"
                            required
                        />
                    </div>}
                    <div className={errormsg.length > 0 ? "error-sing-form-active" : "error-sing-form-inactive"}>
                        <i className="fa-solid fa-circle-exclamation"></i>
                        <div>{errormsg}</div>
                    </div>
                    <button className="auth-form-button" type="submit">{props.buttontext}</button>
                </fieldset>
            </form>
        </>
    );
}

export default AuthForm;