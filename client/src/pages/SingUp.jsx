import AuthForm from '../components/AuthForm';

const SingUp = () => {
    return (
        <>
            <AuthForm
                buttontext='Sing Up'
                action='/user/singup'
                fieldset='Create an Account'
                spanLink='/login'
                span='sing in'
            />
        </>
    )
}

export default SingUp;