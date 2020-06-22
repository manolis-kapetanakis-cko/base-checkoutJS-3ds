const backButton = document.querySelector(".back");
const payWithToken = token => {
  let url = window.origin;
  http(
    {
      method: "POST",
      route: "/payWithToken",
      body: { token: token, url: url }
    },
    data => {
      console.log("API RESPONSE: ", data);
      console.log(data._links.redirect.href);
      window.location = data._links.redirect.href;
    }
  );
};

const refreshPage = function() {
  document.querySelectorAll(".whDiv_body").forEach(el => el.remove());
  Checkout.open();
};
// Utility function to send HTTP calls to our back-end API
const http = ({ method, route, body }, callback) => {
  let requestData = {
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  };

  if (method.toLocaleLowerCase() === "get") {
    delete requestData.body;
  }

  // Timeout after 10 seconds
  timeout(10000, fetch(`${window.location.origin}${route}`, requestData))
    .then(res => res.json())
    .then(data => callback(data))
    .catch(er => (er.innerHTML = "Connection timed out"));
};

// For connection timeout error handling
const timeout = (ms, promise) => {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      reject(new Error("Connection timeout"));
    }, ms);
    promise.then(resolve, reject);
  });
};

// Socket part so we can handle webhooks:
var socket = io();
socket.on("webhook", webhookBody => {
  console.log(webhookBody.type);
  let ckoWidget = document.getElementById("cko-widget");

  let tempWebhook = webhookBody.type.replace("_", " ");

  let newWH = document.createElement("div");
  newWH.classList.add("whDiv_body");

  //   // WEBHOOK div
  let newWHDiv = document.createElement("div");
  newWHDiv.innerHTML = "WEBHOOK";
  newWHDiv.classList.add("wh_div");
  newWH.appendChild(newWHDiv);

  //   // Payment type div
  let newPTDiv = document.createElement("div");
  newPTDiv.innerHTML = tempWebhook;
  newPTDiv.classList.add("pt_div");
  newWH.appendChild(newPTDiv);

  ckoWidget.append(newWH);

  newWH.classList.add("show");
});
