/**
 * Retries a request five times each second. If every request fails, throw an error and notify the user with an alert.
 */
async function retryLoop(url, requestData) {
  for (let i = 0; i < 5; i++) {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(requestData)
    })

    if (response.status == 200) {
      return response;
    } else if (response.status != 200 && i == 4) {
      alert("Ein Server ist momentan nicht erreichbar. Bitte versuchen Sie es in wenigen Minuten erneut.")
      throw new Error("Endpoint " + url + " not reachable"); 
    }
    await new Promise(r => setTimeout(r, 1000));
  }
}

async function diff() {
  let firstInput = document.getElementById("firstInput").value;
  let finalTranslation = document.getElementById("finalTranslation").value;
  let response = await retryLoop("https://wandering-butterfly-623.fly.dev/diff", {"text1": firstInput, "text2": finalTranslation})
  const difference = await response.json();
  document.getElementById("result").innerText = "Die Texte haben eine Übereinstimmung von ~" + Math.round(difference.message * 100) + "%";
}

async function onClickTranslate(language, inputElement, outputElement, runSpinner) {
  if (runSpinner) {
    document.getElementById("translate-text").hidden = true;
    document.getElementById("translate-spinner").hidden = false;
  }

  let firstInput = document.getElementById(inputElement).value;
  let response = await retryLoop("https://white-fog-528.fly.dev/translate_from_" + language, {"text": firstInput})
  const translation = await response.json();
  document.getElementById(outputElement).value = translation.message;
    if (runSpinner) {
    document.getElementById("translate-text").hidden = false;
    document.getElementById("translate-spinner").hidden = true;
  }
}

async function translateAndDiff() {
  document.getElementById("translate-optimized-text").hidden = true;
  document.getElementById("translate-optimized-spinner").hidden = false;

  await onClickTranslate('german', 'optimization', 'finalTranslation', false); 
  await diff();

  document.getElementById("translate-optimized-text").hidden = false;
  document.getElementById("translate-optimized-spinner").hidden = true;
}

async function onClickOptimize() {
  document.getElementById("optimize-text").hidden = true;
  document.getElementById("optimize-spinner").hidden = false;

  let toOptimize = document.getElementById("translation").value;
  let response = await retryLoop("https://snowy-lake-749.fly.dev/optimize", {"text": toOptimize})
  const optimization = await response.json();
  document.getElementById("optimization").value = optimization.message;

  document.getElementById("optimize-text").hidden = false;
  document.getElementById("optimize-spinner").hidden = true;
}