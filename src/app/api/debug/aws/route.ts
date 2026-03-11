import { NextResponse } from "next/server";

export async function GET() {
  // Only reveal names and partial values for debugging
  const envVars = Object.keys(process.env)
    .filter(key => key.includes("VANI_AWS") || key.includes("AWS_"))
    .reduce((acc: any, key) => {
      const val = process.env[key] || "";
      acc[key] = {
        length: val.length,
        prefix: val.substring(0, 4),
        suffix: val.substring(val.length - 2),
        hasTrailingSpace: val.endsWith(" "),
        hasLeadingSpace: val.startsWith(" "),
      };
      return acc;
    }, {});

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    environment: envVars,
    allKeys: Object.keys(process.env).sort(), // Reveal all keys for debugging
    nodeVersion: process.version,
    platform: process.platform,
  });
}
