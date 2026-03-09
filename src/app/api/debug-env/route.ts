import { NextResponse } from "next/server";

export async function GET() {
  const envKeys = Object.keys(process.env).sort();
  const vaniKeys = envKeys.filter(key => key.startsWith("VANI_") || key.includes("AWS") || key.includes("SECRET"));
  
  // Masked values for safety
  const debugInfo = vaniKeys.map(key => {
    const value = process.env[key];
    return {
      key,
      present: !!value,
      length: value ? value.length : 0,
      prefix: value ? value.substring(0, 4) : "N/A"
    };
  });

  return NextResponse.json({
    message: "Environment Variable Diagnostic",
    foundKeys: debugInfo,
    nodeVersion: process.version,
    platform: process.platform
  });
}
