<template>
<div>
  <h1>Graph Summary</h1>
    <bar-chart ref="facetChart" :width="400" :height="200" :chart-data="facetData"/>
</div>
</template>

<script>
import Vue from 'vue'
import BarChart from '../general/BarChart'
export default {
    
        components: {
            BarChart
        },
    
        props: [
            'topicData',
            'searchTerm'
        ],

        data() {
            return {
               facetData: null
            }
        },
    
        methods: {
            
            initChart() {
                this.$data.facetData = {
                    labels: labels,
                    datasets: [{
                        label: "",
                        data: [],
                        backgroundColor: ['rgba(255, 159, 64, 0.2)'],
                        borderColor: ['rgba(255, 159, 64, 1)'],
                        borderWidth: 2
                    }]
                }
            }
        }
}
</script>

