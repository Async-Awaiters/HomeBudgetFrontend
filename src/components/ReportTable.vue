<template>
    <div class="report-table">
        <ul class="report-table_list">
            <li 
                v-for="report in reportData"
                :key="report.name"
                class="report-table_list-item"
                >
                <div class="report-table_name">{{ report.name }}</div>
                <div class="report-table_count">{{ report.count }}</div>
                <div class="report-table_consumption">{{ report.consumption }}</div>
                <div class="report-table_income">{{ report.income }}</div>
                <div class="report-table_sum">{{ report.sum !== null ? report.sum : 0 }}</div>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        props: {
            reportData: Array
        }
    }
</script>

<style lang="scss" scoped>
.report-table {
    &_list {
        &-item {
            display: flex;
            gap: 20px;

            &:nth-child(odd){
                background: #fff;
            }

            &:nth-child(even) {
                background: tomato;
            }
        }
    }

    &_name {
        max-width: 200px;
        width: 100%;
        text-align: left;
    }

}
</style>