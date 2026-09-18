import "cesium/Build/Cesium/Widgets/widgets.css";
import Sandcastle from "Sandcastle";
import { Ion } from "cesium";

window.CESIUM_BASE_URL = "/cesiumStatic/";

const ionToken = import.meta.env.VITE_CESIUM_ION_TOKEN;
if (ionToken) {
  Ion.defaultAccessToken = ionToken;
}

const htmlModules = import.meta.glob("../Class/*/index.html", {
  query: "?raw",
  import: "default",
});
const jsModules = import.meta.glob("../Class/*/main.js");

const params = new URLSearchParams(location.search);
const sample = params.get("sample") || "hello-world";
const htmlKey = `../Class/${sample}/index.html`;
const jsKey = `../Class/${sample}/main.js`;
const root = document.getElementById("sample-root");

if (!htmlModules[htmlKey] || !jsModules[jsKey]) {
  document.body.classList.remove("sandcastle-loading");
  root.innerHTML = `<div id="loadingOverlay" style="display:block"><h1>Sample not found: ${sample}</h1></div>`;
} else {
  root.innerHTML = await htmlModules[htmlKey]();
  document.title = sample;
  await jsModules[jsKey]();
  try {
    Sandcastle.finishedLoading();
  } catch (error) {
    console.error(error);
    document.body.classList.remove("sandcastle-loading");
  }
}
