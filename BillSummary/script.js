/* ==========================================
   SARVYANTA GO GREEN
   DIGITAL BILL GENERATOR
========================================== */


/* =========================
   SHOW BILLING FORM
========================= */

function showBillingForm() {

  const section = document.getElementById("billingSection");

  section.classList.remove("hidden");

  setTimeout(function () {
    section.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }, 100);
}


/* =========================
   ADD NEW ROW
========================= */

function addRow() {

  const tbody = document.getElementById("billBody");

  const row = document.createElement("tr");

  row.innerHTML = `
    <td>
      <input
        type="text"
        class="service"
        placeholder="Service / Item"
      >
    </td>

    <td>
      <input
        type="number"
        class="price"
        placeholder="0"
        min="0"
        step="1"
        oninput="calculateTotal()"
      >
    </td>

    <td>
      <button
        type="button"
        class="delete-btn"
        onclick="removeRow(this)">
        ×
      </button>
    </td>
  `;

  tbody.appendChild(row);
}


/* =========================
   REMOVE ROW
========================= */

function removeRow(button) {

  const tbody = document.getElementById("billBody");

  const rows = tbody.querySelectorAll("tr");

  /*
   * Keep at least one row available.
   */
  if (rows.length <= 1) {

    rows[0]
      .querySelector(".service")
      .value = "";

    rows[0]
      .querySelector(".price")
      .value = "";

    calculateTotal();

    return;
  }

  button.closest("tr").remove();

  calculateTotal();
}


/* =========================
   CALCULATE TOTAL
========================= */

function calculateTotal() {

  const prices = document.querySelectorAll(".price");

  let total = 0;

  prices.forEach(function (input) {

    let value = parseFloat(input.value);

    if (!isNaN(value) && value > 0) {
      total += value;
    }

  });

  document.getElementById("totalAmount").textContent =
    formatAmount(total);
}


/* =========================
   FORMAT NUMBER
========================= */

function formatAmount(amount) {

  return Number(amount).toLocaleString("en-IN", {
    maximumFractionDigits: 0
  });
}


/* =========================
   GENERATE BILL
========================= */

function generateBill() {

  const shopName =
    document.getElementById("shopName").value.trim();

  if (!shopName) {

    alert("Please enter the shop name.");

    document.getElementById("shopName").focus();

    return;
  }


  const rows =
    document.querySelectorAll("#billBody tr");

  const items = [];

  let total = 0;


  rows.forEach(function (row) {

    const serviceInput =
      row.querySelector(".service");

    const priceInput =
      row.querySelector(".price");

    if (!serviceInput || !priceInput) {
      return;
    }

    const service =
      serviceInput.value.trim();

    const price =
      parseFloat(priceInput.value);


    if (
      service !== "" &&
      !isNaN(price) &&
      price >= 0
    ) {

      items.push({
        service: service,
        price: price
      });

      total += price;
    }

  });


  if (items.length === 0) {

    alert(
      "Please enter at least one service/item with a price."
    );

    return;
  }


  /* =========================
     PREVIEW
  ========================= */

  document.getElementById(
    "previewShopName"
  ).textContent = shopName;


  const previewItems =
    document.getElementById("previewItems");

  previewItems.innerHTML = "";


  items.forEach(function (item) {

    const div =
      document.createElement("div");

    div.className = "preview-item";

    div.innerHTML = `
      <span>${escapeHtml(item.service)}</span>
      <strong>₹${formatAmount(item.price)}</strong>
    `;

    previewItems.appendChild(div);

  });


  document.getElementById(
    "previewTotal"
  ).textContent = formatAmount(total);


  document.getElementById(
    "billPreview"
  ).classList.remove("hidden");


  document.getElementById(
    "whatsappBtn"
  ).classList.remove("hidden");


  document.getElementById(
    "billPreview"
  ).scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}


/* =========================
   WHATSAPP SHARE
========================= */

function shareWhatsApp() {

  const shopName =
    document.getElementById("shopName").value.trim();

  const rows =
    document.querySelectorAll("#billBody tr");

  let message =
    "🧾 *Digital Bill*\n\n";

  message +=
    "*Shop:* " + shopName + "\n\n";

  let total = 0;

  let hasItems = false;


  rows.forEach(function (row) {

    const serviceInput =
      row.querySelector(".service");

    const priceInput =
      row.querySelector(".price");

    if (!serviceInput || !priceInput) {
      return;
    }

    const service =
      serviceInput.value.trim();

    const price =
      parseFloat(priceInput.value);


    if (
      service !== "" &&
      !isNaN(price) &&
      price >= 0
    ) {

      hasItems = true;

      message +=
        "• " +
        service +
        " – ₹" +
        formatAmount(price) +
        "\n";

      total += price;
    }

  });


  if (!hasItems) {

    alert("Please generate a bill first.");

    return;
  }


  message +=
    "\n*Total: ₹" +
    formatAmount(total) +
    "*";


  message +=
    "\n\n🌱 Digital bill created using Sarvyanta Go Green.";


  const whatsappUrl =
    "https://wa.me/?text=" +
    encodeURIComponent(message);


  window.open(
    whatsappUrl,
    "_blank"
  );
}


/* =========================
   RESET BILL
========================= */

function resetBill() {

  const confirmed =
    confirm(
      "Clear this bill and start again?"
    );

  if (!confirmed) {
    return;
  }


  document.getElementById(
    "shopName"
  ).value = "";


  const tbody =
    document.getElementById("billBody");


  /*
   * Keep exactly 5 initial rows.
   */

  tbody.innerHTML = "";


  for (let i = 0; i < 5; i++) {

    const row =
      document.createElement("tr");

    row.innerHTML = `
      <td>
        <input
          type="text"
          class="service"
          placeholder="Service / Item"
        >
      </td>

      <td>
        <input
          type="number"
          class="price"
          placeholder="0"
          min="0"
          step="1"
          oninput="calculateTotal()"
        >
      </td>

      <td>
        <button
          type="button"
          class="delete-btn"
          onclick="removeRow(this)">
          ×
        </button>
      </td>
    `;

    tbody.appendChild(row);
  }


  document.getElementById(
    "totalAmount"
  ).textContent = "0";


  document.getElementById(
    "billPreview"
  ).classList.add("hidden");


  document.getElementById(
    "whatsappBtn"
  ).classList.add("hidden");


  document.getElementById(
    "billingSection"
  ).scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}


/* =========================
   BASIC HTML ESCAPING
========================= */

function escapeHtml(value) {

  const div =
    document.createElement("div");

  div.textContent = value;

  return div.innerHTML;
}
