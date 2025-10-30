<template>
    <div class="main-page">
        <GreetingsPage v-if="!isLogin"/>
        <Account v-if="isLogin" @open-page="openPage"/>
        <Categories v-if="isLogin"/>
        <Transition>
            <Information v-if="isShowInfo"/>
        </Transition>

    </div>
</template>

<script>
import Account from '@/components/Account.vue';
import Information from '@/components/Information.vue';
import GreetingsPage from './GreetingsPage.vue';
import { useUIDataStore } from '@/stores/UIData';
import Categories from '@/parts/Categories.vue';

    export default {
        components: {
            Account,
            Information,
            GreetingsPage,
            Categories
        },
        data(){
            return {
                isShowInfo: false,
                timeout: null,
                timeTimeout: 3000,
            }
        },
        computed:{
            notificationStatus(){
                return useUIDataStore().$state.infoNotifications.status;
            },
            isLogin(){
                return useUIDataStore().$state.isLogin;
            }
        },

        watch: {
            notificationStatus(newVal, oldVal) {
                console.log('Status changed from', oldVal, 'to', newVal)
                // Ваша логика при изменении статуса
                if(newVal){
                    this.isShowInfo = true
                }
            },
            isShowInfo(newVal, oldVal){
                if(newVal === true){
                    console.log('watch не равно')
                    this.timeout = setTimeout(()=> {
                        this.isShowInfo = false
                        this.clearUIState()
                        
                        //TODO: подумать стоит ли чистить UIData.infoNotifications при окончании таймаута?
                    }, this.timeTimeout)
                }

            },

        },
        methods: {
            async openPage(e){
                const state = JSON.parse(JSON.stringify(e))
                await this.$router.push({
                    name: 'account',
                    params: { id: e.id },
                    
                    
                })
                // this.$router.push('/account/123').catch(err => {
                //     console.error(err)
                // })
                // this.$router.push({ name: 'account', params: { id: 123 } })
            },
            clearUIState(){
                const state = useUIDataStore().$state.infoNotifications
                state.status = false
                state.isError = false
                state.text = ''
            },
        },
        mounted(){
            useUIDataStore().updateLogin()
        },
        
        beforeUnmount() {
            if (this.timeout) {
                clearTimeout(this.timeout)
            }
        }
    }
</script>

<style lang="scss" scoped>
.main-page {
    position: relative;
    padding: 40px;
    min-height: 900px;
    display: flex;
    flex-direction: column;
    gap: 40px;

    @media (max-width: 400px) {
        padding: 20px;
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

</style>