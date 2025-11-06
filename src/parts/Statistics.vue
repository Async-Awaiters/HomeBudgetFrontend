<template>
    <div :class="{isHidden: isHidden}" class="statistics">
        
        <div class="statistics_inner">
            <h2 class="statistics_title">Статистика</h2>
            <div class="statistics_container">
                <SwitchPanel
                    @select-item="selectTypeOfStatistics"
                    :items="switchPanelItems"
                />
                <div v-if="isShowRangeForm" class="statistics_forms">
                    <Field
                        v-for="field in fields"
                        :key="field" 
                        :fieldName="field"
                    />
                    <button 
                        @click="getRangeDataHandler"
                        :disabled="isDisabledBtn" 
                        class="statistics_forms_btn">Запросить
                    </button>

                    <PieChart 
                        v-if="amounts.length > 0 && isShowRangeForm && isReceivedRangeData"
                        :chartData="amounts"
                        :chartLabels="labels"
                        class="reqestedChart"
                    />
                    <p v-if="errors.status" class="statistics_errors">{{ errors.text }}</p>

                </div>

                <PieChart 
                    v-if="amounts.length > 0 && !isShowRangeForm"
                    :chartData="amounts"
                    :chartLabels="labels"
                />
            </div>
            
        </div>

        <button 
            @click="hideStatistics" 
            :class="{isHidden: isHidden}" 
            class="statistics_hide-button"
            >
            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve">
                <path style="fill:#0089FF;" d="M507.344,154.765c-7.713-10.283-22.301-12.367-32.582-4.655L256.005,314.182L37.238,150.111
                    c-10.283-7.713-24.869-5.626-32.582,4.655c-7.713,10.282-5.627,24.871,4.655,32.582l232.732,174.544
                    c4.138,3.103,9.05,4.655,13.964,4.655c4.912,0,9.826-1.552,13.964-4.655l232.72-174.544
                    C512.971,179.636,515.056,165.048,507.344,154.765z"
                />
            </svg>
        </button>
    </div>
</template>

<script>
import moment from 'moment';
import Field from '@/components/Field.vue'
import PieChart from './PieChart.vue';
import SwitchPanel from './SwitchPanel.vue';
import { useformsDataStore} from '@/stores/formsData';

    export default {
        components: {Field, SwitchPanel, PieChart},
        data(){
            return {
                statisticsData: [],
                isHidden: true,
                isShowRangeForm: false,
                fields: ['statisticsFromDate', 'statisticsToDate'],
                switchPanelItems: [
                    {
                        id: 1,
                        nameId: 'perMonth',
                        name: "за месяц",
                        initialSelect: true
                    },
                    {
                        id: 2,
                        nameId: 'range',
                        name: "выбрать",
                        initialSelect: false
                    },
                ],
                isReceivedRangeData: false,
                isDisabledBtn: true,
                errors: {
                    status: false,
                    text: ''
                }
            }
        },
        computed: {
            dateNow(){
                return moment().toISOString();
            },
            getMonthAgo(){
                return moment().subtract(1, 'month').toISOString();
            },
            amounts(){
                if (!this.statisticsData || !this.statisticsData.categoryReport) {
                    return [];
                }
                return this.statisticsData.categoryReport.map(item => item.amount);
            },
            labels(){
                if (!this.statisticsData || !this.statisticsData.categoryReport) {
                    return [];
                }
                return this.statisticsData.categoryReport.map(item => item.categoryName);
            },
            store(){
                return useformsDataStore().$state;
            },
            fromHasErrors(){
                return this.store.fields.statisticsFromDate.errors
            },
            toHasErrors(){
                return this.store.fields.statisticsToDate.errors
            }
        },
        methods: {
            getPeriodStatistics(from, to){
                this.connector.getPeriodStatistics(from, to)
                    .then(res => {
                        this.statisticsData = res.data;
                        if(this.isShowRangeForm){
                            this.isReceivedRangeData = true;
                        }
                    })
                    .catch(err => {
                        console.log('getPeriodStatistics err', err)
                        this.errors.status = true;
                        this.errors.text = err
                    })
            },
            hideStatistics(){
                this.isHidden = !this.isHidden
            },
            selectTypeOfStatistics(e){
                if(e.nameId === 'perMonth'){
                    this.isShowRangeForm = false;
                    this.getPeriodStatistics(this.getMonthAgo, this.dateNow)
                }else {
                    this.isShowRangeForm = true;
                }
            },
            getRangeDataHandler(){
                const from = moment(this.store.fields.statisticsFromDate.value, 'DD.MM.YYYY').toISOString();
                const to = moment(this.store.fields.statisticsToDate.value, 'DD.MM.YYYY').toISOString();
                console.log('from and to', from, to)
                if(from && to){
                    this.getPeriodStatistics(from, to)
                }else {
                    this.isDisabledBtn = true;
                }
                
            }
        },
        watch:{
            fromHasErrors(newVal, oldVal){
                if(newVal.length === 0){
                    this.isDisabledBtn = false
                }else {
                    this.isDisabledBtn = true
                }
            },
            toHasErrors(newVal, oldVal){
                if(newVal.length === 0){
                    this.isDisabledBtn = false
                }else {
                    this.isDisabledBtn = true
                }
            }
        }
        // async mounted(){
            
        // }
    }
</script>

<style lang="scss" scoped>
.statistics {
    max-width: 800px;
    background-color: #fff;
    border-radius: 8px;
    padding: 20px;
    position: relative;

    &_container {
        margin-top: 20px;
    }

    &_hide-button {
        position: absolute;
        top: 20px;
        right: 20px;
        transform: rotate(180deg);

        &.isHidden {
            top: 10px;
            transform: rotate(0deg);
        }

        & > svg {
            width: 25px;
            height: 25px;
        }
    }

    &_forms {
        &_btn {
            background-color: #42AAFF;
            padding: 2px 5px;
            height: 40px;
            width: 100px;
            border-radius: 8px;
            color: #fff;

            &:disabled {
                filter:grayscale(80%);
            }
        }
    }

    &.isHidden {
        height: 40px;
        padding: 0;
        overflow: hidden;
    }

    &_error {
        color: tomato;

    }
}

.reqestedChart {
    margin-top: 40px;
}
</style>