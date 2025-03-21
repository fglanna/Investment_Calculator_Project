function convertToMonthlyReturnRate(yearlyReturnRate) {
  return yearlyReturnRate ** (1 / 12);
}

export function generateReturnArray(
  startingAmount = 0,
  after = 0,
  periodAfter = "monthly",
  additionalContribution = 0,
  returnRate = 0,
  returnTimeFrame = "monthly"
) {
  if (
    typeof startingAmount !== "number" ||
    startingAmount <= 0 ||
    typeof after !== "number" ||
    after <= 0
  ) {
    throw new Error(
      "Initial investment and deadline must be filled with positive values."
    );
  }

  const finalReturnRate =
    returnTimeFrame === "monthly"
      ? 1 + returnRate / 100 / 12
      : convertToMonthlyReturnRate(1 + returnRate / 100);

  const finalTimeHorizon =
    periodAfter === "monthly" ? after : after * 12;

  const referenceInvestmentObject = {
    investedAmount: startingAmount,
    interestReturns: 0,
    totalInterestReturns: 0,
    month: 0,
    totalAmount: startingAmount,
  };

  const returnsArray = [referenceInvestmentObject];
  let previousTotalAmount = startingAmount;
  for (
    let timeReference = 1;
    timeReference <= finalTimeHorizon;
    timeReference++
  ) {
    const totalAmount =
      returnsArray[timeReference - 1].totalAmount * finalReturnRate +
      additionalContribution;
    const interestReturns =
      returnsArray[timeReference - 1].totalAmount * (finalReturnRate - 1);
    const investedAmount = startingAmount + additionalContribution * timeReference;
    const totalInterestReturns = totalAmount - investedAmount;

    returnsArray.push({
      investedAmount,
      interestReturns,
      totalInterestReturns,
      month: timeReference,
      totalAmount,
    });
    previousTotalAmount = totalAmount;
  }
  return returnsArray;
}
