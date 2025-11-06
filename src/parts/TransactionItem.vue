<template>
    <li 
        class="transactions_list-item"
        >
        <div class="transactions_list-item_info">
            <p>Баланс: {{ formatAmount(transaction?.amount) }}</p>
            <p>Описание: {{ transaction.description }}</p>
            <p>Дата создания: {{ formatDate(transaction.date) }}</p>
        </div>
        <div class="transactions_list-item_actions">
            <button @click="$emit('edit-transaction', transaction)" class="transactions_list-item_actions-edit_btn">изменить</button>
            <button @click="isShowTransactionModal = true" class="transactions_list-item_actions-delete_btn">удалить</button>
        </div>
        <div v-if="isShowTransactionModal"  class="transactions_list-item_confirmation">
            <div class="transactions_list-item_confirmation_block">
                <p>Удалить транзакцию?</p>
                <div class="transactions_list-item_confirmation_block_buttons">
                    <button @click="$emit('delete-transaction', transaction.id)">да</button>
                    <button @click="isShowTransactionModal = false">нет</button>
                </div>
            </div>
        </div>

    </li>
</template>

<script>
import moment from 'moment';
    export default {
        props: {
            transaction: Object,
            currency: Object
        },
        data(){
            return {
                isShowTransactionModal: false
            }
        },
        methods: {
            formatAmount(amount){
                const money = new Intl.NumberFormat("ru-RU", {style: 'currency', currency: this.currency.code}).format(amount)
                return money
            },
            formatDate(date){
                const formateDate = moment(date).format("DD.MM.YYYY HH:mm")
                return formateDate
            },
            // formatAmount(amount) {
            //     const getCurrencyId = this.$route.query.currencyId;
                
            //     console.log('getCurrencyId', getCurrencyId)
            //     if (!getCurrencyId) {
            //         return new Intl.NumberFormat("ru-RU", {
            //             style: "currency",
            //             currency: "RUB"
            //         }).format(amount);
            //     }

            //     const searchingCurrency = this.currencies?.find(item => item.id === getCurrencyId);

            //     if (!searchingCurrency) {
            //         return new Intl.NumberFormat("ru-RU").format(amount);
            //     }

            //     return new Intl.NumberFormat("ru-RU", {
            //         style: "currency",
            //         currency: searchingCurrency.code
            //     }).format(amount);
            // },

        }
    }
</script>

<style lang="scss" scoped>
.transactions {
    margin-bottom: 50px;

    &_title {
        margin-bottom: 40px;
    }

    &_list {
        list-style-type: none;

        &-item {
            display: flex;
            // flex-direction: ;
            // align-items: start;
            justify-content: space-between;
            padding: 20px;
            margin-bottom: 10px;
            background-color: #78DBE2;
            border-radius: 8px;
            position: relative;

            &_confirmation {
                position: absolute;
                top: 0;
                left: 0;
                bottom: 0;
                right: 0;
                background-color: #000;
                opacity: 0.8;
                border-radius: 8px;
                // display: none;

                &_block {
                    max-width: 200px;
                    margin: 20px auto;

                    & > p {
                        color: #FFA500;
                        font-weight: 700;
                        text-align: center !important; 
                    }

                    &_buttons {
                        margin-top: 15px;
                        display: flex;
                        gap: 20px;
                        justify-content: center;

                        & > button {
                            width: 50px;
                            background-color: #fefefe;
                            color: #000;
                            padding: 2px 5px;
                        }
                    }

                    
                }

                

            }

            &:nth-child(odd){
                background-color: #42AAFF;
                color: #fff;
            }

            &_actions {
                display: flex;
                flex-direction: column;
                justify-content: space-between;

                &-edit_btn {
                    background-color: yellow;
                    color: #000;
                    padding: 2px 4px;
                    width: 80px;
                    border-radius: 6px;
                }
                &-delete_btn {
                    background-color: tomato;
                    color: #fff;
                    width: 80px;
                    border-radius: 6px;
                }
            }
            
            & p {
                text-align: left;
            }


        }
    }
}
.isShow {
    display: block;
}
</style>