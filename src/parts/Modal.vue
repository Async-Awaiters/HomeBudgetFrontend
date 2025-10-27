<template>
    <div class="modal">
        <div class="modal_overlay"></div>
        <div class="modal_agreement">
            <p>Вы подтверждаете удаление счёта?</p>
            <div class="modal_buttons">
                <button @click="deleteAgree">Да</button>
                <button @click="deleteCancel">Нет</button>
            </div>
        </div>
    </div>
</template>

<script>
import { useUIDataStore } from '@/stores/UIData';

    export default {
        props: {
            type: String
        },
        computed: {
            connector(){
                return this.$root.connector;
            },
            state(){
                return useUIDataStore().$state.modalData;
            }
        },
        methods: {
            deleteAgree(){
                console.log('deleteAgree', this.state.accountToDeleteId);
                this.state.isActive = false;
                this.connector.deleteAccount(this.state.accountToDeleteId)
                    .then(res => {
                        console.log('account delete res', res)
                        //todo подумать про редирект
                    })
                    .catch(err => {
                        console.log('account delete err', err)
                    })
            },
            deleteCancel(){
                this.state.isActive = false;
            }


        }
    }
</script>

<style lang="scss" scoped>
.modal {

    &_overlay {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: 100;
        background-color: rgba(0,0,0,0.7);
    }

    &_agreement {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 200;
        background-color: #fff;
        max-width: 400px;
        padding: 20px;
        border-radius: 8px;
        width: 100%;

        & p {
            margin-bottom: 10px;
        }

    }

    &_buttons {
        display: flex;
        justify-content: center;
        gap: 10px;
        
        & > button {
            max-width: 70px;
            width: 100%;
            height: 30px;
            border-radius: 6px;
            background-color: #DCDCDC;
        }
    }
}
</style>