<template>
<div>
        <h1>Word Cloud</h1>
    <div id="wordcloud-container">
        <canvas width="1000" height="700"  id="wordCloud1"></canvas>
    </div>
</div>
</template>

<script>
    import {
        mapState,
        mapGetters
    } from 'vuex'
    import Vue from 'vue'
    import wordcloud from 'wordcloud'

    export default {
    
        props: [
            'topicData'
        ],
    
        mounted() {
            this.createClouds();
        },
    
        methods: {
            createClouds() {
                let orgs = this.createWordcloud(this.topicData.facets.organisations);
                let people = this.createWordcloud(this.topicData.facets.people);
                let topics = this.createWordcloud(this.topicData.facets.topics);
                let allFacets = orgs.concat(people).concat(topics);
                wordcloud(document.getElementById('wordCloud1'), {list: allFacets, weightFactor: 7})
            },

            createWordcloud(facets) {
                let wordCloud = []
                for (let facet of facets) {
                    wordCloud.push([facet.name, facet.count])
                }
                return wordCloud;
            }
        }
    }
</script>

<style scoped>
    #wordcloud-container {
        margin: 0 auto;
        text-align: center;
    }
</style>

