<template>
    <div class="account">
        <h2>Счета</h2>
        <SwitchPanel
            @select-item="selectAccountAction"
            :items="accountSwitchPanel"
        />
        <p class="account_balance">Баланс: {{ balance }}</p>
        <div class="account_fields">
            <div v-if="selectedAccountAction?.nameId === 'create'" class="account_fields_create">
                <Field
                    v-for="field in fields"
                    :key="field"
                    :fieldName="field"
                />
                <RequestButton
                    @click="createAccount"
                    :loading="loading" 
                    class="account_btn_create" 
                    >Создать счёт
                </RequestButton>
            </div>
        </div>

        <div v-if="selectedAccountAction?.nameId === 'getAll' && accounts.length > 0">
            <ul 
                ref="list" 
                :class="dropDownOpen ? 'dropdown-open' : ''" 
                class="account_list"
                >
                <li 
                    v-for="account in accountsToShow"
                    :key="account.id"
                    @click="openPage(account)"
                    class="account_list-item"
                    >
                    <p class="account_name">{{ account.name}}</p>
                    <p class="account_sum">баланс: {{ account.balance }}</p>
                </li>
            </ul>
            <button @click="openDropdown" class="account_list_button"></button>
        </div>
        <p v-if="selectedAccountAction?.nameId === 'getAll' && accounts.length === 0" >Счета не найдены</p>
        
    </div>
</template>

<script>
import ReportTable from './ReportTable.vue';
// import { mockAccount, mockAccounts } from '@/helpers/mockAccountsData';
import Field from './Field.vue';
import SwitchPanel from '@/parts/SwitchPanel.vue';
import CustomSelect from '@/parts/CustomSelect.vue';
import RequestButton from '@/parts/RequestButton.vue';
import { useformsDataStore} from '@/stores/formsData';
import { useroutesDataStore } from '@/stores/routesData';

    export default {
        components: {
            ReportTable,
            Field,
            SwitchPanel,
            CustomSelect,
            RequestButton
        },
        data(){
            return {
                fields: ['accountName', 'accountType', 'accountCurrency', 'accountOverdraft', 'accountCreditLimit'],
                loading: false,
                countOfShowAccounts: 3,
                dropDownOpen: false,
                accounts: [],
                state: {
                    accountPageData: null,
                    totalSum: null
                },
                balance: 0,
                selectedAccountAction: null,
                accountSwitchPanel: [
                    {
                        id: 1,
                        nameId: 'getAll',
                        name: "список всех",
                        initialSelect: false
                    },
                    {
                        id: 2,
                        nameId: 'create',
                        name: "создать",
                        initialSelect: true
                    }
                ],
                currencies: [],
                selectedType: '',
                
            }
        },
        computed: {
            connector() {
                return this.$root.connector;
            },

            accountsToShow(){
                if(!this.dropDownOpen && this.accounts){
                    return this.accounts.length > this.countOfShowAccounts ? this.accounts.slice(0, this.countOfShowAccounts) : this.accounts
                }else {
                    return this.accounts
                }
            },

            getTotalSum(){
                return this.accounts.reduce((acc, current) => acc + current.sum, 0)
            },
            store(){
                return useformsDataStore().$state.fields;
            }
        },
        methods: {
            openDropdown(){
                this.dropDownOpen = !this.dropDownOpen
            },
            openPage(e){
                // const state = JSON.parse(JSON.stringify(e))
                // console.log('state', state)
                const store = useroutesDataStore().$state.routesData;
                store.accountData = e;
                console.log('eeeee', e)
                this.$router.push({
                    name: 'account',
                    params: {id: e.id},
                                       
                })
                // this.state.accountPageData = e
                // sessionStorage.setItem('state', JSON.stringify(this.state))
                
            },
            selectType(type){
                console.log('type', type)
                this.selectedType = type.text
            },
            selectAccountAction(e){
                console.log(e)
                this.selectedAccountAction = e
            },
            callAccounts(){
                this.connector.getAccounts()
                        .then(res =>{
                            console.log('getAllAccounts res', res)
                            this.accounts = res.data;
                            // this.getCurrencies();
                        })
                        .catch(err => {
                            console.log('getAllAccounts err', err)
                        })
            },
            createAccount(){
                // const store = useformsDataStore().$state.fields;

                if(this.selectedAccountAction.nameId === 'create'){
                    const requestData = {
                        name: this.store.accountName.value,
                        type: this.store.accountType.valueEn,
                        is_active: true,
                        userId: JSON.parse(localStorage.getItem('userId'))
                    }
                    this.loading = true;
                    this.connector.createAccount(requestData)
                        .then(res => {
                            console.log('create account res', res)
                        })
                        .catch(err => {
                            console.log(err)
                        })
                        .finally(() => {
                            this.loading = false;
                        })
                }
            },
            getCurrencies(){
                this.connector.getCurrencies()
                    .then(res => {
                        console.log('res 22123', res)
                        // this.currencies = res.data;
                        this.store.accountCurrency.items = res.data;
                    })
                    .catch(err => console.log('getCurrencies err', err))
            },
            clearSelectField(){
                this.selectedType = ''

            },
            // addAccountTypes(){
            //     this.store.accountType.items = this.typesOfAccount;
            // },
            getBalance(){
                this.connector.getBalance()
                    .then(res => {
                        console.log("getBalance res", res)
                        this.balance = res.data.totalBalance;
                    })
                    .catch(err => {
                        console.log('getBalance err', err)
                    })
            }
        },

        mounted(){
            // this.addAccountTypes();
            // this.accounts = mockAccounts;
            this.callAccounts()
            this.getBalance(); //пока не работает не удалять!
            this.getCurrencies();
            // this.state.totalSum = this.getTotalSum;
            // sessionStorage.setItem('state', JSON.stringify(this.state))
            // console.log('sum total', this.getTotalSum)
        }
        
    }
</script>

<style lang="scss" scoped>
.account {
    max-width: 800px;
    background-color: #fff;
    border-radius: 8px;
    padding: 20px;
    // width: 100%;
    // margin: 20px;

    &_balance {
        margin-bottom: 30px;
        text-align: left;
        background-color: #71ceed;
        color: #fff;
        padding: 10px;
        border-radius: 8px;
        font-weight: 600;
    }

    &_list {
        background-color: #C5D0E6;
        // border-radius: 8px;
        border-top-right-radius: 8px;
        border-top-left-radius: 8px;
        
        padding: 10px;

        display: flex;
        flex-direction: column;
        gap: 10px;
        overflow: hidden;
        max-height: v-bind(listHeight);

        &-item {
            display: flex;
            gap: 20px;
            height: 40px;
            border: 1px solid #e4e4e4;
            cursor: pointer;
            align-items: center;
            padding-left: 20px;
            border-radius: 8px;

        }

        &_button {
            width: 100%;
            height: 40px;
            background-color: #8D917A;
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;

        }
    }

    &_name {
        width: 100px;
        
        align-items: left;

    }

    .dropdown-open {
        // border-top-left-radius: 8px;
        // height: 100%;
        max-height: v-bind(listHeight);
        transition: all 1s ease-in;
    }

    &_btn_create {
        background-color: #42AAFF;
        height: 42px;
        color: #fff;
        max-width: 200px;
        width: 100%;
        border-radius: 6px;

    }

    &_fields {
        &_create {
            display: flex;
            flex-direction: column;
            gap: 20px;
            max-width: 400px;
            width: 100%;

            // & .text {
            //     margin-bottom: 0;
            // }
            
        }
    }
}
</style>