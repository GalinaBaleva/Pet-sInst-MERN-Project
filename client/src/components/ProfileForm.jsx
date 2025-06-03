import { useEffect, useRef, useState } from "react";
import { post } from '../shared/utils/api.js'
import './ProfileForm.css'

const ProfileForm = (props) => {
    const [passwords, setPasswords] = useState({
        'oldpassword': '',
        'newpassword': ''
    });
    const [image, setImage] = useState('');
    const [errMessage, setErrMessage] = useState('');

    const [successMessage, setSuccessMessage] = useState('');
    const fileInputRef = useRef(null);
    const [spinner, setSpinner] = useState(false);

    const _id = props._id

    const onSaveHandler = async (e) => {
        setSpinner(true);
        setSuccessMessage('');
        e.preventDefault();
        const parent = e.target.parentElement;
        const input = parent.childNodes[0].name;

        const formData = new FormData();
        formData.append('id', props._id);

        if (input === 'oldpassword') {
            if (passwords.newpassword.length < 4 || passwords.oldpassword.length < 4) {
                setSpinner(false);
                setErrMessage('Password is too short');
                return;
            }
            if (passwords.newpassword.length > 30 || passwords.oldpassword.length > 30) {
                setSpinner(false);
                setErrMessage('Password is too long');
                return;
            }

            const response = await post('/user/profile/edit-password', {
                id: props._id,
                'oldpassword': passwords.oldpassword,
                'newpassword': passwords.newpassword
            });

            setSpinner(false);
            if (response.status === 200) {
                setSuccessMessage(response.data.message);
                setPasswords({
                    'oldpassword': '',
                    'newpassword': ''
                });

            } else {
                setErrMessage(response);
            }

        } else if (input === 'image') {
            formData.append('image', image);
            formData.append('id', _id);

            const response = await fetch(import.meta.env.VITE_API_URL + '/user/profile/edit-image', {
                credentials: 'include',
                method: 'POST',
                body: formData,
            });
            setSpinner(false);
            const data = await response.json();
            if (response.status !== 200) {
                setErrMessage(data.message);
                return;
            }

            setSuccessMessage(data.message);
            fileInputRef.current.value = null;
        }
    }

    const changeHandler = (e) => {
        setSuccessMessage('');
        setErrMessage('');


        const { name, value, files } = e.target;
        switch (name) {
            case 'newpassword':
                setPasswords({ ...passwords, [name]: value });
                break;
            case 'oldpassword':
                setPasswords({ ...passwords, [name]: value });

                break;
            case 'image':
                setImage(files[0]);
                break;
        }
    };

    return (
        <>
            <form className='profile-form'>
                <fieldset>
                    <legend>{props.title}</legend>
                    <label htmlFor="password"></label>
                    {spinner
                        ? <img className="spinner-profile-edit" src="./spinner.svg" />
                        : <div className="form-wrapper">
                            {props.action === 'password' ?
                                <>
                                    <input
                                        type="password"
                                        name="oldpassword"
                                        placeholder='Old password'
                                        value={passwords.oldpassword}
                                        onChange={changeHandler}
                                        required
                                    />
                                    <input
                                        type="password"
                                        name="newpassword"
                                        placeholder='New password'
                                        value={passwords.newpassword}
                                        onChange={changeHandler}
                                        required
                                    />
                                </>
                                :
                                <>
                                    <input
                                        type="file"
                                        name="image"
                                        onChange={changeHandler}
                                        ref={fileInputRef}
                                        required
                                    />
                                </>
                            }
                            <button onClick={onSaveHandler}>SAVE</button>

                        </div>
                    }

                    <p className="error" style={{ 'color': 'red' }}>{errMessage}</p>
                    <p className="succes" style={{ 'color': '#16ee61' }}>{successMessage}</p>
                </fieldset>
            </form>
        </>
    )
}

export default ProfileForm;