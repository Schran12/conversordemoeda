const country_list = {

  AED: "AE",
  AFN: "AF",
  XCD: "AG",
  ALL: "AL",
  AMD: "AM",
  ANG: "AN",
  AOA: "AO",
  AQD: "AQ",
  ARS: "AR",
  AUD: "AU",
  AZN: "AZ",
  BAM: "BA",
  BBD: "BB",
  BDT: "BD",
  XOF: "BE",
  BGN: "BG",
  BHD: "BH",
  BIF: "BI",
  BMD: "BM",
  BND: "BN",
  BOB: "BO",
  BRL: "BR",
  BSD: "BS",
  NOK: "BV",
  BWP: "BW",
  BYR: "BY",
  BZD: "BZ",
  CAD: "CA",
  CDF: "CD",
  XAF: "CF",
  CHF: "CH",
  CLP: "CL",
  CNY: "CN",
  COP: "CO",
  CRC: "CR",
  CUP: "CU",
  CVE: "CV",
  CYP: "CY",
  CZK: "CZ",
  DJF: "DJ",
  DKK: "DK",
  DOP: "DO",
  DZD: "DZ",
  ECS: "EC",
  EEK: "EE",
  EGP: "EG",
  ETB: "ET",
  EUR: "EU",  // Corrigido para EU (para bandeira europeia)
  FJD: "FJ",
  FKP: "FK",
  GBP: "GB",
  GEL: "GE",
  GGP: "GG",
  GHS: "GH",
  GIP: "GI",
  GMD: "GM",
  GNF: "GN",
  GTQ: "GT",
  GYD: "GY",
  HKD: "HK",
  HNL: "HN",
  HRK: "HR",
  HTG: "HT",
  HUF: "HU",
  IDR: "ID",
  ILS: "IL",
  INR: "IN",
  IQD: "IQ",
  IRR: "IR",
  ISK: "IS",
  JMD: "JM",
  JOD: "JO",
  JPY: "JP",
  KES: "KE",
  KGS: "KG",
  KHR: "KH",
  KMF: "KM",
  KPW: "KP",
  KRW: "KR",
  KWD: "KW",
  KYD: "KY",
  KZT: "KZ",
  LAK: "LA",
  LBP: "LB",
  LKR: "LK",
  LRD: "LR",
  LSL: "LS",
  LTL: "LT",
  LVL: "LV",
  LYD: "LY",
  MAD: "MA",
  MDL: "MD",
  MGA: "MG",
  MKD: "MK",
  MMK: "MM",
  MNT: "MN",
  MOP: "MO",
  MRO: "MR",
  MTL: "MT",
  MUR: "MU",
  MVR: "MV",
  MWK: "MW",
  MXN: "MX",
  MYR: "MY",
  MZN: "MZ",
  NAD: "NA",
  XPF: "NC",
  NGN: "NG",
  NIO: "NI",
  NPR: "NP",
  NZD: "NZ",
  OMR: "OM",
  PAB: "PA",
  PEN: "PE",
  PGK: "PG",
  PHP: "PH",
  PKR: "PK",
  PLN: "PL",
  PYG: "PY",
  QAR: "QA",
  RON: "RO",
  RSD: "RS",
  RUB: "RU",
  RWF: "RW",
  SAR: "SA",
  SBD: "SB",
  SCR: "SC",
  SDG: "SD",
  SEK: "SE",
  SGD: "SG",
  SKK: "SK",
  SLL: "SL",
  SOS: "SO",
  SRD: "SR",
  STD: "ST",
  SVC: "SV",
  SYP: "SY",
  SZL: "SZ",
  THB: "TH",
  TJS: "TJ",
  TMT: "TM",
  TND: "TN",
  TOP: "TO",
  TRY: "TR",
  TTD: "TT",
  TWD: "TW",
  TZS: "TZ",
  UAH: "UA",
  UGX: "UG",
  USD: "US",
  UYU: "UY",
  UZS: "UZ",
  VEF: "VE",
  VND: "VN",
  VUV: "VU",
  YER: "YE",
  ZAR: "ZA",
  ZMK: "ZM",
  ZWD: "ZW"
};

