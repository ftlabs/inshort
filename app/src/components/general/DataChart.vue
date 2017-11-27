

<script>
import { Line, mixins } from 'vue-chartjs'
import {Chart} from 'chart.js';
const { reactiveProp } = mixins

export default {
  extends: Line,
  props: [
      'kiosk'
  ],
  mixins: [reactiveProp],
  methods: {
      update() {
        this.$data._chart.update();
      },

  },
  mounted () {
    const defaultGenerateLabels = Chart.defaults.global.legend.labels.generateLabels;
    const kiosk = this.kiosk;
    const options = {
      legend: {
          labels: {
              generateLabels:  function (data) {
                data.legend.afterFit = () => {
                    let width = this.width;
                    let divideFactor = kiosk ? 4 : 2;
                    this.lineWidths = this.lineWidths.map(function(){return width - (width/divideFactor);});
                };
                return defaultGenerateLabels(data);
              }   
          }
      },
      responsive: true,
      scales: {
         yAxes: [{
             ticks: {
                 beginAtZero: true,
                 userCallback: function(label, index, labels) {
                     if (Math.floor(label) === label) {
                         return label; //Remove decimal points
                     }

                 },
             }
         }],
         xAxes: [{ticks: {} }]
     }
    }
    if(this.kiosk) {
        options.scales.yAxes[0].ticks.fontSize=22;
        options.scales.xAxes[0].ticks.fontSize=22;
        options.legend.labels.fontSize = 20;
    }
    this.renderChart(this.chartData, options)
  }
}
</script>