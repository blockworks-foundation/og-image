import { IncomingMessage } from "http";
import { parse } from "url";
import { ParsedRequest, Theme } from "./types";

export function parseRequest(req: IncomingMessage) {
  console.log("HTTP " + req.url);
  const { pathname, query } = parse(req.url || "/", true);
  const {
    fontSize,
    images,
    market,
    pnl,
    avgEntry,
    markPrice,
    widths,
    heights,
    theme,
    md,
  } = query || {};

  if (Array.isArray(fontSize)) {
    throw new Error("Expected a single fontSize");
  }
  if (Array.isArray(theme)) {
    throw new Error("Expected a single theme");
  }

  const arr = (pathname || "/").slice(1).split(".");
  let extension = "";
  let side = "";
  if (arr.length === 0) {
    side = "";
  } else if (arr.length === 1) {
    side = arr[0];
  } else {
    extension = arr.pop() as string;
    side = arr.join(".");
  }

  const parsedMarket = Array.isArray(market) ? market[0] : market;
  const parsedPnl = Array.isArray(pnl) ? pnl[0] : pnl;
  const parsedAvgEntry = Array.isArray(avgEntry) ? avgEntry[0] : avgEntry;
  const parsedMarkPrice = Array.isArray(markPrice) ? markPrice[0] : markPrice;

  const parsedRequest: ParsedRequest = {
    fileType: extension === "jpeg" ? extension : "png",
    market: decodeURIComponent(parsedMarket!),
    pnl: decodeURIComponent(parsedPnl!),
    avgEntry: decodeURIComponent(parsedAvgEntry!),
    markPrice: decodeURIComponent(parsedMarkPrice!),
    side: decodeURIComponent(side),
    theme: theme === "dark" ? "dark" : "light",
    md: md === "1" || md === "true",
    fontSize: fontSize || "96px",
    images: getArray(images),
    widths: getArray(widths),
    heights: getArray(heights),
  };
  parsedRequest.images = getDefaultImages(
    parsedRequest.images,
    parsedRequest.theme
  );
  return parsedRequest;
}

function getArray(stringOrArray: string[] | string | undefined): string[] {
  if (typeof stringOrArray === "undefined") {
    return [];
  } else if (Array.isArray(stringOrArray)) {
    return stringOrArray;
  } else {
    return [stringOrArray];
  }
}

function getDefaultImages(images: string[], theme: Theme): string[] {
  const defaultImage =
    theme === "light"
      ? "https://trade.mango.markets/assets/icons/logo.svg"
      : "https://trade.mango.markets/assets/icons/logo.svg";

  if (!images || !images[0]) {
    return [defaultImage];
  }
  if (
    !images[0].startsWith("https://assets.vercel.com/") &&
    !images[0].startsWith("https://assets.zeit.co/")
  ) {
    images[0] = defaultImage;
  }
  return images;
}
