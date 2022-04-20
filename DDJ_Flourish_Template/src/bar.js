import {
  EVisualizationType,
  ahoi,
  generateBasicAnnotations,
} from '../static/lib/bundle.js';

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
        const extendedOnboardingMessages = defaultOnboardingMessages.map((d) => ({
          ...d,
          text: "test123"
        }));
        const ahoiConfig = {
          onboardingMessages: y,
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
