import { generateReturnArray } from "../investmentGoals";

const form = document.getElementById("investment-form");

function renderProgression(evt) {
  evt.preventDefault();
  const startingAmount = Number(form["starting-amount"].value);
  const additionalContribution = Number(
    document.getElementById("additional-contribution").value
  );
  const after = Number(document.getElementById("after").value);
  const periodAfter = document.getElementById("period-after").value;
  const returnRate = Number(document.getElementById("return-rate").value);
  const returnRatePeriod = document.getElementById("evaluation-period").value;
  const taxRate = Number(document.getElementById("tax-rate").value);

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

form.addEventListener("submit", renderProgression);
