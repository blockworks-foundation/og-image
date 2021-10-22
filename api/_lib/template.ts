import marked from "marked";
import { sanitizeHtml } from "./sanitizer";
import { ParsedRequest } from "./types";

function getCss(side: string, pnl: string) {
  const pnlColor = parseFloat(pnl) >= 0 ? "#AFD803" : "#E54033";
  const sideColor = side.toLowerCase() === "long" ? "#AFD803" : "#E54033";
  return `
    body {
        background: #141026;
        background-size: 100px 100px;
        color: white;
        font-family: 'Lato', sans-serif;
        height: 100vh;
        padding: 120px 256px;
    }

    code {
        color: #D400FF;
        white-space: pre-wrap;
        letter-spacing: -5px;
    }

    code:before, code:after {
        content: '\`';
    }

    .logo-wrapper {
        display: flex;
        align-items: center;
        align-content: center;
        justify-content: center;
        justify-items: center;
    }

    .logo {
        margin: 0 75px;
    }

    .plus {
        color: #BBB;
        font-family: Times New Roman, Verdana;
        font-size: 100px;
    }

    .spacer {
        margin: 150px;
    }

    .side-market {
        display: flex;
        font-size: 40px;
        align-items: center;
        justify-content: center;
        padding: 40px 40px 24px;
    }

    .side {
        color: ${sideColor};
        padding: 0px 24px;
    }

    .divider {
        color: rgba(255,255,255,0.5);
        margin-bottom: 8px;
    }

    .market {
        padding: 0px 24px;
    }

    .pnl {
        border: 4px ${pnlColor} solid;
        border-radius: 24px;
        color: ${pnlColor};
        display: flex;
        font-size: 140px;
        font-weight: bold;
        height: 240px;
        align-items: center;
        justify-content: center;
    }
    
    .trade-details-wrapper {
        display: flex;
        justify-content: space-between;
        padding: 0px 200px;
    }

    .trade-details {
        font-size: 56px;
        font-weight: bold;
        line-height: 0.5;
        padding: 100px;
    }
    
    .label {
        color: rgba(255,255,255,0.5);
        font-size: 40px;
        font-weight: normal;
    }`;
}

export function getHtml(parsedReq: ParsedRequest) {
  const {
    market,
    side,
    pnl,
    avgEntry,
    markPrice,
    md,
    images,
    widths,
    heights,
  } = parsedReq;
  return `<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;900&display=swap" rel="stylesheet">
    <style>
        ${getCss(side, pnl)}
    </style>
    <body>
        <div>
            <div class="logo-wrapper">
                ${images
                  .map(
                    (img, i) =>
                      getPlusSign(i) + getImage(img, widths[i], heights[i])
                  )
                  .join("")}
            </div>
            <div class="side-market"><span class="side">${
              md ? marked(side.toUpperCase()) : sanitizeHtml(side.toUpperCase())
            }</span>
            <span class="divider">|</span>
            <span class="market">${
              md ? marked(market) : sanitizeHtml(market)
            }</span>
            </div>
            <div class="pnl">${md ? marked(`${pnl}%`) : sanitizeHtml(`${pnl}%`)}
            </div>
            <div class="trade-details-wrapper">
                <div class="trade-details">
                    <div class="label">Avg Entry Price</div>
                    <div>${
                      md
                        ? marked(`$${parseFloat(avgEntry).toLocaleString()}`)
                        : sanitizeHtml(
                            `$${parseFloat(avgEntry).toLocaleString()}`
                          )
                    }
                    </div>
                </div>
                <div class="trade-details">
                    <div class="label">Mark Price</div>
                    <div>${
                      md
                        ? marked(`$${parseFloat(markPrice).toLocaleString()}`)
                        : sanitizeHtml(
                            `$${parseFloat(markPrice).toLocaleString()}`
                          )
                    }
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>`;
}

function getImage(src: string, width = "auto", height = "204") {
  return `<img
        class="logo"
        alt="Generated Image"
        src="${sanitizeHtml(src)}"
        width="${sanitizeHtml(width)}"
        height="${sanitizeHtml(height)}"
    />`;
}

function getPlusSign(i: number) {
  return i === 0 ? "" : '<div class="plus">+</div>';
}
