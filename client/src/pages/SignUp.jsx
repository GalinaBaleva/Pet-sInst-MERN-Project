import AuthForm from '../components/AuthForm';

const SignUp = () => {
    return (
        <>
            <AuthForm
                buttontext='Sign Up'
                action='/user/signup'
                fieldset='Create an Account'
                spanLink='/login'
                span='sign in'
            />
        </>
    )
}

export default SignUp;
