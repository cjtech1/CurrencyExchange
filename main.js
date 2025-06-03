import allCurrencyCodes from "./currencyCodes.js";

const to_list = document.getElementById("to-inputs");
const from_list = document.getElementById("from-inputs");
const submitButton = document.querySelector("#submit-btn");
const input = document.querySelector("#input-container");
const textField = document.querySelector(".result-amt");
const resultSet = document.querySelector(".result");
const exchangeIcon = document.querySelector(".exchange-icon");

resultSet.style.display = "none";
let base;

const populateDropdown = (
  selectElement,
  currencyCodes,
  defaultCurrency = null
) => {
  currencyCodes.forEach((currency) => {
    let option = document.createElement("option");
    option.value = currency;
    option.text = currency;
    if (defaultCurrency && currency === defaultCurrency) {
      option.selected = true;
    }
    selectElement.add(option);
  });
};

// Populate dropdowns with default values
populateDropdown(from_list, allCurrencyCodes, "USD");
populateDropdown(to_list, allCurrencyCodes, "EUR");

async function getValue() {
  try {
    const baseValue = from_list.value.toLowerCase();
    const convertValue = to_list.value.toLowerCase();
    const url = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${baseValue}.json`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    const baseRate = data[baseValue][convertValue];
    return baseRate;
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    textField.innerText = "Error fetching rates";
    resultSet.style.display = "block";
    return null;
  }
}

function setDynamicRate() {
  if (base && input.value) {
    const amount = base * parseFloat(input.value);
    if (!isNaN(amount)) {
      resultSet.style.display = "block";

      const fromCurrency = from_list.value;
      const toCurrency = to_list.value;

      textField.innerHTML = `${toCurrency} ${amount.toFixed(2)}`;

      const resultLabel = document.querySelector(".result-label");
      resultLabel.innerHTML = `${input.value} ${fromCurrency} = `;
    }
  }
}

submitButton.addEventListener("click", async () => {
  if (!input.value || input.value <= 0) {
    alert("Please enter a valid amount");
    return;
  }

  submitButton.innerHTML =
    '<i class="fas fa-spinner fa-spin"></i> Converting...';
  submitButton.disabled = true;

  base = await getValue();

  submitButton.innerHTML = '<i class="fas fa-sync-alt"></i> CONVERT';
  submitButton.disabled = false;

  setDynamicRate();
});

input.addEventListener("input", () => {
  if (base) {
    setDynamicRate();
  }
});

exchangeIcon.addEventListener("click", async () => {
  const tempCurrency = from_list.value;
  from_list.value = to_list.value;
  to_list.value = tempCurrency;

  if (input.value) {
    base = await getValue();
    setDynamicRate();
  }
});
