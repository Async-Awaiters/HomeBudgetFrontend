<template>
    <div class="account-page">
        <div class="account-page_inner">
            <h1 class="account-page_title">Счёт {{ currentAccount?.name }}</h1>
            <p class="account-page_subtitle">баланс на счету: 
                <span>{{ formatAmount(currentAccount?.balance) }}</span>
            </p>
            <p>наличие овердрафта: {{ currentAccount?.overdraftLimit ? "да" : "нет" }}</p>
            <p>кредитный лимит: {{ currentAccount?.creditLimit ? "да" : "отсутствует" }}</p>
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
        
        <div class="account-page_buttons">
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
        <div class="transactions">
            <h2 class="transactions_title">Транзакции</h2>
            <div>
                <SwitchPanel
                    @select-item="selectTransactionAction"
                    :items="transactionsActions"
                />
                <!-- <button 
                    @click="switchAction"
                    id="add"
                    class="account-page_buttons_button transactions"
                    >Добавить транзакцию
                </button>
                <button 
                    @click="switchAction"
                    id="add"
                    class="account-page_buttons_button transactions"
                    >Изменить транзакцию
                </button>
                <button 
                    @click="switchAction"
                    id="add"
                    class="account-page_buttons_button transactions"
                    >Удалить транзакцию
                </button> -->
            </div>
            <AddTransaction 
                v-if="currentTransactionAction"
                :id="currentAccount?.id"
                :action="currentTransactionAction.nameId"
                @handleRequest="handleRequest"
            />
            <ul v-if="transactionsCheck" class="transactions_list">
                <li 
                    v-for="transaction in transactions"
                    :key="transaction.amount"
                    class="transactions_list-item"
                    >
                    <p>Баланс: {{ formatAmount(transaction.amount) }}</p>
                    <p>Описание: {{ transaction.description }}</p>
                    <p>Дата создания: {{ formatDate(transaction.date) }}</p>
                </li>
            </ul>
            <p v-else>нет транзакций</p>
        </div>
        
    </div>
</template>

<script>
// import { mockAccount } from '@/helpers/mockAccountsData';
import { useformsDataStore } from '@/stores/formsData';
import { useUIDataStore } from '@/stores/UIData';
import Field from '@/components/Field.vue';
import AddTransaction from '@/parts/AddTransaction.vue';
import moment from 'moment';
import SwitchPanel from '@/parts/SwitchPanel.vue';

    export default {
        components: {
            Field,
            AddTransaction,
            SwitchPanel
        },
        data(){
            return {
                currentAccount: null,
                currentAction: '',
                transactions: [],
                transactionsActions: [
                    {
                        id:1,
                        nameId:"add",
                        name:"добавить",
                        initialSelect:false
                    },
                    {
                        id:2,
                        nameId:"edit",
                        name:"изменить",
                        initialSelect:false
                    },
                    {
                        id:3,
                        nameId:"delete",
                        name:"удалить",
                        initialSelect:false
                    },
                ],
                currentTransactionAction: null
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
            },
            formatMoney(){
                return this.currentAccount ? new Intl.NumberFormat("ru-RU", {style: currency, currency: 'RUB'}).format(this.currentAccount.balance) : 0;
            },
            transactionsCheck(){
                return this.transactions.length > 0 ? true : false;
            }
            
        },
        methods: {
            getCurrentAccount(){
                const id = this.$route.params.id;
                console.log('id', id)
                this.connector.getAccount(id)
                    .then(res => {
                        console.log('getAccount res', res)
                        this.currentAccount = res.data; // todo проверить ответ!
                        this.getTransactionsByAccount(res.data.id);
                    })
                    .catch(err => {
                        console.log('getAccount err', err)
                    })
            },
            editAcoount(){
                const store = useformsDataStore().$state.fields;
                const data = {
                    name: store.newAccount.name.value,
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
            },
            getTransactionsByAccount(){
                const accountId = this.currentAccount?.id
                console.log('accID', accountId)
                this.connector.getTransactions(accountId)
                    .then(res => {
                        console.log('getTransactions res', res)
                        this.transactions = res.data;
                    })
                    .catch(err => {
                        console.log('getTransactions err', err)
                    })
            },
            formatDate(date){
                const formateDate = moment(date).format("DD.MM.YYYY HH:mm")
                return formateDate
            },

            formatAmount(amount){
                const money = new Intl.NumberFormat("ru-RU", {style: 'currency', currency: 'RUB'}).format(amount)
                console.log('money', money)
                return money
            },
            handleRequest(){
                this.getTransactionsByAccount();
            },
            selectTransactionAction(e){
                console.log(e)
                this.currentTransactionAction = e
                // this.currentAction = e?.nameId
            },
        },
        mounted(){
            this.getCurrentAccount();
        },
        created(){
            // this.getMockData(this.$route.params.id)

            
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
        display: flex;
        flex-direction: column;
        align-items: start;
    }

    &_buttons {
        display: flex;
        justify-content: center;
        gap: 20px;
        margin-bottom: 40px;

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

.transactions {
    margin-bottom: 50px;

    &_title {
        margin-bottom: 40px;
    }

    &_list {
        list-style-type: none;

        &-item {
            display: flex;
            flex-direction: column;
            align-items: start;
            padding: 20px;
            margin-bottom: 10px;
            background-color: #78DBE2;
            border-radius: 8px;

            &:nth-child(odd){
                background-color: #42AAFF;
                color: #fff;
            }
            
            & p {
                text-align: left;
            }
        }
    }
}
</style>