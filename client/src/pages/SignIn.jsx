import AuthForm from "../components/AuthForm"

const SignIn = () => {
    return (
        <AuthForm
            buttontext='Sign In'
            action='/user/login'
            fieldset='Log In'
            spanLink='/signup'
            span='sign up'
        />
    )
}

export default SignIn;
