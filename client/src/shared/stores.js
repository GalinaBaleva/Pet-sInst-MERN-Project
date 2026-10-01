import { configureStore } from '@reduxjs/toolkit';

const initialState = {
    login: false,
    username: '',
    userid: '',
    lastchange: null,
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'login':
            return { ...state, login: true, username: action.username, userid: action.userid };
        case 'logout':
            return { ...state, login: false, username: '', userid: '' };
        case 'update':
            return { ...state, lastchange: Date.now() };
        default:
            return state;
    }
};

export default configureStore({ reducer: authReducer });
