<template>
    <div class="add-transaction">
        <!-- <h2>Транзакции</h2> -->
        <div class="add-transaction_inner">
            <Field
                v-for="field in fields"
                :key="field"
                :fieldName="field" 
            />
        </div>
        <RequestButton
            @reqest-call="addTransaction"
            :loading="loading" 
            :showButton="true"
            class="add-transaction_btn"
            >Добавить транзакцию
        </RequestButton>
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
            action: String
        },
        components: {
            CustomSelect,
            Field,
            RequestButton
        },
        data(){
            return {
                fields: ['transactionAmount',  'transactionCategory', 'transactionDescription'],
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
                return useUIDataStore().$state;
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
                        console.log('getCurrencies res', res)
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
                        console.log('getCategories res', res)
                        this.store.transactionCategory.items = res.data;
                    })
                    .catch(err => {
                        console.log('getCategories err', err)
                    })
                this.store.transactionCategory.items = this.categories
            },
            addTransaction(){
                const date = moment().toISOString();
                const data = {
                    accountId: this.id,
                    amount: Number(this.store.transactionAmount.value),
                    // currency: this.store.transactionCurrency.value,
                    // category: this.store.transactionCategory.value,
                    category: "Cash",
                    description: this.store.transactionDescription.value, // required
                    // date,
                    // planDate: true,
                    // isApproved: true,
                    // isRepeated: false,
                    // isDeleted: true
                }
                this.loading = true;
                this.connector.addTransaction(data)
                    .then(res => {
                        this.$emit('handle-request')
                        this.clearFields()
                        this.uiStore.isNeedBalanceUpdate = true;
                    })
                    .catch(err => {
                        console.log('addTransaction err', err)
                    })
                    .finally(()=> {
                        this.loading = false;
                    })
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
</style>