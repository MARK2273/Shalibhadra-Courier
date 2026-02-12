export const numberToWords = (num: number): string => {
  if (num === 0) return "Zero Only";

  const a = [
    "",
    "One ",
    "Two ",
    "Three ",
    "Four ",
    "Five ",
    "Six ",
    "Seven ",
    "Eight ",
    "Nine ",
    "Ten ",
    "Eleven ",
    "Twelve ",
    "Thirteen ",
    "Fourteen ",
    "Fifteen ",
    "Sixteen ",
    "Seventeen ",
    "Eighteen ",
    "Nineteen ",
  ];
  const b = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  const inWords = (n: number): string => {
    if ((n = n.toString() as any).length > 9) return "overflow";
    const n_array = ("000000000" + n)
      .substr(-9)
      .match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n_array) return "";

    let str = "";
    str +=
      Number(n_array[1]) !== 0
        ? (a[Number(n_array[1])] ||
            b[parseInt(n_array[1][0])] + " " + a[parseInt(n_array[1][1])]) +
          "Crore "
        : "";
    str +=
      Number(n_array[2]) !== 0
        ? (a[Number(n_array[2])] ||
            b[parseInt(n_array[2][0])] + " " + a[parseInt(n_array[2][1])]) +
          "Lakh "
        : "";
    str +=
      Number(n_array[3]) !== 0
        ? (a[Number(n_array[3])] ||
            b[parseInt(n_array[3][0])] + " " + a[parseInt(n_array[3][1])]) +
          "Thousand "
        : "";
    str +=
      Number(n_array[4]) !== 0
        ? (a[Number(n_array[4])] ||
            b[parseInt(n_array[4][0])] + " " + a[parseInt(n_array[4][1])]) +
          "Hundred "
        : "";
    str +=
      Number(n_array[5]) !== 0
        ? (str !== "" ? "and " : "") +
          (a[Number(n_array[5])] ||
            b[parseInt(n_array[5][0])] + " " + a[parseInt(n_array[5][1])])
        : "";

    return str;
  };

  return inWords(num).trim();
};
