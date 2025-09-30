<template>
    <div class="main-template">
        <Header 
            @log-in="showLogInWindow"
            @select-menu="selectMenu"
            :customButtonText="returnTextOfMode"
        />
        <div class="container">
            <router-view 
                @open-page="openPage"
            
                >
            </router-view>
        </div>
        
        <CustomForm 
            v-if="isShowSignWindow"
            @closeWindow="isShowSignWindow = false"
        />
        <Modal v-if="modal.isActive"/>

        <!-- <InfoNotation v-if="isShowError"/> -->
    </div>
</template>

<script>
import Header from '@/components/Header.vue';
import CustomButton from '@/parts/CustomButton.vue';
import Account from './Account.vue';
import Field from './Field.vue';
import Text from '@/Fields/Text.vue';
import CustomForm from './CustomForm.vue';
import AccountPage from './pages/AccountPage.vue';
import Modal from '@/parts/Modal.vue';
// import InfoNotation from './InfoNotation.vue';
import { useStore } from '@/stores/formsData';
import { useUIDataStore } from '@/stores/UIData';

    export default {
        name: 'MainTemplate',
        components: {
            Header,
            CustomButton,
            Account,
            Field,
            Text,
            CustomForm,
            AccountPage,
            Modal
            // InfoNotation
        },
        data(){
            return {
                isShowSignWindow: false,
                posts: [],
                activePage: 'home',
                isShowAccount: true,
                accountData: null,
                isShowError: false,
                // isModalActive: false
            }
        },
        methods:{
            showLogInWindow(){
                this.isShowSignWindow = true
            },

            hideLogInWindow(){
                this.isShowSignWindow = false
            },

            getData(){
                console.log(this.connector)
                this.connector.getData()
                    .then(response => console.log(response))
            },

            postData(){
                this.connector.postData()
            },

            selectMenu(e){
                console.log(e)

                // this.activePage = e
                this.$router.push('/')
            },

        },
        computed: {
            returnTextOfMode(){
                return this.registration ? "регистрация" : "войти"
            },
            connector() {
                return this.$root.connector;
            },
            getUrl(){
                return location
            },
            uiStore(){
                return useUIDataStore()
            },
            modal(){
                return this.uiStore.$state.modalData;
            }

        },
        mounted(){
            this.uiStore.updateLogin()
        },
        state(){
            const store = useStore();
            store.$subscribe((mutation, state) => {
            // mutation содержит информацию об изменении
            console.log('Изменение:', mutation.type, mutation.payload)
            
            // state содержит текущее состояние хранилища
            console.log('Новое состояние:', state)
            })
        },
        async beforeRouteUpdate(to, from) {
            console.log(from, to)
            this.userData = await fetchUser(to.params.id)
        },
        // watch: {
        //     'this.modal': {
        //         handler(newVal, oldVal){
        //             console.log('newVal', this.modal)
        //             if(newVal !== oldVal){
        //                 this.isModalActive = this.modal.isActive
        //             }
        //         },
        //         deep: true
        //     }
        // }


    }
</script>

<style lang="scss" scoped>
.main-template {
    width: 100%;
    // height: 100vh;
    background-color: #B5B8B1;
    
    & > .container {
        position: relative;
    }
}




</style>