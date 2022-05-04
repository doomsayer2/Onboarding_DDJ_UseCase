import {
  EVisualizationType,
  ahoi,
  generateBasicAnnotations,
} from '../static/lib/bundle.js';
import * as d3 from 'd3';

let chart = null;
let showOnboarding = false;
let onboardingUI = null;

export default class Bar {
  constructor(container, data) {
    this.container = container;
    this.data = data;

    this.createBarChart();
  }

  async createBarChart() {
    const data = [
      {
        x: Bar.unpack(this.data, 'salesperson'),
        y: Bar.unpack(this.data, 'sales'),
        type: 'bar',
        marker: {
          color: 'rgb(158,202,225)',
          opacity: 0.6,
          line: {
            color: 'rgb(8,48,107)',
            width: 1.5,
          },
        },
      },
    ];

    const layout = {
      title: 'Sales per person for 2022',
      xaxis: {
        title: 'Person',
      },
      yaxis: {
        title: 'Sales',
      },
    };

    const config = {
      responsive: true,
    };

    chart = await Plotly.newPlot(this.container, data, layout, config);
    Bar.registerEventListener();
  }

  static registerEventListener() {
    const helpIcon = document.getElementById("show-onboarding");
    if(!helpIcon) { return; }
    helpIcon.addEventListener('click', async () => {
      if(showOnboarding) {
        const defaultOnboardingMessages = generateBasicAnnotations(EVisualizationType.BAR_CHART, chart);        

        const extendedOnboardingMessages = [...defaultOnboardingMessages];
        extendedOnboardingMessages.push(
          {
            "anchor": {
                "element": d3.select('text.gtitle').node(),
                "findDomNodeByValue": true,
                "offset": {
                    "left": -40,
                    "top": 20
                }
            },
            "requires": [
                "chartTitle"
            ],
            "text": "Just use it!",
            "title": "Using the chart ",
            "onboardingStage": {
                "id": "flo-the-chart",
                "title": "Chart has a long title over 2 lines",
                "iconClass": "fas fa-arrows",
                "hoverBackgroundColor": "rgb(122, 34, 112)",
                "backgroundColor": "rgb(45, 23, 150)",
                "activeBackgroundColor": "rgb(134, 46, 94)",
                "order": 3
            },
            "marker": {
                "id": "flo-marker",
                "radius": 50,
                "fontSize": "40pt",
                "content": "X"
            }
        }
        );

        console.log({extendedOnboardingMessages});

        const ahoiConfig = {
          onboardingMessages: extendedOnboardingMessages,
        }
        onboardingUI = await ahoi(EVisualizationType.BAR_CHART, chart, ahoiConfig);
      } else {
        onboardingUI?.removeOnboarding();
      }
      showOnboarding = !showOnboarding;
    })
  }

  static unpack(rows, key) {
    return rows.map((row) => row[key]);
  }
}
