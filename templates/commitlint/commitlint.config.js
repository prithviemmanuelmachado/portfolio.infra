// Shared commit-message policy for all portfolio repos.
//
// - Type prefix (feat/fix/...) comes from @commitlint/config-conventional —
//   the same type set semantic-release's default commit-analyzer reads to
//   decide whether/how to bump a version.
// - `issue-ref-required` additionally requires a GitHub closing keyword
//   (Fixes/Closes/Resolves #N) somewhere in the commit message, so every
//   commit both drives versioning and links back to the issue it's for.
//
// Copy this file into a consumer repo's root as `commitlint.config.js`.

const issueRefPattern = /\b(?:close[sd]?|fix(?:e[sd])?|resolve[sd]?)\s+#\d+/i;

module.exports = {
  extends: ["@commitlint/config-conventional"],
  plugins: [
    {
      rules: {
        "issue-ref-required": (parsed) => {
          const message =
            parsed.raw ||
            [parsed.header, parsed.body, parsed.footer].filter(Boolean).join("\n");
          return [
            issueRefPattern.test(message),
            'commit message must reference an issue with a closing keyword, e.g. "Fixes #12", "Closes #12", or "Resolves #12"',
          ];
        },
      },
    },
  ],
  rules: {
    "issue-ref-required": [2, "always"],
  },
};
