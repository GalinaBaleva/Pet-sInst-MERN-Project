import AuthForm from "../components/AuthForm"

const SingIn = () => {
    return (
        <AuthForm
            buttontext='Sing In'
            action='/user/login'
            fieldset='Log In'
            spanLink='/singup'
            span='sing up'
        />
    )
}

export default SingIn;