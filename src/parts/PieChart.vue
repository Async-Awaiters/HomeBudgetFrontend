<template>
    <div class="chart">
        <Pie :data="chartData" :options="chartOptions" />
    </div>
</template>

<script>
import { Pie } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'
ChartJS.register(Title, Tooltip, Legend, ArcElement)
    export default {
        name: 'PieChart',
        components: { Pie },
        props: {
            chartLabels: Array,
            chartData: Array
        },
        data() {
            return {
                chartData: {
                    labels: this.chartLabels,
                    datasets: [
                    {
                        data: this.chartData,
                        backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0'
                        ],
                        hoverBackgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0'
                        ]
                    }
                    ]
                },
                chartOptions: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            }
        }  
    }
</script>

<style lang="scss" scoped>

</style>