function gstCalculatorReport(data) {
  return data.reduce(
    (acc, item) => {
      acc.CGST += Number(item.cgst) || 0;
      acc.SGST += Number(item.sgst) || 0;
      return acc;
    },
    { CGST: 0, SGST: 0 }
  );
}

// Wrap reduce result with rounding
function gstCalculatorReportRounded(data) {
  const result = gstCalculatorReport(data);
  return {
    CGST: Math.round(result.CGST),
    SGST: Math.round(result.SGST),
  };
}

export default gstCalculatorReportRounded;
