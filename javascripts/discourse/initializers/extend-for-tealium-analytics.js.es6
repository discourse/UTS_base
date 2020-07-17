import { withPluginApi } from "discourse/lib/plugin-api";
import loadScript from "discourse/lib/load-script";
import { scheduleOnce } from "@ember/runloop";

export default {
  name: "extend-for-analytics",
  after: "inject-objects",
  initialize(container) {
    withPluginApi("0.8.7", api => {
      // get tracking id from theme settings
      window.gciAnalyticsUAID = settings.Tealium_analytics_id;
      window.gciAnalyticsLoadEvents = false;

      let appEvents = container.lookup("service:app-events");

      loadScript("https://www.gannett-cdn.com/dcjs/prod/main.js").then(() => {
        window.gciAnalytics.view({
          "event-type": "pageview"
        });

        // debug for initial page load
        // console.log(window.gciData);

        api.onPageChange(() => {
          window.gciAnalytics.view({
            "event-type": "pageview"
          });

          // debug for in-app page views
          // console.log(window.gciData);
        });
      });
    });
  }
};
