<template>
    <div>
        <h1>Card Summary</h1>
         <div>
            <div class="o-grid-row">
                <div v-for="article in topicData.articles.slice(0,4)" :data-o-grid-colspan="3">
                    <div class="o-card o-card-- o-card--image-" data-o-component="o-card">
                        <div class="o-card__content">
                            <div class="o-card__meta">
                        </div>
                            <h2 class="o-card__heading"><a :href="article.url">{{article.title}}</a></h2>
                            <p v-if="zoomLevel >= 40">{{article.summary}}</p>
                            <p v-else-if="zoomLevel < 40">{{article.standfirst}}</p>
                            <time data-o-component="o-date" class="o-date o-card__timestamp" datetime="{{article.firstPublishedDate}}">{{article.firstPublishedDate}}</time>
                        </div>
    
                    </div>
                </div>
            </div>
        </div>
        <div>
            <div v-for="facet in Object.keys(topicData.facets)" class="o-grid-row">
                <div v-for="facetElement in topicData.facets[facet].slice(0,4)" data-o-grid-colspan="3">
                    <br>
                    <div class="o-card o-card--landscape" data-o-component="o-card">
                        <div class="o-card__content">
                            <div class="o-card__meta">
                                <a href="#" class="o-card__tag">{{facetElement.name}}</a>
                            </div>
                        </div>
                        <ul class="o-card__related-content" v-for="result in facetElement.results">
                            <li class="o-card__related-content-item"><a :href="result.url">{{result.title}}</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    
    export default {
        
        props: [
            'topicData',
            'searchTerm'
        ],
    }
</script>

