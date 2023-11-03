import React, { useEffect } from 'react';
import { View, Text } from 'react-native';

import ChartView from 'react-native-highcharts';

export default function Graph({ servings_consumed,recommended_servings }) {

   
    const options = {
        global: {
            useUTC: false
        },
        lang: {
            decimalPoint: ',',
            thousandsSep: '.'
        }
    };


    var Highcharts = 'Highcharts';

    var conf = {
        exporting: {
            enabled: false
        },
        chart: {
            type: 'column'
        },
        title: {
            text: 'Diet Status'
        },
        xAxis: {
            categories: [
                ' Jun 14',
                'Jun 15',
                'Jun 16'
            ],
            labels: {
                style: {
                    padding: 100
                }
            }
        },
        yAxis: [{
            min: 0,
            title: {
                text: 'Servings Status'
            }
        },
        ],
        legend: {
            shadow: false
        },
        tooltip: {
            shared: true
        },
        plotOptions: {
            column: {
                grouping: false,
                shadow: false,
                borderWidth: 0
            }
        },
        series: [{
            name: 'Recommended Servings',
            color: 'rgba(165,170,217,1)',
            data: recommended_servings,
            pointPadding: 0.3,
            pointPlacement: -0.2
        }, {
            name: 'Consumed Servings',
            color: 'rgba(126,86,134,.9)',
            data: servings_consumed,
            // pointPadding: 0.4,
            // pointPlacement: -0.2
        }
            //   , {
            //   name: 'Profit',
            //   color: 'rgba(248,161,63,1)',
            //   data: [183.6, 178.8, 198.5],
            //   tooltip: {
            //     valuePrefix: '$',
            //     valueSuffix: ' M'
            //   },
            //   pointPadding: 0.3,
            //   pointPlacement: 0.2,
            //   yAxis: 1
            // }, {
            //   name: 'Profit Optimized',
            //   color: 'rgba(186,60,61,.9)',
            //   data: [203.6, 198.8, 208.5],
            //   tooltip: {
            //     valuePrefix: '$',
            //     valueSuffix: ' M'
            //   },
            //   pointPadding: 0.4,
            //   pointPlacement: 0.2,
            //   yAxis: 1
            //   }
        ]
    }
    return (
        <View>
            <ChartView style={{ height: 300, top: 12 }} config={conf} options={options}></ChartView>
        </View>
    );
}
