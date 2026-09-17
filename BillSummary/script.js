document.addEventListener("DOMContentLoaded", function () {

  const shopNameInput = document.getElementById("shopName");
  const itemsContainer = document.getElementById("itemsContainer");
  const addItemBtn = document.getElementById("addItemBtn");
  const generateBillBtn = document.getElementById("generateBillBtn");
  const totalAmount = document.getElementById("totalAmount");

  const billPreview = document.getElementById("billPreview");
  const previewContent = document.getElementById("previewContent");

  const whatsappBtn = document.getElementById("whatsappBtn");
  const resetBtn = document.getElementById("resetBtn");


  /* -----------------------------
     ADD ITEM ROW
  ----------------------------- */

  function addRow() {

    const row = document.createElement("div");

    row.className = "item-row";

    row.innerHTML = `
      <input
        type="text"
        class="item-name"
        placeholder="Service / Item"
      >

      <input
        type="number"
        class="price-input"
        placeholder="Price"
        min="0"
        step="1"
        inputmode="numeric"
      >

      <button
        type="button"
        class="delete-btn"
        title="Remove item"
      >
        ×
      </button>
    `;

    itemsContainer.appendChild(row);

    const priceInput = row.querySelector(".price-input");
    const deleteBtn = row.querySelector(".delete-btn");

    priceInput.addEventListener("input", calculateTotal);

    deleteBtn.addEventListener("click", function () {

      const rows = itemsContainer.querySelectorAll(".item-row");

      if (rows.length > 1) {
        row.remove();
        calculateTotal();
      } else {
        row.querySelector(".item-name").value = "";
        row.querySelector(".price-input").value = "";
        calculateTotal();
      }

    });
  }


  /* -----------------------------
     CALCULATE TOTAL
  ----------------------------- */

  function calculateTotal() {

    const prices = itemsContainer.querySelectorAll(".price-input");

    let total = 0;

    prices.forEach(function (input) {

      const value = Number(input.value);

      if (!isNaN(value) && value > 0) {
        total += value;
      }

    });

    totalAmount.textContent = formatAmount(total);
  }


  /* -----------------------------
     FORMAT MONEY
  ----------------------------- */

  function formatAmount(amount) {

    return "₹" + Number(amount).toLocaleString("en-IN");
  }


  /* -----------------------------
     GET BILL ITEMS
  ----------------------------- */

  function getBillItems() {

    const rows = itemsContainer.querySelectorAll(".item-row");

    const items = [];

    rows.forEach(function (row) {

      const name =
        row.querySelector(".item-name").value.trim();

      const price =
        Number(row.querySelector(".price-input").value);

      if (name && !isNaN(price) && price >= 0) {

        items.push({
          name: name,
          price: price
        });

      }

    });

    return items;
  }


  /* -----------------------------
     GENERATE BILL
  ----------------------------- */

  generateBillBtn.addEventListener("click", function () {

    const shopName =
      shopNameInput.value.trim();

    const items =
      getBillItems();

    if (!shopName) {

      alert("Please enter the shop name.");

      shopNameInput.focus();

      return;
    }


    if (items.length === 0) {

      alert("Please add at least one service or item with a price.");

      return;
    }


    let total = 0;

    items.forEach(function (item) {
      total += item.price;
    });


    let html = `
      <div class="preview-shop">
        ${escapeHtml(shopName)}
      </div>
    `;


    items.forEach(function (item) {

      html += `
        <div class="preview-row">
          <span>${escapeHtml(item.name)}</span>
          <span>${formatAmount(item.price)}</span>
        </div>
      `;

    });


    html += `
      <div class="preview-total">
        <span>Total</span>
        <span>${formatAmount(total)}</span>
      </div>
    `;


    previewContent.innerHTML = html;

    billPreview.classList.remove("hidden");

    billPreview.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

  });


  /* -----------------------------
     WHATSAPP SHARE
  ----------------------------- */

  whatsappBtn.addEventListener("click", function () {

    const shopName =
      shopNameInput.value.trim();

    const items =
      getBillItems();

    if (!shopName || items.length === 0) {
      return;
    }


    let total = 0;

    let message =
      "🧾 *Bill Summary*\n\n";

    message +=
      "*" + shopName + "*\n\n";


    items.forEach(function (item) {

      message +=
        item.name +
        " - " +
        formatAmount(item.price) +
        "\n";

      total += item.price;

    });


    message +=
      "\n*Total: " +
      formatAmount(total) +
      "*";


    message +=
      "\n\n🌱 Digital Bill Summary";


    const whatsappUrl =
      "https://wa.me/?text=" +
      encodeURIComponent(message);


    window.open(
      whatsappUrl,
      "_blank"
    );

  });


  /* -----------------------------
     RESET
  ----------------------------- */

  resetBtn.addEventListener("click", function () {

    shopNameInput.value = "";

    itemsContainer.innerHTML = "";

    for (let i = 0; i < 5; i++) {
      addRow();
    }

    calculateTotal();

    previewContent.innerHTML = "";

    billPreview.classList.add("hidden");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  });


  /* -----------------------------
     ESCAPE HTML
  ----------------------------- */

  function escapeHtml(value) {

    const div = document.createElement("div");

    div.textContent = value;

    return div.innerHTML;
  }


  /* -----------------------------
     INITIAL 5 ROWS
  ----------------------------- */

  for (let i = 0; i < 5; i++) {
    addRow();
  }

  calculateTotal();

});
