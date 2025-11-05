<template>
    <div :class="{isHidden: isHidden}" class="statistics">
        <div class="statistics_inner">
            <h2 class="statistics_title">Статистика</h2>
            <div class="statistics_forms">
                <Field :fieldName="'statisticsFromDate'"/>
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

    export default {
        components: {Field},
        data(){
            return {
                statisticsData: [],
                isHidden: true
            }
        },
        computed: {
            dateNow(){
                return moment().toISOString();
            },
            getMonthAgo(){
                return moment().subtract(1, 'month').toISOString();
            }
        },
        methods: {
            getPeriodStatistics(){
                this.connector.getPeriodStatistics(this.getMonthAgo, this.dateNow)
                    .then(res => {
                        console.log('getPeriodStatistics res', res)
                        this.statisticsData = res.data;
                    })
                    .catch(err => {
                        console.log('getPeriodStatistics err', err)
                    })
            },
            hideStatistics(){
                this.isHidden = !this.isHidden
            }
        },
        mounted(){
            this.getPeriodStatistics()
        }
    }
</script>

<style lang="scss" scoped>
.statistics {
    max-width: 800px;
    background-color: #fff;
    border-radius: 8px;
    padding: 20px;
    position: relative;

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

    &.isHidden {
        height: 40px;
        padding: 0;
        overflow: hidden;
    }
}
</style>