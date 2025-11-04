<template>
    <header class="header">
        <!-- <nav class="header_nav">
            <ul class="header_nav_list">
                <li
                    v-for="item in menu"
                    :key="item"
                    @click="$emit('select-menu', item)" 
                    class="header_nav_list-item"
                    >{{ item }}
                </li>
            </ul>
        </nav> -->
        <!-- <v-btn @click="loging" class="header_button">log in</v-btn> -->
        <div class="header_container">
            <CustomButton
                v-if="!isLogin" 
                @click-on-button="$emit('log-in')" 
                :text="customButtonText"
                class="header_button" 
            />
            <p 
                v-if="isLogin"
                class="login"
                >залогинен как: {{ loginNickname }}
                <a @click="logout">выйти</a>
            </p>
            <!-- <button @click="isShowNotifications = !isShowNotifications" class="notification_btn">
                <img src="../assets/img/notification.svg" >
            </button> -->
        </div>
        <!-- <Transition>
            <Notifications v-if="isShowNotifications" class="header_notifications"/>
        </Transition> -->
    </header>
</template>

<script>
import CustomButton from "@/parts/CustomButton.vue";
import Notifications from "./Notifications.vue";
import { useUIDataStore } from "@/stores/UIData";
import { setInterval } from "core-js";
import moment from "moment";

    export default {
        components: {
            CustomButton,
            Notifications
        },
        props: {
            customButtonText: String
        },
        data(){
            return {
                // menu: ['home', 'about'],
                isShowNotifications: false,
                timeToRefreshToken: 40,

            }
        },
        computed: {
            // showLoginButton(){
            //     return useUIDataStore().$state.isShowLoginButton
            // },
            loginNickname(){
                return localStorage.getItem('login')
            },
            connector() {
                return this.$root.connector;
            },
            isLogin(){
                return useUIDataStore().$state.isLogin;
            },
            convertTimeToRefreshToken(){
                return this.timeToRefreshToken * 60 * 1000;
            },
            isRefreshed(){
                return JSON.parse(sessionStorage.getItem('refreshed'));
            },
            dateNow(){
                return moment().format('DD.MM.YYYY HH:mm:ss')
            },
            lastRefresh(){
                return JSON.parse(localStorage.getItem('lastRefreshToken'));
            },
            loginDate(){
                return JSON.parse(localStorage.getItem('loginDate'));
            },
            checkLogin(){
                if(this.loginDate){
                    const diff = moment(this.dateNow, 'YYYY-MM-DD HH:mm:ss').diff(moment(this.loginDate, 'YYYY-MM-DD HH:mm:ss'), 'minutes');
                    console.log('diff', diff)
                    return diff > 0 && diff <= this.timeToRefreshToken ? true : false;
                }else {
                    return null;
                }
            },

            // checkTokenRefreshDate(){
            //     if(this.lastRefresh){
            //         return moment(this.dateNow).diff(moment(this.lastRefresh), 'minutes') >= this.timeToRefreshToken ? true : false;
            //     }else {
            //         return null;
            //     }
            // },
            isHasToken(){
                return localStorage.getItem('token');
            }
        },
        methods: {
            logout(){
                const uiStore = useUIDataStore()
                this.connector.logout()
                    .then(response => {
                        this.isLogin = true
                        localStorage.removeItem('login')
                        localStorage.removeItem('token')
                        // localStorage.removeItem('loginDate')
                        uiStore.updateLogin()
                        this.$router.replace({name: 'home'})
                    })
                    .catch(err => {
                        console.log('logout err', err)
                    })
            },
            refresh(){
                this.connector.refresh()
                    .then(res =>{
                        localStorage.setItem('lastRefreshToken', JSON.stringify(this.dateNow))
                        localStorage.setItem('token', JSON.stringify(res.headers.authorization))
                    })
                    .catch(err => {
                        console.log('refresh err', err)
                        localStorage.removeItem('login')
                        localStorage.removeItem('token')
                    })
            },
            // formateDate(date){
            //     console.log(date.format('YYYY-MM-DD HH:mm:ss'))
            //     return date.format('YYYY-MM-DD HH:mm:ss');
            // }
            
        },
        mounted(){
            if(!this.checkLogin){
                this.refresh()
                // this.
            }else {
                if(this.isHasToken){
                    setInterval(() => {
                        this.refresh();
                    }, this.convertTimeToRefreshToken);
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
.header {
    background-color: #4E5754;
    padding: 35px 0;
    position: relative;

    &_nav {
        &_list {
            display: flex;
            justify-content: center;
            gap: 10px;
            list-style-type: none;
            color: #fff;

            &-item {
                cursor: pointer;

            }
        }
    }

    &_button {
        
        // padding: 4px 10px;
       
    }

    &_container {
        position: absolute;
        top: 50%;
        right: 20px;
        transform: translateY(-50%);
        display: flex;
        align-items: center;
        gap: 20px;
    }

    &_notifications {
        position: absolute;
        top: 70px;
        right: 10px;
        z-index: 100;
    }
}

.notification_btn {
    background-color: #fff;
    height: 36px;
    border-radius: 4px;
     cursor: pointer;
    
    & > img {
        height: 100%;
    }
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.login {
    color: #fff;

    & > a {
        cursor: pointer;
        text-decoration: underline;
    }
}
</style>