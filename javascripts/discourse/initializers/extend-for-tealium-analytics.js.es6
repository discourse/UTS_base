import { withPluginApi } from "discourse/lib/plugin-api";
import loadScript from "discourse/lib/load-script";

export default {
  name: "extend-for-analytics",
  after: "inject-objects",
  initialize(container) {
    withPluginApi("0.8.7", api => {
      // get tracking id from theme settings
      window.gciAnalyticsUAID = settings.Tealium_analytics_id;

      // load tracking script on initial page view
      loadScript("https://www.gannett-cdn.com/dc/gciAnalytics.js");

      // update data on page transitions
      let appEvents = container.lookup("service:app-events");

      appEvents.on("page:changed", data => {
        if (typeof utag !== "undefined") {
          if (!data.replacedOnlyQueryParams) {
            utag.track(data);

            // debug
            // utag.db_log.push(data);
            // console.log(utag);
          }
        }
      });
    });
  }
};
