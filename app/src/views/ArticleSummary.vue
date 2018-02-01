<template>
    <div class="o-grid-container">
        <div class="o-grid-row">
            <div data-o-grid-colspan="6">
                <form class="o-forms" v-on:submit.prevent="fetchResults()">
                    <div class="form-group">
                        <br>
                        <label class="o-forms__label" for="articleID">Article ID</label>
                        <input v-model="articleID" class="o-forms__text" placeholder="Article ID" />
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
                        <input v-if="summaryMethod == 'extractive'" class="o-forms__text" v-model="extractiveData.lines" placeholder="5" />
                    </div>
                    <br>
                    <button :disabled="articleID == ''" @click="fetchResults()" type="button" class="o-buttons o-buttons--primary">Submit!</button>
                </form>
            </div>
            <div data-o-grid-colspan="6">
                <h4 class="o-typography-heading-level-4">JSON Response</h4>
                <pre><code>{{this.responseData}}</code></pre>
            </div>
        </div>
        <span v-if="loading" class="o-loading o-loading--dark o-loading--small"></span>
        <div v-if="this.searchCompleted" class="o-grid-row">
            <div data-o-grid-colspan="12">
                <h3 class="o-typography-heading-level-3">{{this.responseData.title}}</h3>
                <h5 class="o-typography-heading-level-5">{{this.responseData.byline}}</h5>
                <pre>{{this.responseData.summary || this.responseData.content}}<pre>
                </div>
            </div>
    </div>
</template>

<script>
    import API from '../store/API'
    const api = new API();
    export default {
    
        data() {
            return {
                responseData: null,
                loading: false,
                searchCompleted: false,
                summaryMethod: 'sentence',
                articleID: '',
                extractiveData: {
                    algorithm: 'text-rank',
                    lines: ''
                }
            }
        },
    
        methods: {
    
            clearResults() {
                this.$data.articleID = '';
                this.$data.summaryMethod = "sentence";
                this.$data.searchCompleted = false;
            },
    
            fetchResults() {
                this.$data.loading = true;
                api.fetch(
                    this.articleID,
                    this.summaryMethod,
                    this.extractiveData
                ).then(response => {
                    this.$data.responseData = response;
                    this.$data.searchCompleted = true;
                    this.$data.loading = false;
                }).catch(err => {
                    this.$data.loading = false;
                    this.clearResults();
                    alert('Please enter a valid article ID');
                })
            },
    
        }
    }
</script>