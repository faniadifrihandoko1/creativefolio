import { definePlugin } from "sanity";
import { DashboardIcon } from "@sanity/icons";
import { DashboardTool } from "./DashboardTool";

/** Custom tool Dashboard — landing page /studio yang ramah. */
export const dashboardTool = definePlugin({
  name: "dashboard",
  tools: [
    {
      name: "dashboard",
      title: "Dashboard",
      icon: DashboardIcon,
      component: DashboardTool,
    },
  ],
});
