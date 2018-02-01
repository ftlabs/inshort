<template>
<div>
  <h1>Image Summary</h1>
    <image-slider :image-set="topicData.articles"/>
</div>
</template>

<script>
import Vue from 'vue'
import ImageSlider from '../general/ImageSlider'

export default {
    
        components: {
          ImageSlider
        },
    
        props: [
            'topicData',
            'searchTerm'
        ],
}
</script>

