<template>
    <figure class="image-block">
        <img :src="currentArticle.imageUrl" class="slider-img" :alt="currentArticle.title">
        <figcaption class="image-block-facets">{{currentFacet}}</figcaption>
    </figure>
</template>

<script>
    export default {
    
        props: {
            imageSet: {
                type: 'Array',
                required: true
            },
            interval: {
                type: 'Number',
                default: 7000
            }
        },
    
        computed: {
            currentArticle() {
                const article = this.imageSet[Math.abs(this.$data.slidePosition) % this.imageSet.length];
                if ('imageUrl' in article && article.imageUrl != null) {
                    return article
                } else {
                    this.next();
                    return this.currentArticle;
                }
            },

            currentFacet() {
                let annotations = this.currentArticle.annotations;
                const facet = annotations[Math.abs(this.$data.facetPosition) % annotations.length];
                return facet.prefLabel;
            }
        },
    
        data() {
            return {
                slidePosition: 0,
                facetPosition: 0,
                articleTimer: null,
                facetTimer: null
            }
        },
    
        mounted() {
            this.startRotation();
        },
    
        methods: {
    
            startRotation() {
                this.articleTimer = setInterval(this.next, this.interval)
                this.facetTimer = setInterval(this.nextFacet, 800);
            },
    
            next() {
                this.facetPosition = 0;
                this.slidePosition++;
            },

            nextFacet() {
                this.facetPosition++;
            },

            previousFacet() {
                this.facetPosition--;
            },
    
            previous() {
                this.facetPosition = 0;
                this.slidePosition--;
            },

            shuffleArray(annotations) {
                for (let i = array.length - 1; i > 0; i--) {
                    let j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
            }

        }
    }
</script>

<style scoped>
    img {
        vertical-align: middle;
        max-width: 100%;
    }
    
    .slider-img {
        object-fit: cover;
        width: 100%;
        height: 100%;
        /* filter: brightness(50%); */
    }
    
    .image-block {
        position: relative;
        padding: 0;
        margin: 0;
    }
    
    .image-block img {
        display: block;
        max-width: 100%;
        height: auto;
    }
    
    .image-block-caption {
        display: block;
        position: absolute;
        text-align: center;
        font-family: "Metricweb";
        font-size: 15px;
        background-color: black;
        color: #fff;
        left: 10%;
        width: 80%;
        bottom: 70%;
        padding: 1em;
        z-index: 2;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
    }

    .image-block-facets {
        display: block;
        position: absolute;
        text-align: center;
        font-family: "Metricweb";
        font-size: 20px;
        background-color: black;
        color: #fff;
        left: 10%;
        width: 80%;
        bottom: 40%;
        padding: 1em;
        z-index: 2;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
    }

</style>
