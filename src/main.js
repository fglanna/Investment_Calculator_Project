import { generateReturnArray } from "../investmentGoals";
import { createTable } from "./table";
import {
  Chart,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
  BarController,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

Chart.register(
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
  BarController,
  CategoryScale,
  LinearScale,
  BarElement
);

const finalMoneyChart = document.getElementById("final-money-distribution");
const progressionChart = document.getElementById("progression");
const form = document.getElementById("investment-form");
const clearFormButton = document.getElementById("clear-form");

let doughnutChartReference = {};
let progressionChartReference = {};

const columnsArray = [
  { columnLabel: "Month", accessor: "month" },
  {
    columnLabel: "Total Invested",
    accessor: "investedAmount",
    format: (numberInfo) => formatCurrency(numberInfo),
  },
  {
    columnLabel: "Montly Income",
    accessor: "interestReturns",
    format: (numberInfo) => formatCurrency(numberInfo),
  },
  {
    columnLabel: "Total Income",
    accessor: "totalInterestReturns",
    format: (numberInfo) => formatCurrency(numberInfo),
  },
  {
    columnLabel: "Total Amount",
    accessor: "totalAmount",
    format: (numberInfo) => formatCurrency(numberInfo),
  },
];

function formatCurrency(value) {
  return value.toLocaleString("pt-br", { style: "currency", currency: "BRL" });
}

function renderProgression(evt) {
  evt.preventDefault();
  if (document.querySelector(".error")) {
    return;
  }

  resetCharts();

  const startingAmount = Number(
    document.getElementById("starting-amount").value.replace(",", ".")
  );
  const additionalContribution = Number(
    document.getElementById("additional-contribution").value.replace(",", ".")
  );
  const after = Number(document.getElementById("after").value);
  const periodAfter = document.getElementById("period-after").value;
  const returnRate = Number(
    document.getElementById("return-rate").value.replace(",", ".")
  );
  const returnRatePeriod = document.getElementById("evaluation-period").value;
  const taxRate = Number(
    document.getElementById("tax-rate").value.replace(",", ".")
  );

  const returnsArray = generateReturnArray(
    startingAmount,
    after,
    periodAfter,
    additionalContribution,
    returnRate,
    returnRatePeriod
  );

  /*const finalInvestmentObject = returnsArray[returnsArray.length - 1];
  
  if (finalMoneyChart) {
    doughnutChartReference = new Chart(finalMoneyChart, {
      type: "doughnut",
      data: {
        labels: ["Total invested", "Yield", "Tax"],
        datasets: [
          {
            data: [
              formatCurrency(finalInvestmentObject.investedAmount),
              formatCurrency(
                finalInvestmentObject.totalInterestReturns * (1 - taxRate / 100)
              ),
              formatCurrency(
                finalInvestmentObject.totalInterestReturns * (taxRate / 100)
              ),
            ],
            backgroundColor: [
              "rgb(255, 99, 132)",
              "rgb(54, 162, 235)",
              "rgb(255, 205, 86)",
            ],
            hoverOffset: 4,
          },
        ],
      },
    });
  } else {
    console.error("Could`n get context from finalMoneyChart");
  }

  if (progressionChart) {
    progressionChartReference = new Chart(progressionChart, {
      type: "bar",
      data: {
        labels: returnsArray.map((investmentObject) => investmentObject.month),
        datasets: [
          {
            label: "Total invested",
            data: returnsArray.map((investmentObject) =>
              formatCurrency(investmentObject.investedAmount)
            ),
            backgroundColor: "rgb(255, 99, 132)", 
          },
          {
            label: "Return on investment",
            data: returnsArray.map((investmentObject) => {
              return formatCurrency(investmentObject.interestReturns);
            }),
            backgroundColor: "rgb(54, 162, 235)" 
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
          },
        },
      },
    });
  } else {
    console.error("Could`n get context from progressionChart");
  }*/

  createTable(columnsArray, returnsArray, "results-table");
}

function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0;
}

function resetCharts() {
  if (
    !isObjectEmpty(doughnutChartReference) &&
    !isObjectEmpty(progressionChartReference)
  ) {
    doughnutChartReference.destroy();
    progressionChartReference.destroy();
  }
}

function clearForm() {
  form["starting-amount"].value = "";
  form["additional-contribution"].value = "";
  form["after"].value = "";
  form["return-rate"].value = "";
  form["tax-rate"].value = "";

  resetCharts();

  const errorInputsContainers = document.querySelectorAll(".error");

  for (const errorInputsContainer of errorInputsContainers) {
    errorInputsContainer.classList.remove("error");
    errorInputsContainer.parentElement.querySelector("p").remove();
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
    Number(inputValue) <= 0
  ) {
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

form.addEventListener("submit", renderProgression);
clearFormButton.addEventListener("click", clearForm);
