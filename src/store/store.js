import Vue from 'vue';
import Vuex from 'vuex';
import {
    db
} from '../firebase';

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        userName: localStorage.getItem("userName"),
        userKey: localStorage.getItem("userKey"),
    },
    actions: {
        setUser(state, user) {
            state.commit('SET_USER', user);
        },
        logOut(state, payload) {
            state.commit('LOG_OUT', payload);
        }
    },
    getters: {
        userName: state => {
            return state.userName;
        },
        dbUsers: state => {
            return db.ref('Users');
        },
        dbPlats: state => {
            return db.ref('Plats/' + state.userKey);
        },
        dbMenus: state => {
            return db.ref('Menus/' + state.userKey);
        },
        dbPlatsStd: state => {
            return db.ref('Plats');
        }

    },
    mutations: {
        'SET_USER' (state, user) {
            state.userName = user.userName;
            localStorage.setItem("userName", user.userName);
            localStorage.setItem("userKey", user.userKey);
            user.route.go(user.route.currentRoute)
        },
        'LOG_OUT' (state, payload) {
            localStorage.removeItem("userName");
            localStorage.removeItem("userKey");
            payload.go('/')
        }
    }
});