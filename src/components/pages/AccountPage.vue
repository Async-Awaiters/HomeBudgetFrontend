<template>
    <div class="account-page">
        <div class="account-page_inner">
            <h1 class="account-page_title">Счёт {{ currentAccount.Name }}</h1>
            <p class="account-page_subtitle">сумма на счету на данный момент: 
                <span>{{ currentAccount.Amount }}</span>
            </p>
        </div>
        <div v-if="currentAction === 'edit'" class="account-page_fields">
            <div class="account-page_fields_fields">
                <Field :fieldName="'newAccountName'"/>
                <Field :fieldName="'newAccountType'"/>
           </div>
           <div class="account-page_fields_buttons">
            <button @click="editAcoount">Изменить</button>
           </div>
        </div>
        <AddTransaction v-if="currentAction === 'add'"/>
        <div class="account-page_buttons">
            <button 
                @click="switchAction"
                id="add"
                class="account-page_buttons_button transactions"
                >Добавить транзакцию
            </button>
            <button 
                @click="switchAction"
                id="edit"
                class="account-page_buttons_button edit"
                >{{ editButtonText }}
            </button>
            <button
                @click="deleteAcoount"
                class="account-page_buttons_button delete"
                >Удалить счёт
            </button>
        </div>
        
        
        
    </div>
</template>

<script>
import { mockAccount } from '@/helpers/mockAccountsData';
import { useformsDataStore } from '@/stores/formsData';
import { useUIDataStore } from '@/stores/UIData';
import Field from '@/components/Field.vue';
import AddTransaction from '@/parts/AddTransaction.vue';


    export default {
        components: {
            Field,
            AddTransaction
        },
        data(){
            return {
                currentAccount: null,
                currentAction: '' 
            }
        },
        computed: {
            connector(){
                return this.$root.connector;
            },
            percentFromTotalSum(){
                return (this.state.accountPageData.sum / this.state.totalSum) * 100
            },
            
            editButtonText(){
                return !this.isShowFields ? 'Изменить счёт' : 'Не изменять счёт'
            },
            uiStore(){
                return useUIDataStore()
            }
            
        },
        methods: {
            async getCurrentAccount(){
                await this.connector.getAccount(this.$route.params.id)
                    .then(res => {
                        console.log('getAccount res', res)
                        this.currentAccount = res // todo проверить ответ!
                    })
                    .catch(err => {
                        console.log('getAccount err', err)
                    })
            },
            getMockData(id){
                this.currentAccount = mockAccount.find(el => el.Id === id);
            },

            editAcoount(){
                const store = useformsDataStore().$state.fields;
                const data = {
                    name: store.newAccountName.value,
                    type: store.newAccountType.value
                }
                this.connector.editAccount(data, this.$route.params.id)
                    .then(res => {
                        console.log('editAccount res', res)
                    })
                    .catch(err => {
                        console.log('editAccount err', err)
                    })
            },
            deleteAcoount(){
                console.log('delete store', useUIDataStore())
                const store = useUIDataStore().$state.modalData;
                store.accountToDeleteId = this.$route.params.id;
                store.isActive = true;
            },
            switchAction(e){
                console.log('e', e)
                if(e.target.id === 'add'){
                    this.currentAction = 'add'
                }else if(e.target.id === 'edit'){
                    this.currentAction = 'edit'
                }
            }
        },
        mounted(){
            // console.log('asdas', this.$route.params)
            // this.uiStore.updateLogin()
            // console.log('params', this.$route.params)
        },
        created(){
            // this.getCurrentAccount();
            this.getMockData(this.$route.params.id)

            
        }
    }
</script>

<style lang="scss" scoped>
.account-page {
    background: #fff;
    max-width: 800px;
    width: 100%;
    margin-top: 40px;
    padding: 20px;
    border-radius: 12px;

    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);

    &_fields {
        display: flex;
        // flex-direction: column;
        align-items: center;

        &_fields {
            max-width: 430px;
            width: 100%;
        }

        &_buttons {
            & > button {
                height: 42px;
                border-radius: 8px;
                max-width: 150px;
                width: 100%;
                background-color: grey;

            }
        }
    }

    &_subtitle {
        & > span {
            font-weight: 600;
        }
    }

    &_inner {
        margin-bottom: 40px;
    }

    &_buttons {
        display: flex;
        justify-content: center;
        gap: 20px;

        &_button {
            height: 42px;
            max-width: 200px;
            width: 100%;
            border-radius: 8px;
            
            &.edit {
                background-color: #BFFF00;
            }

            &.delete {
                background: tomato;
            }

            &.transactions {
                background-color: #42AAFF;
            }
        }
    }

    
}
</style>