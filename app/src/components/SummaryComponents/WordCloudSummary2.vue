<template>
<div>
        <h1>Word Cloud</h1>
    <div id="wordcloud-container">
        <ul>
            <li v-for="word in words"><span :style="{fontSize: word[1]*7 + 'px'}">{{word[0]}}</span></li>
        </ul>
    </div>
</div>
</template>

<script>
    import Vue from 'vue'

    export default {
    
        components: {},

        props: [
            'topicData'
        ],

        data() {
            return {
                words: []
            }
        },
    
        mounted() {
            this.createClouds();
        },
    
        methods: {
            createClouds() {
                let orgs = this.createWordcloud(this.topicData.facets.organisations);
                let people = this.createWordcloud(this.topicData.facets.people);
                let topics = this.createWordcloud(this.topicData.facets.topics);
                let allFacets = orgs.concat(people).concat(topics);
                this.$data.words = allFacets.sort((a,b) => {
                    return b[1] - a[1];
                })
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

    ul {
        list-style: none;
    }

    #wordcloud-container {
        margin: 0 auto;
        text-align: center;
    }
</style>

