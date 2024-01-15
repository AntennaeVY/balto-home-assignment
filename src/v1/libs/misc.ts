import dotenv from "dotenv";

export function loadEnvironmentVariables(envPath: string) {
	dotenv.config({
    path: envPath,
  });
}
