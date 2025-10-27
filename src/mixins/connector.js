import axios from 'axios';
import { useUIDataStore } from '@/stores/UIData';

// const store = useUIDataStore();
// console.log('store connector', store);
// const baseUrl = "http://localhost:5000/api/";

console.log('links', process.env.VUE_APP_AUTH_URL)

function proxyConnector(url, method, data) {
    let config = {
        method: method ? method : 'GET',
        headers: {
            'Content-Type':'application/json',
            'Authorization': JSON.parse(localStorage.getItem('token'))
        },
        url: process.env.VUE_APP_ACC_URL  + url,
        data : data ? data : null
    };

    console.log('config connector', config)

    return new Promise((resolve, reject) => {
        axios(config)
            .then(response => {
                console.log('response connector', response)
                return resolve(response);
            })
            .catch(err => reject(err));
    });
}

function authProxyConnector(url, method, data) {
    let config = {
        method: method ? method : 'GET',
        headers: {
            'Content-Type':'application/json',
            'Authorization': JSON.parse(localStorage.getItem('token'))
        },
        url: process.env.VUE_APP_AUTH_URL + url,
        data : data ? data : null
    };

    console.log('config connector', config)

    return new Promise((resolve, reject) => {
        axios(config)
            .then(response => {
                console.log('response connector auth', response)
                return resolve(response);
            })
            .catch(err => reject(err));
    });
}

function dictionaryProxyConnector(url, method, data) {
    let config = {
        method: method ? method : 'GET',
        headers: {
            'Content-Type':'application/json',
            'Authorization': JSON.parse(localStorage.getItem('token'))
        },
        url: process.env.VUE_APP_DIC_URL + url,
        data : data ? data : null
    };

    console.log('config connector', config)

    return new Promise((resolve, reject) => {
        axios(config)
            .then(response => {
                console.log('response connector auth', response)
                return resolve(response);
            })
            .catch(err => reject(err));
    });
}


export default {
    data() {
        return {
            connector: {
                register(data){
                    return authProxyConnector("register/", "POST", data)
                },
                login(data){
                    return authProxyConnector("login/", "POST", data)
                },
                users(data){
                    return proxyConnector("users/", "PUT", data)
                },
                logout(data){
                    return authProxyConnector("logout/", "POST", data)
                },
                refresh(){
                    return authProxyConnector("refresh/", "GET")
                },

                createAccount(data){
                    return proxyConnector("accounts/", "POST", data)
                },
                getAccounts(data){
                    return proxyConnector("accounts", "GET", data)
                },
                getAccount(id){
                    return proxyConnector(`accounts/${id}`, "GET")
                },
                editAccount(data, id){
                    return proxyConnector(`accounts/${id}`, "PUT", data)
                },
                deleteAccount(id){
                    return proxyConnector(`accounts/${id}`, "DELETE")
                },

                getBalance(){
                    return proxyConnector("balance/", "GET")
                },
                addTransaction(data){
                    return proxyConnector("transactions/", "POST", data)
                },
                getTransactions(accountId){
                    return proxyConnector(`transactions/${accountId}`, "GET")
                },
                deleteTransaction(id){
                    return proxyConnector(`transactions/${id}`, "DELETE")
                },
                updateTransaction(id){  
                    return proxyConnector(`transactions/${id}`, "PUT")
                },

                confirmTransaction(id){
                    return proxyConnector(`transactions/${id}/confirm`, "PATCH")
                },

                getCategories(){
                    return dictionaryProxyConnector('categories', "GET")
                },
                addCategories(data){
                    return dictionaryProxyConnector('categories', 'POST', data)
                },
                getCategory(id){
                    return dictionaryProxyConnector(`categories/${id}`, 'GET')
                },
                deleteCategory(id){
                    return dictionaryProxyConnector(`categories/${id}`, 'DELETE')
                },
                updateCategory(data, id){
                    return dictionaryProxyConnector(`categories/${id}`, 'PUT', data)
                },
                getCurrencies(){
                    return dictionaryProxyConnector('currencies','GET')
                },
                getCurrency(id){
                    return dictionaryProxyConnector(`currencies/${id}`,'GET')
                }
            }
        }
    }
}