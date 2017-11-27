<template>
<div class="o-grid-container">
	    <div class="o-grid-row">
            <div data-o-grid-colspan="6">
                <form class="o-forms" v-on:submit.prevent="fetchResults()">
                    <div class="form-group">
                        <br>
                        <label class="o-forms__label" for="articleID">Article ID</label>
                        <input v-model="articleID" class="o-forms__text" placeholder="Article ID"/>
                        <!-- <label class="o-forms__label" for="searchWord">After date</label>
                        <input type="date" v-model="afterDate" class="o-forms__text" id="afterDate">
                        <br><br>
                        <label class="o-forms__label" for="searchWord">Before date</label>
                        <input type="date" v-model="beforeDate" class="o-forms__text" id="beforeDate">
                        <br><br> -->
                        <br>
                        <label class="o-forms__label" for="summarySelect">Summary method</label>
                        <select placeholder="Select a summary method" v-model="summaryMethod" id="summarySelect" data-size="10" class="o-forms__select">
                                <option value="sentence">
                                    First sentence
                                </option>
                                <option value="extractive">
                                    Extractive summarization
                                </option>
                            </select>
                            <br>
                         <label v-if="summaryMethod == 'extractive'" class="o-forms__label" for="extractiveAlgorithm">Algorithm</label>
                         <select v-if="summaryMethod == 'extractive'" placeholder="Select a summary method" v-model="extractiveData.algorithm" id="extractiveAlgorithm" data-size="10" class="o-forms__select">
                                <option value="lex-rank">
                                    Lex rank
                                </option>
                                <option value="luhn">
                                    Luhn
                                </option>
                                <option value="lsa">
                                    Latent Semantic Analysis, LSA
                                </option>
                                <option value="edmundson">
                                    Edmundson
                                </option>
                                <option value="text-rank">
                                    Text Rank
                                </option>
                                 <option value="sum-basic">
                                    Sum Basic
                                </option>
                                <option value="kl">
                                    KL-Sum
                                </option>
                            </select>
                            <br>
                        <label v-if="summaryMethod == 'extractive'" class="o-forms__label" for="extractiveLength">Length</label>
                        <input v-if="summaryMethod == 'extractive'" class="o-forms__text" v-model="extractiveData.lines" placeholder="5"/>
                    </div>
                    <br>   
                    <button :disabled="articleID == ''" @click="fetchResults()" type="button" class="o-buttons o-buttons--primary">Submit!</button>
                </form>
            </div>
            <div data-o-grid-colspan="6">
                <textarea rows="10" class="o-forms__textarea" size="40" v-bind="this.responseData">{{this.responseData}}</textarea>
            </div>
        </div>
        <span v-if="loading" class="o-loading o-loading--dark o-loading--small"></span>
        <div v-if="this.searchCompleted" class="o-grid-row">
            <div data-o-grid-colspan="12">
                <h3 class="o-typography-heading-level-3">{{this.responseData.title}}</h3>
                <h5 class="o-typography-heading-level-5">{{this.responseData.byline}}</h5>
                <span>{{this.responseData.summary || this.responseData.content}}</span>
            </div>
        </div>
</div>
</template>

<script>
    import { mapState, mapGetters } from 'vuex'
    
    export default {
    
        components: {
        
        },

        computed: mapGetters({
            responseData: 'getResults'
        }),

        watch: {
            responseData (newer, old) {
                this.$data.searchCompleted = true;
                this.$data.loading = false;   
                console.log(newer);
                console.log("Called");  
            }
        },

        data() {
            return {
                loading: false,
                searchCompleted: false,
                afterDate: '',
                beforeDate: '',
                summaryMethod: 'sentence',
                articleID: '',
                extractiveData: {
                    algorithm: 'text-rank',
                    lines: ''
                }
            }
        },

        mounted() {
            //this.extractData();
        },
    
        methods: {

            extractData() {
                if(!this.$route.query.hasOwnProperty('data')) {
                    return;
                }
                const data = this.$route.query.data;
                let word, year;
                [word, year] = data.split(':');
                this.$data.word = word;
                this.$data.year = year;
                this.fetchResults();
            },
    
            clearResults() {
                this.$data.beforeDate = "";
                this.$data.afterDate = ""
                this.$data.summaryMethod = "";
                this.$data.searchCompleted = false;
            },

            fetchResults() {
                this.$data.loading = true;
                this.$store.commit('updateSearchParams', {
                    id: this.articleID,
                    summaryMethod: this.summaryMethod,
                    extractiveData: this.extractiveData
                });
                this.$store.dispatch('FETCH_DATA')
            },        

        }
    }
</script>
