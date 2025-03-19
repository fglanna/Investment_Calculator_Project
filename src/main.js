import { generateReturnArray } from "../investmentGoals";

const form = document.getElementById("investment-form");
const clearFormButton = document.getElementById('clear-form')

function renderProgression(evt) {
  evt.preventDefault();
  if (document.querySelector("error")) {
    return;
  }
  const startingAmountString = form["starting-amount"].value.replace(",", ".");
  const startingAmount = Number(startingAmountString);
  const additionalContributionString = document
    .getElementById("additional-contribution")
    .value.replace(",", ".");
  const additionalContribution = Number(additionalContributionString);
  const after = Number(document.getElementById("after").value);
  const periodAfter = document.getElementById("period-after").value;
  const returnRateString = document
    .getElementById("return-rate")
    .value.replace(",", ".");
  const returnRate = Number(returnRateString);
  const returnRatePeriod = document.getElementById("evaluation-period").value;
  const taxRateString = document
    .getElementById("tax-rate")
    .value.replace(",", ".");
  const taxRate = Number(taxRateString);

  const returnsArray = generateReturnArray(
    startingAmount,
    additionalContribution,
    after,
    periodAfter,
    returnRate,
    returnRatePeriod
  );

  console.log(returnsArray);
}

function clearForm() {
  form['starting-amount'].value = ""
  form['additional-contribution'].value = ""
  form['after'].value = ""
  form['return-rate'].value = ""
  form['tax-rate'].value = ""

  const errorInputsContainers = document.querySelectorAll('.error');

  for(const errorInputsContainer of errorInputsContainers) {
    errorInputsContainer.classList.remove('error')
    errorInputsContainer.parentElement.querySelector('p').remove()
  }
  
  
}

function validateInput(evt) {
  if (evt.target.value === "") {
    return;
  }

  const { parentElement } = evt.target;
  const grandParentElement = evt.target.parentElement.parentElement;
  const inputValue = evt.target.value.replace(",", ".");
  if (
    (!parentElement.classList.contains("error") && isNaN(inputValue)) ||
    Number(inputValue) <= 0) {
    const errorTextElement = document.createElement("p");
    errorTextElement.classList.add("text-red-500");
    errorTextElement.innerText = "Enter a numeric value greater than zero.";

    parentElement.classList.add("error");
    grandParentElement.appendChild(errorTextElement);
  } else if (
    parentElement.classList.contains("error") &&
    !isNaN(inputValue) &&
    Number(inputValue) > 0
  ) {
    parentElement.classList.remove("error");
    grandParentElement.querySelector("p").remove();
  }
}
for (const formElement of form) {
  if (formElement.tagName === "INPUT" && formElement.hasAttribute("name"))
    formElement.addEventListener("blur", validateInput);
}

form.addEventListener("submit", renderProgression)
clearFormButton.addEventListener('click', clearForm)
