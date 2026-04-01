import { createLovableConfig } from "lovable-agent-playwright-config/config";

export default createLovableConfig({
  timeout: 30000,
  use: {
    baseURL: "https://ossalt.jp",
    viewport: { width: 390, height: 844 }, // iPhone 14 size
  },
});
