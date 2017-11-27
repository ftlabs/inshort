<template>
<div>
<div v-if="!this.kiosk">
    <div>
            <multiselect @select="facetSelected" @remove="facetRemoved" v-model="this.selectedFacets" :max="3" :options="this.facetList" :close-on-select="true" :select-label="null" :custom-label="renderLabel" :deselect-label="null" :multiple="true"
                placeholder="Select an entity"></multiselect>
            <p><small>Found <strong>{{facetList.length}}</strong> results</small></p>
    </div>
</div>
    <div v-if="this.kiosk">
        <h2 class="center">
            <span v-for="facet in this.selectedFacets" :key="facet" >
                <span style="font-size:20px;" class="o-labels">{{facet}}</span>
                <span>&nbsp;</span>
            </span>
        </h1>
    </div>
<div>
    <data-chart :kiosk="this.kiosk" ref="facetGraph" :width="400" :height="this.kiosk ? 300 : 200" :chart-data="facetGraph"></data-chart>
</div>
</div>
</template>

<script>
    import {
        mapGetters
    } from 'vuex';
    import Multiselect from 'vue-multiselect'
    import DataChart from '../general/DataChart'
    const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug",
        "Sep", "Oct", "Nov", "Dec"
    ];
    const colors = [
        '0, 0, 255',
        '255,128,0',
        '102,0,204'
    ]
    export default {

        components: {
            Multiselect,
            DataChart
        },

        props: [
            'word',
            'year',
            'facetData',
            'kiosk'
        ],

        data() {
            return {
                facetMap: null,
                facetList: [],
                facetGraph: {},
                selectedFacets: []
            }
        },
    
        watch: {
            facetData(newer, old) {
                this.updateData();
            }
        },
    
        created() {
            this.initGraph();
        },
    
        methods: {
    
            updateData() {
                let facets = this.facetData;
                this.$data.facetMap = facets;
                //TODO: once datastructure finalized by team, perform sort in server
                this.$data.facetList = Object.keys(facets).sort((a, b) => {
                    let firstTotal = facets[a].reduce((sum, val) => sum + val, 0);
                    let secondTotal = facets[b].reduce((sum, val) => sum + val, 0);
                    return secondTotal - firstTotal;
                })
                let initialFacets = this.kiosk ? 3 : 1;
                this.$data.selectedFacets = this.$data.facetList.slice(0, initialFacets);
                this.createFacetData();
            },
    
            renderLabel(item) {
                let articleCount = this.$data.facetMap[item].reduce((sum, val) => sum + val, 1);
                return `${item} - (${articleCount})`
            },
    
            facetSelected(item) {
                this.$data.selectedFacets.push(item);
                this.createFacetData();
            },
    
            facetRemoved(removed) {
                this.$data.selectedFacets = this.$data.selectedFacets.filter(item => item !== removed)
                this.createFacetData();
            },

            initGraph() {
                this.$data.facetGraph = {
                    labels: labels,
                    datasets: []
                }
            },
    
            createFacetData() {
                const datasets = [];
                for (let i = 0; i < this.$data.selectedFacets.length; i++) {
                    let facet = this.$data.selectedFacets[i];
                    let dataset = {
                        label: `Mentions of ${facet} and "${this.word}" over ${this.year}`,
                        data: this.$data.facetMap[facet],
                        backgroundColor: [`rgba(${colors[i]}, 0.2`],
                        borderColor: [`rgba(${colors[i]}, 1`]
                    }
                    datasets.push(dataset);
                }
                this.$data.facetGraph.datasets = datasets;
                this.$set(this.$data.facetGraph, "datasets", datasets)
                this.$refs.facetGraph.update();
            },
    
        }
    }
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style>
    .multiselect__tag {
        background-color:#0d7680;
    }
</style>

