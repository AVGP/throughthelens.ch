// Bundles the theme and component stylesheets into a single /assets/css/main.css
// (one request, no @import waterfall). Order matters — it's the cascade order.
const fs = require("fs");
const path = require("path");

const FILES = [
  "theme.css",                    // 🎨 design tokens: colors, fonts, shadows
  "base.css",                     // reset, typography, layout helpers, buttons
  "components/header.css",
  "components/hero.css",
  "components/packages.css",
  "components/instagram.css",
  "components/booking-form.css",
  "components/footer.css",
  "components/animations.css",
  "responsive.css",
  "components/tfp.css",
];

module.exports = class {
  data() {
    return { permalink: "/assets/css/main.css", eleventyExcludeFromCollections: true };
  }
  render() {
    return FILES.map((f) => fs.readFileSync(path.join(__dirname, f), "utf8")).join("");
  }
};
