<template>
    <div class="o-grid-container">
        <div v-if="!searchCompleted" class="o-grid-row">
            <div data-o-grid-colspan="12">
                <div data-o-component="o-aside-panel" class="o-aside-panel">
                    <div class="o-aside-panel__header">
                        <h5 class="o-aside-panel__heading">Search for a topic</h5>
                    </div>
                    <div class="o-aside-panel__body">
                        <form class="o-forms searchForm" v-on:submit.prevent="fetchResults()">
                            <div class="form-group">
                                <br>
                                <label class="o-forms__label" for="searchTerm">Search query</label>
                                <input eiw type="text" v-model="searchTerm" class="o-forms__text" id="searchTerm">
                                <br>
                                <label class="o-forms__label" for="afterDate">After date</label>
                                <input type="date" v-model="afterDate" class="o-forms__text" id="afterDate">
                                <br><br>
                                <label class="o-forms__label" for="beforeDate">Before date</label>
                                <input type="date" v-model="beforeDate" class="o-forms__text" id="beforeDate">
                                <br>
                            </div>
                            <br>
                            <button :disabled="searchTerm == ''" @click="fetchResults()" type="button" class="o-buttons o-buttons--primary">Submit!</button>
                            <span v-if="loading" class="o-loading o-loading--dark o-loading--small"></span>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <h4 v-if="searchCompleted" class="o-typography-heading-level-4">{{searchTerm}} : {{afterDate}} - {{beforeDate}}</h4>
        <select v-if="searchCompleted" v-model="selectedComponent">
            <option value="word-cloud">WordCloud</option>
            <option value="word-cloud2">WordCloud2</option>
            <option value="image-summary">Image Summary</option>
            <option value="summary-line">Summary Line</option>
            <option value="card-summary">Card summary</option>
            <option value="card-summary-zoom">Card summary with zoom</option>
        </select>
        <button v-if="searchCompleted" @click="initData()" type="button" class="o-buttons o-buttons--secondary pull-right">Reset</button>

        <word-cloud-summary :search-term="searchTerm" :topic-data="responseData" 
        v-if="searchCompleted && selectedComponent == 'word-cloud'"/>

        <word-cloud-summary2 :search-term="searchTerm" :topic-data="responseData" 
        v-else-if="searchCompleted && selectedComponent == 'word-cloud2'"/>

        <image-summary :search-term="searchTerm" :topic-data="responseData" 
        v-else-if="searchCompleted && selectedComponent == 'image-summary'"/>

        <summary-line :search-term="searchTerm" :topic-data="responseData" 
        v-else-if="searchCompleted && selectedComponent == 'summary-line'"/>

        <card-summary :search-term="searchTerm" :topic-data="responseData" 
        v-else-if="searchCompleted && selectedComponent == 'card-summary'"/>

        <card-summary-with-zoom :search-term="searchTerm" :topic-data="responseData" 
        v-else-if="searchCompleted && selectedComponent == 'card-summary-zoom'"/>
        <!-- <sentiment-summary :search-term="searchTerm" :topic-data="responseData" v-if="searchCompleted && zoomLevel == 75"/> -->
    </div>
</template>

<script>  
    import Vue from 'vue'
    import CardSummary from '../components/SummaryComponents/CardSummary'
    import CardSummaryWithZoom from '../components/SummaryComponents/CardSummaryWithZoom'
    import WordCloudSummary from '../components/SummaryComponents/WordCloudSummary'
    import WordCloudSummary2 from '../components/SummaryComponents/WordCloudSummary2'
    // import SentimentSummary from '../components/SummaryComponents/SentimentSummary'
    import ImageSummary from '../components/SummaryComponents/ImageSummary'
    import GraphSummary from '../components/SummaryComponents/GraphSummary'
    import SummaryLine from '../components/SummaryComponents/SummaryLine'
    import API from '../store/API'
    const api = new API();
    export default {
    
        components: {
            WordCloudSummary,
            WordCloudSummary2,
            CardSummary,
            CardSummaryWithZoom,
            ImageSummary,
            GraphSummary,
            SummaryLine,
        },
    
        data() {
            return {
                loading: false,
                searchCompleted: false,
                afterDate: '',
                beforeDate: '',
                searchTerm: '',
                selectedComponent: 'word-cloud',
                responseData: null
            }
        },
    
        mounted() {
            this.initData();
        },
    
        methods: {
    
            initData() {
                const today = new Date();
                let previous = new Date();
                previous = new Date(previous.setDate(previous.getDate() - 7));
                this.$data.afterDate = previous.toISOString().substring(0, 10);
                this.$data.beforeDate = today.toISOString().substring(0, 10);
                this.$data.searchTerm = "";
                this.$data.searchCompleted = false;
            },
    
            fetchResults() {
                this.$data.loading = true;
                this.$data.showTimeline = true;
                api.fetchTopicSummary(this.$data.searchTerm, 
                this.$data.beforeDate, this.$data.afterDate).then(response => {
                    this.$data.responseData = response;
                    this.$data.searchCompleted = true;
                    this.$data.loading = false;
                });
            }
        }
    }
</script>

<style scoped>
    .searchForm input {
        display: inline;
        vertical-align: top;
    }
</style>

