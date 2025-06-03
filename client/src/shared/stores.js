import { legacy_createStore as createStore } from 'redux';

const initialState = {
    login: false, // localStorage.getItem( 'login' ) === 'ok'
    username: '',
    userid: '',
    lastchange: new Date()
}

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'login':
            // localStorage.setItem( 'login', 'ok' );
            return { ...state, login: true, username: action.username, userid: action.userid }
        case 'logout':
            // localStorage.removeItem( 'login' );
            return { ...state, login: false, username: '', userid: '' }
        case 'update':
            console.log(state)
            return { ...state, lastchange: new Date() }
        default:
            return { ...state }
    }

}

export default createStore(authReducer);