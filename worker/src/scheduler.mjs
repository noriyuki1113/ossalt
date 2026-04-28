import cron from "node-cron";
import { discoverGitHub } from "./jobs/discover-github.mjs";
import { discoverHN } from "./jobs/discover-hn.mjs";
import { requestIndex } from "./jobs/request-index.mjs";
import { generateDrafts } from "./jobs/generate-drafts.mjs";

console.log("ossalt-worker started");

// 毎日09:00 JST — GitHub・HN からOSS候補収集
cron.schedule("0 0 * * *", async () => {       // UTC 0:00 = JST 9:00
  console.log("[cron] discover start");
  await discoverGitHub();
  await discoverHN();
}, { timezone: "UTC" });

// 毎日06:00 JST — 新ツールページをGoogleにインデックス要求
cron.schedule("0 21 * * *", async () => {      // UTC 21:00 = JST 6:00
  console.log("[cron] index-request start");
  await requestIndex();
}, { timezone: "UTC" });

// 火・金 10:00 JST — SNS下書き生成
cron.schedule("0 1 * * 2,5", async () => {    // UTC 1:00 = JST 10:00
  console.log("[cron] generate-drafts start");
  await generateDrafts();
}, { timezone: "UTC" });

// プロセス維持
process.on("SIGTERM", () => {
  console.log("ossalt-worker stopping");
  process.exit(0);
});
