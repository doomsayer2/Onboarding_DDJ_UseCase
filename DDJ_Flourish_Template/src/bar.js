import {
  EVisualizationType,
  ahoi,
  generateBasicAnnotations,
  createBasicOnboardingMessage,
  createBasicOnboardingStage,
  getOnboardingStages
} from '../static/lib/bundle.js';
import * as d3 from 'd3';

let chart = null;
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
    const helpIcon = document.getElementById('show-onboarding');

    if (!helpIcon) {
      return;
    }

    helpIcon.addEventListener('click', async () => {
      let showOnboarding = true;    // ALWAYS SHOW IT ---> DEBUGGING

      if (showOnboarding) {
        const defaultOnboardingMessages = generateBasicAnnotations(
          EVisualizationType.BAR_CHART,
          chart
        );

        const extendedOnboardingMessages = [...defaultOnboardingMessages];

        // ======================================
        //           ⚠️ NEW - Start ⚠️
        // ======================================
        
        // Add new stage
        const newOnboardingStage = createBasicOnboardingStage({
          title: "Super Using",
          iconClass: "fas fa-flask",
          backgroundColor: "aquamarine"
        });

        console.log({ newOnboardingStage });
        console.log({ defaultOnboardingMessages });

        extendedOnboardingMessages[0].onboardingStage = newOnboardingStage;        // Overwrite existing one?
        
        // Add new messages
        extendedOnboardingMessages.push(createBasicOnboardingMessage({
          text: "This is the newly added onboarding message for the bar chart. It's absolutely positioned.",
          title: "Absolutely positioned message",
          onboardingStage: newOnboardingStage,
          anchor: {
            coords: {
              x: 250,
              y: 250,
            }
          }
        }));
        
        extendedOnboardingMessages.push(createBasicOnboardingMessage({
          text: "This is the newly added onboarding message for the bar chart. It's attached to a selector.",
          title: "Selector attached message",
          onboardingStage: newOnboardingStage,
          anchor: {
            sel: ".infolayer .ytitle"
          }
        }));

        extendedOnboardingMessages.push(createBasicOnboardingMessage({
          text: "This is the newly added onboarding message for the bar chart. It's attached to an element.",
          title: "Element attached message",
          onboardingStage: newOnboardingStage,
          anchor: {
            element: document.getElementsByClassName("xtitle")[0]
          }
        }));

        console.log({ extendedOnboardingMessages });
        console.log("Onboarding Stages: ", getOnboardingStages());

        
        // ======================================
        //           ⚠️ NEW - End ⚠️
        // ======================================

        const ahoiConfig = {
          onboardingMessages: extendedOnboardingMessages,
        };

        onboardingUI = await ahoi(
          EVisualizationType.BAR_CHART,
          chart,
          ahoiConfig
        );
      } else {
        onboardingUI?.removeOnboarding();
      }
    });
  }

  static unpack(rows, key) {
    return rows.map((row) => row[key]);
  }
}