const apiKey = "e759f92560e41c99ee6213a2";

const fromCurrency = document.querySelector("#from-currency"),
  toCurrency = document.querySelector("#to-currency"),
  amountInput = document.querySelector("#amount"),
  exchangeRateTxt = document.querySelector(".buscando-cotacao"),
  getButton = document.querySelector("form button"),
  fromFlag = document.querySelector(".from img"),
  toFlag = document.querySelector(".to img"),
  exchangeIcon = document.querySelector("form .icon");

function populateSelects() {
  const dropList = [fromCurrency, toCurrency];

  dropList.forEach((select, i) => {
    for (let currency_code in country_list) {
      let selected = "";
      if (i === 0 && currency_code === "BRL") selected = "selected";
      if (i === 1 && currency_code === "USD") selected = "selected";

      const optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
      select.insertAdjacentHTML("beforeend", optionTag);
    }
  });
}

function loadFlag(element) {
  const code = element.value;
  if (country_list[code]) {
    if (element === fromCurrency) {
      fromFlag.src = `https://flagcdn.com/48x36/${country_list[code].toLowerCase()}.png`;
    } else {
      toFlag.src = `https://flagcdn.com/48x36/${country_list[code].toLowerCase()}.png`;
    }
  }
}

amountInput.addEventListener("input", () => {
  let value = amountInput.value;
  value = value.replace(/[^0-9.]/g, "");
  const parts = value.split(".");
  if (parts.length > 2) {
    value = parts[0] + "." + parts.slice(1).join("");
  }
  amountInput.value = value;
});

async function getExchangeRate() {
  let amountVal = amountInput.value.trim();
  if (amountVal === "" || amountVal === "0") {
    amountVal = "1";
    amountInput.value = amountVal;
  }

  exchangeRateTxt.innerText = "Buscando cotação...";

  const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency.value}`;

  try {
    const response = await fetch(url);
    const result = await response.json();

    // O valor correto para sucesso da API é "success" em inglês
    if (result.result === "success" || result.result === "Sucesso") {
      const exchangeRate = result.conversion_rates[toCurrency.value];
      if (!exchangeRate) {
        exchangeRateTxt.innerText = "Moeda inválida para conversão";
        return;
      }
      const totalExRate = (amountVal * exchangeRate).toFixed(2);
      exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value} = ${totalExRate} ${toCurrency.value}`;
    } else {
      exchangeRateTxt.innerText = "Erro na busca da cotação";
    }
  } catch (error) {
    exchangeRateTxt.innerText = "Algo deu errado ao buscar a cotação";
  }
}

window.addEventListener("load", () => {
  populateSelects();
  loadFlag(fromCurrency);
  loadFlag(toCurrency);
  getExchangeRate();
});

fromCurrency.addEventListener("change", () => {
  loadFlag(fromCurrency);
});
toCurrency.addEventListener("change", () => {
  loadFlag(toCurrency);
});

getButton.addEventListener("click", (e) => {
  e.preventDefault();
  getExchangeRate();
});

exchangeIcon.addEventListener("click", () => {
  const tempCode = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = tempCode;

  loadFlag(fromCurrency);
  loadFlag(toCurrency);
  getExchangeRate();
});

const bg = document.querySelector('.background-image');
const windowWidth = window.innerWidth / 5;
const windowHeight = window.innerHeight / 5 ;

bg.addEventListener('mousemove', (e) => {
  const mouseX = e.clientX / windowWidth;
  const mouseY = e.clientY / windowHeight;
  
  bg.style.transform = `translate3d(-${mouseX}%, -${mouseY}%, 0)`;
});

