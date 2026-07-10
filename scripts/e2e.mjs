import { spawnSync } from "node:child_process"

const projectName = "patch-pigeon-e2e"
const managedBaseUrl = "http://127.0.0.1:3100"
const externalBaseUrl = process.env.E2E_BASE_URL
const composeFiles = ["-f", "compose.yaml", "-f", "compose.e2e.yaml"]
const composeEnvironment = {
  ...process.env,
  POSTGRES_DB: "patchpigeon_e2e",
  POSTGRES_USER: "patchpigeon_e2e",
  POSTGRES_PASSWORD: "patchpigeon-e2e-only",
  DATABASE_URL: "postgresql://patchpigeon_e2e:patchpigeon-e2e-only@database:5432/patchpigeon_e2e",
  AUTH_SECRET: "patchpigeon-e2e-auth-secret-not-for-production",
  APP_URL: managedBaseUrl,
  APP_BIND: "127.0.0.1",
  APP_PORT: "3100",
  E2E_BASE_URL: managedBaseUrl,
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: process.cwd(),
    env: options.env ?? process.env,
    stdio: "inherit",
  })

  if (result.error) throw result.error
  if (result.signal) throw new Error(`${command} was terminated by ${result.signal}`)
  return result.status ?? 1
}

function compose(args, allowFailure = false) {
  const status = run(
    "docker",
    ["compose", ...composeFiles, "--project-name", projectName, ...args],
    { env: composeEnvironment },
  )
  if (status !== 0 && !allowFailure) {
    throw new Error(`docker compose ${args.join(" ")} failed with exit code ${status}`)
  }
  return status
}

function runPlaywright(baseUrl) {
  const pnpmExecutable = process.env.npm_execpath
  if (!pnpmExecutable) {
    throw new Error("Run the E2E wrapper through pnpm so it can locate the Playwright CLI")
  }
  const playwrightArgs = process.argv.slice(2)
  if (playwrightArgs[0] === "--") playwrightArgs.shift()

  return run(
    process.execPath,
    [pnpmExecutable, "exec", "playwright", "test", ...playwrightArgs],
    { env: { ...process.env, E2E_BASE_URL: baseUrl } },
  )
}

if (externalBaseUrl) {
  process.exitCode = runPlaywright(externalBaseUrl)
} else {
  let managedStackTouched = false
  try {
    compose(["down", "--volumes", "--remove-orphans"], true)
    managedStackTouched = true
    compose(["up", "--detach", "--build", "--wait"])
    process.exitCode = runPlaywright(managedBaseUrl)
  } finally {
    if (managedStackTouched && process.env.E2E_KEEP_STACK !== "1") {
      compose(["down", "--volumes", "--remove-orphans"], true)
    }
  }
}
