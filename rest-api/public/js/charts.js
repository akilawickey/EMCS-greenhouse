var gaugeOptions = {
   chart: {
       type: 'solidgauge'
   },
   title: null,
   pane: {
       center: ['50%', '85%'],
       size: '140%',
       startAngle: -90,
       endAngle: 90,
       background: {
           backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
           innerRadius: '60%',
           outerRadius: '100%',
           shape: 'arc'
       }
   },
   tooltip: {
       enabled: false
   },
   // the value axis
   yAxis: {
       stops: [
           [0.1, '#55BF3B'], // green
           [0.5, '#DDDF0D'], // yellow
           [0.9, '#DF5353'] // red
       ],
       lineWidth: 0,
       minorTickInterval: null,
       tickAmount: 2,
       title: {
           y: -70
       },
       labels: {
           y: 16
       }
   },

   plotOptions: {
       solidgauge: {
           dataLabels: {
               y: 5,
               borderWidth: 0,
               useHTML: true
           }
       }
   }
};

// The speed gauge
var chartSpeed = Highcharts.chart('container-speed', Highcharts.merge(gaugeOptions, {
   yAxis: {
       min: 0,
       max: 90,
       title: {
           text: 'Temperature'
       }
   },

   credits: {
       enabled: false
   },

   series: [{
       name: 'Speed',
       data: [1],
       dataLabels: {
           format: '<div style="text-align:center"><span style="font-size:25px;color:' +
               ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
                  '<span style="font-size:12px;color:silver">C</span></div>'
       },
       tooltip: {
           valueSuffix: ' C'
       }
   }]

}));

// The RPM gauge
var chartRpm = Highcharts.chart('container-rpm', Highcharts.merge(gaugeOptions, {
   yAxis: {
       min: 0,
       max: 120,
       title: {
           text: 'Humidity'
       }
   },

   series: [{
       name: 'RPM',
       data: [1],
       dataLabels: {
           format: '<div style="text-align:center"><span style="font-size:25px;color:' +
               ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y:.1f}</span><br/>' +
                  '<span style="font-size:12px;color:silver">%</span></div>'
       },
       tooltip: {
           valueSuffix: ' %'
       }
   }]

}));

var chartSpeed1 = Highcharts.chart('container-speed1', Highcharts.merge(gaugeOptions, {
yAxis: {
 min: 0,
 max: 1500,
 title: {
     text: 'Soil Moisture'
 }
},

series: [{
 name: 'RPM',
 data: [1],
 dataLabels: {
     format: '<div style="text-align:center"><span style="font-size:25px;color:' +
         ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y:.1f}</span><br/>' +
            '<span style="font-size:12px;color:silver"></span></div>'
 },
 tooltip: {
     valueSuffix: ' %'
 }
}]
}));

var chartRpm1 = Highcharts.chart('container-rpm1', Highcharts.merge(gaugeOptions, {
yAxis: {
 min: 0,
 max: 70000,
 title: {
     text: 'Light intensity'
 }
},

series: [{
 name: 'RPM',
 data: [1],
 dataLabels: {
 format: '<div style="text-align:center"><span style="font-size:25px;color:' +
     ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y:.1f}</span><br/>' +
        '<span style="font-size:12px;color:silver">lux</span></div>'
 },
 tooltip: {
     valueSuffix: ' %'
 }
}]

}));
setInterval(function () {
 // Speed
 var point,
     newVal,
     inc;
 // RPM
 if (chartSpeed) {
     point = chartSpeed.series[0].points[0];
     point.update(Math.round(graph_temp));
 }
 if (chartRpm) {
     point = chartRpm.series[0].points[0];
     point.update(Math.round(graph_hum));
 }
 if (chartSpeed1) {
     point = chartSpeed1.series[0].points[0];
     point.update(Math.round(graph_soil));
 }
 if (chartRpm1) {
     point = chartRpm1.series[0].points[0];
     point.update(Math.round(graph_light));
 }
}, 1000);
