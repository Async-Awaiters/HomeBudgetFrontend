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
                <button @click="editAccount">Изменить</button>
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
                @click="deleteAccount"
                class="account-page_buttons_button delete"
                >Удалить счёт
            </button>
        </div> 
        <div class="transactions">
            <h2 class="transactions_title">Транзакции</h2>
            <!-- <div>
                <SwitchPanel
                    @select-item="selectTransactionAction"
                    :items="transactionsActions"
                />
            </div> -->
            <button 
                @click="currentTransactionAction = 'add'"
                id="add"
                class="account-page_buttons_button transactions"
                >Добавить транзакцию
            </button>
            <AddTransaction 
                v-if="currentTransactionAction === 'add' || currentTransactionAction === 'edit'"
                :id="transactionToEdit?.id"
                :action="currentTransactionAction.nameId"
                :isEdit="isEdit"
                :transactionToEdit="transactionToEdit"
                :userId="userId"
                @handleRequest="handleRequest"
                @close-transactions="closeTransactions"
            />
            <ul v-if="transactionsCheck" class="transactions_list">
                <TransactionItem
                    v-for="transaction in transactions"
                    :key="transaction.id"
                    @edit-transaction="handleEditTransaction"
                    @delete-transaction="deleteTransactionHandler"  
                    :transaction="transaction"
                    :currency="currentCurrency"
                />
            </ul>
            <p v-else>нет транзакций</p>
        </div>

        <Transition>
            <Information v-if="isShowInfo"/>
        </Transition>
        
    </div>
</template>

<script>
// import { mockAccount } from '@/helpers/mockAccountsData';
import { useformsDataStore } from '@/stores/formsData';
import { useUIDataStore } from '@/stores/UIData';
import Field from '@/components/Field.vue';
import AddTransaction from '@/parts/AddTransaction.vue';
// import moment from 'moment';
import SwitchPanel from '@/parts/SwitchPanel.vue';
import TransactionItem from '@/parts/TransactionItem.vue';
import Information from '../Information.vue';

    export default {
        components: {
            Field,
            AddTransaction,
            SwitchPanel,
            TransactionItem,
            Information
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
                currentTransactionAction: null,
                isEdit: false,
                transactionToEdit: null,
                userId: null,
                isShowTransactionModal: false,
                currencies: [],
                isCurrenciesAdded: false,
                isShowInfo: false,
                currentCurrency: ''
                // accountCategories: []
            }
        },
        computed: {
            connector(){
                return this.$root.connector;
            },
            editButtonText(){
                return !this.isShowFields ? 'Изменить счёт' : 'Не изменять счёт'
            },
            uiStore(){
                return useUIDataStore()
            },
            
            transactionsCheck(){
                return this.transactions.length > 0 ? true : false;
            },
            store(){
                return useformsDataStore().$state.fields
            },
            
        },
        methods: {
            getCurrentAccount(){
                const id = this.$route.params.id;
                console.log('id', id)
                this.connector.getAccount(id)
                    .then(res => {
                        this.currentAccount = res.data;
                        this.getTransactionsByAccount(res.data.id);
                        this.userId = res.data.userId;

                    })
                    .catch(err => {
                        console.log('getAccount err', err)
                    })
            },
            editAccount(){
                // const store = useformsDataStore().$state.fields;
                const data = {
                    name: this.store.newAccountName.value,
                    type: this.store.newAccountType.valueEn,
                    userId: this.currentAccount.userId,
                    currencyId: this.currentAccount.currencyId,
                    balance: this.currentAccount.balance
                }
                this.connector.editAccount(data, this.$route.params.id)
                    .then(res => {
                        this.store.newAccountName.value = ''
                        this.store.newAccountType.valueEn = ''
                        this.store.newAccountType.value = ''
                        this.getCurrentAccount()
                    })
                    .catch(err => {
                        console.log('editAccount err', err)
                    })
            },
            deleteAccount(){
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

                // this.connector.getCategories()
                //     .then(res => {
                //         console.log('types', this.store)
                //         this.store.newAccountType.items = res.data;
                //     })
                //     .catch(err => {
                //         console.log('getCategories err', err)
                //     })
            },
            getTransactionsByAccount(){
                const accountId = this.currentAccount?.id
                this.connector.getTransactions(accountId)
                    .then(res => {
                        console.log('getTransactions res', res)
                        this.transactions = res.data;
                    })
                    .catch(err => {
                        console.log('getTransactions err', err)
                    })
            },

            formatAmount(amount) {
                const getCurrencyId = this.$route.query.currencyId;
                
                console.log('getCurrencyId', getCurrencyId)
                if (!getCurrencyId) {
                    return new Intl.NumberFormat("ru-RU", {
                        style: "currency",
                        currency: "RUB"
                    }).format(amount);
                }

                const searchingCurrency = this.currencies?.find(item => item.id === getCurrencyId);
                this.currentCurrency = searchingCurrency;
                if (!searchingCurrency) {
                    return new Intl.NumberFormat("ru-RU").format(amount);
                }

                return new Intl.NumberFormat("ru-RU", {
                    style: "currency",
                    currency: searchingCurrency.code
                }).format(amount);
            },
            handleRequest(){
                this.getTransactionsByAccount();
                this.getCurrentAccount();
            },
            handleEditTransaction(e){
                console.log('edit transaction', e)
                // 'transactionAmount',  'transactionCategory', 'transactionDescription']
                this.currentTransactionAction = 'edit';
                this.transactionToEdit = e;
                this.isEdit = true;
                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                })
            },
            deleteTransactionHandler(id){
                this.connector.deleteTransaction(id)
                    .then(res => {
                        console.log('res', res)
                        // const index  = this.transactions.findIndex(item => item.id === id);
                        // this.transactions.splice()
                        this.transactions = this.transactions.filter(item => item.id !== id);
                        this.getCurrentAccount()
                    })
                    .catch(err => {
                        console.log('deleteTransaction err', err)
                    })
            },
            closeTransactions(){
                this.currentTransactionAction = null;
            },
            isShowConversationHandler(transaction){
                this.isShowTransactionModal = true;
            },
            getCurrencies(){
                this.connector.getCurrencies()
                    .then(res => {
                        this.currencies = res.data;
                        this.isCurrenciesAdded = true;
                    })
                    .catch(err => {
                        console.log('getCurrecies err', err)
                    })
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
        },
        async mounted(){
            this.getCurrentAccount();
            this.getCurrencies();
        },

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
        flex-direction: column;
        // align-items: flex-start;
        align-items: start;
        margin-bottom: 30px;

        &_fields {
            max-width: 430px;
            width: 100%;

        margin-bottom: 30px;
        }

        &_buttons {
            & > button {
                height: 42px;
                border-radius: 8px;
                max-width: 150px;
                width: 100%;
                background-color: grey;
                padding: 0 5px;
                color: #fff;

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
}

.isShow {
    display: block;
}
</style>