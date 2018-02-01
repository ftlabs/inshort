<template>
    <div class="container">
        <ol class="step-list">
            <li  v-for="(item, index) in topicData.articles" :id="index+1" class="step-list__item">
                <div class="step-list__item__inner">
                    <div class="content">
                        <div class="body">
                            <h2>{{item.title}}</h2>
                            <p>{{item.standfirst}}</p>
                        </div>
    
                        <div class="icon">
                            <img :src="item.imageUrl"/>
                        </div>
                    </div>
                </div>
            </li>
        </ol>
    </div>
</template>

<script>
    export default {

        props: [
            'topicData',
            'searchTerm'
        ],
    
    }
</script>

<style scoped>
    *,
    *:before,
    *:after {
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
    }
    
    .container {
        -webkit-box-sizing: content-box;
        box-sizing: content-box;
        padding: 0 12px;
        max-width: 640px;
        margin: 48px auto;
    }
    
    .step-list {
        margin: 0;
        padding: 0;
        list-style-type: none;
    }
    
    .step-list__item {
        counter-increment: step-counter;
        position: relative;
    }
    
    .step-list__item:before {
        content: counter(step-counter);
        font-weight: 300;
        color: #d8d8d8;
    }
    
    .step-list__item h2 {
        font-size: 24px;
        line-height: 30px;
        font-weight: 300;
    }
    
    .step-list__item .icon {
        border-radius: 50%;
        display: block;
        -webkit-box-flex: 0;
        -ms-flex: 0 0 auto;
        flex: 0 0 auto;
    }
    
    .step-list__item .icon img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
    }
    
    .step-list__item .body {
        font-size: 12px;
        line-height: 18px;
        font-weight: 300;
    }
    
    .step-list__item .content {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-orient: horizontal;
        -webkit-box-direction: normal;
        -ms-flex-direction: row;
        flex-direction: row;
        padding-bottom: 18px;
    }

    .step-list__item:nth-child(odd) .content {
        -webkit-box-pack: start;
        -ms-flex-pack: start;
        justify-content: flex-start;
    }
    
    .step-list__item:nth-child(even) .content {
        -webkit-box-pack: end;
        -ms-flex-pack: end;
        justify-content: flex-end;
    }
    
    .step-list__item:first-child>.step-list__item__inner:before {
        content: none;
    }
    
    .step-list__item:last-child>.step-list__item__inner:after {
        content: none;
    }
    
    .step-list__item+li {
        margin-top: 84px;
    }
    
    .step-list__item+li>div {
        margin-top: -1px;
    }
    
    @media screen and (max-width: 600px) {
        .step-list__item {
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
        }
        .step-list__item:before {
            content: counter(step-counter);
            position: relative;
            font-size: 36px;
            line-height: 42px;
            font-weight: 300;
            color: #000000;
            margin-right: 12px;
        }
        .step-list__item .icon {
            -webkit-box-ordinal-group: 1;
            -ms-flex-order: 0;
            order: 0;
            width: 36px;
            height: 36px;
            padding: 9px;
            position: absolute;
            left: -9px;
            top: 42px;
        }
        .step-list__item .body {
            -webkit-box-ordinal-group: 2;
            -ms-flex-order: 1;
            order: 1;
            margin-top: 8px;
            margin-left: 12px;
        }
        .step-list__item .content {
            -webkit-box-align: start;
            -ms-flex-align: start;
            align-items: flex-start;
        }
        .step-list__item .content:before {
            content: '';
            position: absolute;
            border-left: #d8d8d8;
            height: 100%;
            left: 9px;
            bottom: 0;
            display: block;
            width: 1px;
            background: #d8d8d8;
            top: 84px;
        }
        .step-list__item:last-child .content:before {
            content: none;
        }
    }
    
    @media screen and (min-width: 601px) {
        .step-list__item:before {
            content: counter(step-counter);
            position: absolute;
            font-size: 90px;
            line-height: 1;
            font-weight: 300;
            color: #d8d8d8;
        }
        .step-list__item .icon {
            width: 300px;
            height: 300px;
            padding: 48px;
        }
        .step-list__item .body {
            -webkit-box-flex: 0;
            -ms-flex: 0 1 33.3333%;
            flex: 0 1 33.3333%;
            margin-top: 84px;
        }
        .step-list__item .content {
            -webkit-box-align: end;
            -ms-flex-align: end;
            align-items: flex-end;
        }
        .step-list__item>.step-list__item__inner {
            position: relative;
        }
        .step-list__item>.step-list__item__inner:before,
        .step-list__item>.step-list__item__inner:after {
            border-width: 0px;
            border-style: solid;
            border-color: #d8d8d8;
            display: block;
            content: '';
            position: absolute;
            height: 42px;
            width: calc( 33.3333% - 42px);
        }
        .step-list__item:nth-child(odd)>.step-list__item__inner {
            text-align: right;
        }
        .step-list__item:nth-child(odd)>.step-list__item__inner:before,
        .step-list__item:nth-child(odd)>.step-list__item__inner:after {
            border-left-width: 1px;
            left: calc( 33.3333% - 21px);
        }
        .step-list__item:nth-child(odd)>.step-list__item__inner:before {
            border-top-width: 1px;
            border-top-left-radius: 42px;
            margin-top: -42px;
        }
        .step-list__item:nth-child(odd)>.step-list__item__inner:after {
            border-bottom-width: 1px;
            border-bottom-left-radius: 42px;
            margin-bottom: -42px;
        }
        .step-list__item:nth-child(odd):before {
            left: 0;
            margin-left: 33.3333%;
            -webkit-transform: translateX(-100%);
            transform: translateX(-100%);
        }
        .step-list__item:nth-child(odd) .icon {
            margin-left: 72px;
        }
        .step-list__item:nth-child(even)>.step-list__item__inner:before,
        .step-list__item:nth-child(even)>.step-list__item__inner:after {
            border-right-width: 1px;
            right: calc( 33.3333% - 21px);
        }
        .step-list__item:nth-child(even)>.step-list__item__inner:before {
            border-top-width: 1px;
            border-top-right-radius: 42px;
            margin-top: -42px;
        }
        .step-list__item:nth-child(even)>.step-list__item__inner:after {
            border-bottom-width: 1px;
            border-bottom-right-radius: 42px;
            margin-bottom: -42px;
        }
        .step-list__item:nth-child(even):before {
            right: 0;
            margin-right: 33.3333%;
            -webkit-transform: translateX(100%);
            transform: translateX(100%);
        }
        .step-list__item:nth-child(even) .icon {
            margin-right: 72px;
        }
        .step-list__item:nth-child(even) .body {
            -webkit-box-ordinal-group: 2;
            -ms-flex-order: 1;
            order: 1;
        }
    }
</style>
