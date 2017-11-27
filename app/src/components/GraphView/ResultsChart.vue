<template>
<div class="results-chart">
    <data-chart :kiosk="this.kiosk" class="results-chart" ref="resultsGraph" :width="400" :height="this.kiosk ? 300 : 200" :chart-data="resultGraph"></data-chart>
</div>
</template>

<script>
    import DataChart from '../general/DataChart'
    import {
        mapState,
        mapGetters
    } from 'vuex'
    const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug",
        "Sep", "Oct", "Nov", "Dec"];
    

    export default {

        props: [
            'kiosk'
        ],

        mounted() {
            this.initGraph();
        },

        components: {
            DataChart,
        },
    
        computed: mapGetters({
            responseData: 'getResults',
            year: 'getYear',
            word: 'getWord'
        }),
    
        watch: {
            responseData(newer, old) {
                this.updateData();
            }
        },
    
        data() {
            return {
                resultGraph: null
            }
        },
    
        methods: {

            updateData() {
                let months = this.responseData[this.year].months;
                this.createResultData(months)
            },


            initGraph() {    
                this.$data.resultGraph = {
                    labels: labels,
                    datasets: [{
                        label: "",
                        data: [],
                        backgroundColor: ['rgba(255, 159, 64, 0.2)'],
                        borderColor: ['rgba(255, 159, 64, 1)'],
                        borderWidth: 2
                    }]
                }
            },

            createResultData(months) {
                let label = `Mentions of "${this.word}" over ${this.year}`
                this.$set(this.$data.resultGraph.datasets[0], "data", months)
                this.$set(this.$data.resultGraph.datasets[0], "label", label)
                this.$refs.resultsGraph.update();
            },
    
        }
    
    }
</script>

<style>
.results-chart {
    padding-top: 45px;
} 
</style>
