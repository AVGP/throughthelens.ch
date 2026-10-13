module.exports = function(eleventyConfig) {
  // Copy static assets to output (CSS is bundled by src/assets/css/bundle.11ty.js)
  eleventyConfig.addPassthroughCopy("src/assets/images");
  eleventyConfig.addPassthroughCopy("src/assets/documents");
  eleventyConfig.addPassthroughCopy("src/assets/js");
  eleventyConfig.addWatchTarget("src/assets/css/");

  // Offerings shown on the homepage, sorted by `order` in their front matter
  eleventyConfig.addCollection("offerings", (collectionApi) =>
    collectionApi
      .getFilteredByGlob("src/content/offerings/*.md")
      .sort((a, b) => (a.data.order || 0) - (b.data.order || 0))
  );

  // Render a Markdown string (used for inline Markdown inside shortcodes/front matter)
  const md = require("markdown-it")({ html: true });
  eleventyConfig.addFilter("md", (str = "") => md.render(String(str)));
  eleventyConfig.addFilter("mdInline", (str = "") => md.renderInline(String(str)));

  // --- Content shortcodes (used in Markdown pages like tfp.md) ---

  // Wrap a group of steps:  {% timeline %} ... {% endtimeline %}
  eleventyConfig.addPairedShortcode("timeline", (content) =>
    `<div class="tfp-timeline reveal-on-scroll">${content}</div>`
  );

  // A numbered step:  {% step "01", "Before the Shoot" %} text {% endstep %}
  eleventyConfig.addPairedShortcode("step", (content, number, title) =>
    `<div class="timeline-step">
  <div class="step-badge">${number}</div>
  <h3>${title}</h3>
  ${md.render(content.trim()).trim()}
</div>`
  );

  // Two-column card grid:  {% cards %} ... {% endcards %}
  eleventyConfig.addPairedShortcode("cards", (content) =>
    `<div class="prep-grid">${content}</div>`
  );

  // A card:  {% card "Title", "Subtitle", "extra-class" %} markdown {% endcard %}
  eleventyConfig.addPairedShortcode("card", (content, title, subtitle = "", cls = "") =>
    `<div class="prep-card ${cls} reveal-on-scroll">
  <h3>${title}</h3>
  ${subtitle ? `<p class="prep-card-subtitle">${subtitle}</p>` : ""}
  ${md.render(content.trim()).trim()}
</div>`
  );

  // Checklist: a Markdown bullet list rendered with check icons
  eleventyConfig.addPairedShortcode("checklist", (content) => {
    const items = content
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.startsWith("- "))
      .map((l) => `<li>
  <span class="check-icon">✓</span>
  <div>${md.renderInline(l.slice(2))}</div>
</li>`);
    return `<ul class="styled-checklist">${items.join("\n")}</ul>`;
  });

  // Download button:  {% download "/path/file.pdf", "Label" %}
  eleventyConfig.addShortcode("download", (href, label) =>
    `<div class="download-action">
  <a href="${href}" download class="btn btn-primary btn-download">
    <span class="btn-icon">⬇</span> ${label}
  </a>
</div>`
  );

  // Call-to-action block:  {% cta "Heading", "Button text", "/#contact", "Creative: TfP Collaboration" %} text {% endcta %}
  eleventyConfig.addPairedShortcode("cta", (content, heading, button, href, prefill = "") =>
    `<div class="tfp-cta-container reveal-on-scroll">
  <h2>${heading}</h2>
  ${md.render(content.trim()).trim()}
  <a href="${href}" class="btn btn-secondary btn-large"${prefill ? ` onclick="localStorage.setItem('prefillPackage', '${prefill}')"` : ""}>${button}</a>
</div>`
  );

  return {
    markdownTemplateEngine: "njk",
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    }
  };
};
