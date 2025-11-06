<template>
    <div class="add-transaction">
        <button @click="$emit('close-transactions')" class="transation_close">
            <svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 122.88 122.88" >
                <g>
                    <path class="st0" d="M1.63,97.99l36.55-36.55L1.63,24.89c-2.17-2.17-2.17-5.73,0-7.9L16.99,1.63c2.17-2.17,5.73-2.17,7.9,0 l36.55,36.55L97.99,1.63c2.17-2.17,5.73-2.17,7.9,0l15.36,15.36c2.17,2.17,2.17,5.73,0,7.9L84.7,61.44l36.55,36.55 c2.17,2.17,2.17,5.73,0,7.9l-15.36,15.36c-2.17,2.17-5.73,2.17-7.9,0L61.44,84.7l-36.55,36.55c-2.17,2.17-5.73,2.17-7.9,0 L1.63,105.89C-0.54,103.72-0.54,100.16,1.63,97.99L1.63,97.99z"/>
                </g>
            </svg>
        </button>
        <!-- <h2>Транзакции</h2> -->
        <div class="add-transaction_inner">
            <Field
                v-for="field in addTransactionFields"
                :key="field"
                :fieldName="field" 
            />
            <RequestButton
                @reqest-call="addTransaction"
                :loading="loading" 
                :showButton="true"
                class="add-transaction_btn"
                >{{ buttonText }}
            </RequestButton>
        </div>
        
        <hr/>
    </div>
</template>

<script>
import Field from '@/components/Field.vue';
import CustomSelect from '@/parts/CustomSelect.vue';
import { useformsDataStore } from '@/stores/formsData';
import { useUIDataStore } from '@/stores/UIData';
import RequestButton from './RequestButton.vue';
import moment from 'moment';

    export default {
        props: {
            id: String,
            action: String,
            isEdit: Boolean,
            transactionToEdit: Object,
            userId: String
        },
        components: {
            CustomSelect,
            Field,
            RequestButton
        },
        data(){
            return {
                addTransactionFields: ['transactionAmount',  'transactionCategory', 'transactionDescription'],
                loading: false,
                // currencies: [],
                // categories: [],
                selectedCurrency: '',
                selectedCategory: ''
            }
        },
        computed: {
            connector(){
                return this.$root.connector;
            },
            store(){
                return useformsDataStore().$state.fields;
            },
            uiStore(){
                return useUIDataStore();
            },
            buttonText(){
                return this.isEdit ? 'Изменить транзакцию' : 'Добавить транзакцию';
            },
            accountId(){
                return this.$route.params.id;
            }
        },
        methods: {
            selectCurrency(currency){
                this.selectedCurrency = currency.text;
            },
            selectCategory(category){
                this.selectedCategory = category.text;
            },

            getCurrencies(){
                this.connector.getCurrencies()
                    .then(res => {
                        // this.currencies = res.data;
                        this.store.transactionCurrency.items = res.data;    
                    })
                    .catch(err => {
                        console.log('getCurrencies err', err)
                    })
            },
            getCategories(){
                this.connector.getCategories()
                    .then(res => {
                        this.store.transactionCategory.items = res.data;
                    })
                    .catch(err => {
                        console.log('getCategories err', err)
                    })
                this.store.transactionCategory.items = this.categories
            },
            addTransaction(){
                // const date = moment().toISOString();
                const data = {
                    accountId: this.accountId,
                    amount: Number(this.store.transactionAmount.value),
                    // currency: this.store.transactionCurrency.value,
                    // category: this.store.transactionCategory.value,
                    category: this.store.transactionCategory.value,
                    description: this.store.transactionDescription.value, // required
                    // date,
                    // planDate: true,
                    // isApproved: true,
                    // isRepeated: false,
                    // isDeleted: true
                }
                this.loading = true;
                if(!this.isEdit){
                    this.connector.addTransaction(data)
                        .then(res => {
                            this.$emit('handle-request')
                            this.store.transactionAmount.value = '';
                            this.store.transactionDescription.value = '';
                            this.store.transactionCategory.value = '';
                            this.uiStore.showNotification(false, 'транзакция создалась', true)// ошибка пофиксить
                            // this.clearFields()
                        })
                        .catch(err => {
                            console.log('addTransaction err', err)
                            // this.uiStore.showNotification(true, 'не получилось создать транзакцию', true)// ошибка пофиксить
                        })
                        .finally(()=> {
                            this.loading = false;
                        })
                }else {
                    const data = {
                        id: this.id,
                        amount: Number(this.store.transactionAmount.value),
                        accountId: this.accountId,
                        // category: "Cash",
                        description: this.store.transactionDescription.value,
                        date: this.transactionToEdit.date
                        // category: 'asndj',
                        // userId: this.userId
                    }
                    const id = this.transactionToEdit.id;
                    console.log('edittttttttttt', data)
                    this.connector.updateTransaction(id, data)
                        .then(res => {
                            this.$emit('handle-request')
                            // this.clearFields()
                            
                            this.uiStore.showNotification(false, 'транзакция создалась', true)// ошибка пофиксить
                        })
                        .catch(err => {
                            console.log('updateTransaction err', err)
                            // this.uiStore.showNotification(true, 'не получилось создать транзакцию', true)// ошибка пофиксить
                        })
                        .finally(()=> {
                            this.loading = false;
                        })
                }
                
            },
            clearFields(){
                for(let field of this.fields){
                    this.store[field].value = ''
                }
            }
        },
        mounted(){
            this.getCurrencies();
            this.getCategories();
        }        
    }
</script>

<style lang="scss" scoped>
.add-transaction {
    background: #fff;
    max-width: 800px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-bottom: 20px;
    border-radius: 8px;
    position: relative;
    
    // padding: 20px;

    &_inner {
        display: flex;
        flex-direction: column;
        max-width: 400px;
        width: 100%;
        gap: 20px;
        margin-bottom: 20px;
        // position: relative;
    }

    &_input {
        height: 40px;
        border: 1px solid #B5B8B1;
        border-radius: 8px;
        outline: none;
        max-width: 400px;
        width: 100%;
        padding-left: 10px;
    }

    &_btn {
        max-width: 200px;
        background-color:#42AAFF;
        height: 42px;
        border-radius: 6px;
        color: #fff;
    }
}
.loader {
    width: 42px;
    height: 42px;
    border: 5px solid #FFF;
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
    }

    @keyframes rotation {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
} 

.transation_close {
    position: absolute;
    top: 0;
    right: 0;
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items:center;

    & > svg {
        width: 20px;
        height: 20px;
    }
}
</style>