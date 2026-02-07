import { execSync } from "child_process";
import { join } from "path";

const ROOT = join(__dirname, "..");

function run(cmd: string, opts?: { cwd?: string }) {
  console.log(`$ ${cmd}`);
  execSync(cmd, { cwd: opts?.cwd ?? ROOT, stdio: "inherit" });
}

const commands: Record<string, () => void> = {
  dev: () => run("npm run dev"),
  build: () => {
    run("npm run build");
    console.log("\nBuild succeeded.");
  },
  deploy: () => {
    run("git add -A");
    run('git commit -m "deploy: update"');
    run("git push");
    console.log("\nPushed. Vercel auto-deploys.");
  },
  scrape: () => run("npx tsx scripts/scrape-wines.ts", { cwd: ROOT }),
  check: () => {
    run("npx next lint");
    run("npx tsc --noEmit");
    run("npm run build");
    console.log("\nAll checks passed.");
  },
  help: () => {
    console.log(`
Vino12 CLI

Commands:
  dev      Start dev server
  build    Production build
  deploy   Git push (auto-deploy via Vercel)
  scrape   Download wine images
  check    Lint + typecheck + build
  help     Show this help
    `);
  },
};

const cmd = process.argv[2] || "help";
const handler = commands[cmd];

if (!handler) {
  console.error(`Unknown command: ${cmd}`);
  commands.help();
  process.exit(1);
}

handler();
