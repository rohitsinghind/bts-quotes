import "./style.css";
import quotes from "./quotes";

const GRADIENTS = [
  "linear-gradient(to left, #b6fbff, #83a4d4)",
  "linear-gradient(to right, #f64f59, #c471ed, #12c2e9)",
  "linear-gradient(to right, #8dccf0, #2f80e7, #2980b9)",
  "linear-gradient(to bottom, #ec008c, #fc6767)",
  "linear-gradient(to bottom, #cc2b5e, #753a88)",
  "linear-gradient(to bottom, #2193b0, #6dd5ed)",
  "linear-gradient(to bottom, #77a1d3, #79cbca, #e684ae)",
  "linear-gradient(to bottom, #ff6e7f, #bfe9ff)",
  "linear-gradient(to bottom, #ede574, #e1f5c4)",
  "linear-gradient(to bottom, #02aab0, #00cdac)",
  "linear-gradient(to bottom, #da22ff, #9733ee)",
  "linear-gradient(to bottom, #cc95c0, #dbd4b4, #7aa1d2)",
  "linear-gradient(to bottom, #f4c4f3, #fc67fa)",
  "linear-gradient(to bottom, #a770ef, #cf8bf3, #fdb99b)",
  "linear-gradient(to bottom, #ef32d9, #89fffd)",
  "linear-gradient(to bottom, #800080, #ffc0cb)",
  "linear-gradient(to bottom, #d9a7c7, #fffcdc)",
];

const $body = document.querySelector("body");
const $newQuote = document.querySelector("#new-quote");
const $image = document.querySelector("#image");
const $share = document.querySelector("#share");

applyRandomGradient($body);
applyRandomQuote();

function applyRandomGradient(el) {
  const randomGradient =
    GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)];
  el.style.background = randomGradient;
}

function applyRandomQuote() {
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  const $quote = document.querySelector("#quote");
  const $member = document.querySelector("#member");
  $quote.innerText = randomQuote.quote;
  $member.innerText = `- ${randomQuote.member}`;
}

function getNearestDimensions(node) {
  const DIMENSIONS_AVAILABLE = [1280, 1920];
  const HEIGHT = {
    1280: 720,
    1920: 1080,
  };
  const { width } = node.getBoundingClientRect();
  const nearestDimension = DIMENSIONS_AVAILABLE.reduce((acc, curr) => {
    return Math.abs(curr - width) < Math.abs(acc - width) ? curr : acc;
  });
  return { width: nearestDimension, height: HEIGHT[nearestDimension] };
}

async function downloadImage() {
  const domtoimage = (await import("dom-to-image")).default;
  const $container = document.querySelector("#quote-container");
  const dataUrl = await domtoimage.toJpeg($container, {
    style: {
      fontSize: "1.5em",
      boxSizing: "border-box",
    },
  });
  const link = document.createElement("a");
  link.download = "quote.jpg";
  link.href = dataUrl;
  link.click();
}

$newQuote.addEventListener("click", async () => {
  applyRandomQuote();
  applyRandomGradient($body);
});

const A11yDialog = (await import("a11y-dialog")).default;
const container = document.querySelector("#my-dialog");
const dialog = new A11yDialog(container);

dialog.on("show", function (dialogEl) {
  let aspectRatio = 1;

  const $quote = document.querySelector("#quote");
  const $member = document.querySelector("#member");
  dialogEl.querySelector("#quote-container").style.background =
    $body.style.background;
  dialogEl.querySelector("#quote-container-text").innerText = $quote.innerText;
  dialogEl.querySelector("#quote-container-member").innerText =
    $member.innerText;

  Array.from(dialogEl.querySelectorAll(".image-controls button")).forEach(
    (button) => {
      button.addEventListener("click", async ({ currentTarget }) => {
        currentTarget.classList.add("active");
        // Remove active class from other buttons
        Array.from(currentTarget.parentElement.children).forEach((button) => {
          if (button !== currentTarget) {
            button.classList.remove("active");
          }
        });
        if (Object.keys(currentTarget.dataset).includes("ratio")) {
          aspectRatio = currentTarget.dataset.ratio;
        }
        if (Object.keys(currentTarget.dataset).includes("download")) {
          downloadImage();
        }
        dialogEl.querySelector("#quote-container").style.aspectRatio =
          aspectRatio;
      });
    }
  );
});

$share.addEventListener("click", async () => {
  const quote = document.querySelector("#quote");
  const text = quote.innerText;
  const title = document.title;
  const url = location.href;
  const data = {
    title,
    text,
    url,
  };
  try {
    await navigator.share(data);
  } catch (error) {
    console.error(error);
  }
});
