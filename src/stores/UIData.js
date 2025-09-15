import { defineStore } from 'pinia'

export const useUIDataStore = defineStore('UIData', {
    state: ()=> ({
        isShowLoginButton: true,
        infoNotifications: {
            isError: false,
            text: '',
            status: false
        },
        isLogin: false,
        modalData: {
            isActive: false,
            accountToDeleteId: null
        }

    }),
    actions: {
        updateLogin(){
            console.log(this.isLogin)
            this.isLogin = localStorage.getItem('login') ? true : false
        }
    }
})