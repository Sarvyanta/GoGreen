document.addEventListener("DOMContentLoaded", function () {

  const itemsTable = document.getElementById("itemsTable");
  const addItemBtn = document.getElementById("addItemBtn");
  const generateBillBtn = document.getElementById("generateBillBtn");
  const totalAmount = document.getElementById("totalAmount");

  const billPreview = document.getElementById("billPreview");
  const previewContent = document.getElementById("previewContent");

  const whatsappBtn = document.getElementById("whatsappBtn");
  const downloadBtn = document.getElementById("downloadBtn");
  const resetBtn = document.getElementById("resetBtn");

  const shopNameInput = document.getElementById("shopName");


  /* =========================
     CREATE ITEM ROW
  ========================== */

  function createItemRow() {

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>
        <input
          type="text"
          class="item-name"
          placeholder="Service / Item"
        >
      </td>

      <td>
        <input
          type="number"
          class="price-input"
          placeholder="0"
          min="0"
          step="0.01"
          inputmode="decimal"
        >
      </td>

      <td class="remove-cell">
        <button
          type="button"
          class="remove-btn"
          aria-label="Remove item"
        >
          ×
        </button>
      </td>
    `;


    /* Price change */

    const priceInput = row.querySelector(".price-input");

    priceInput.addEventListener("input", calculateTotal);


    /* Remove row */

    const removeBtn = row.querySelector(".remove-btn");

    removeBtn.addEventListener("click", function () {

      row.remove();

      calculateTotal();

    });


    itemsTable.appendChild(row);

  }



  /* =========================
     INITIAL 5 ROWS
  ========================== */

  for (let i = 0; i < 5; i++) {
    createItemRow();
  }



  /* =========================
     ADD ITEM
  ========================== */

  addItemBtn.addEventListener("click", function () {

    createItemRow();

    calculateTotal();

  });



  /* =========================
     CALCULATE TOTAL
  ========================== */

  function calculateTotal() {

    const prices = document.querySelectorAll(".price-input");

    let total = 0;

    prices.forEach(function (input) {

      const value = parseFloat(input.value);

      if (!isNaN(value)) {
        total += value;
      }

    });


    totalAmount.textContent =
      "₹" + total.toFixed(2);

  }



  /* =========================
     GET BILL ITEMS
  ========================== */

  function getItems() {

    const rows = document.querySelectorAll("#itemsTable tr");

    const items = [];

    rows.forEach(function (row) {

      const itemInput =
        row.querySelector(".item-name");

      const priceInput =
        row.querySelector(".price-input");


      const item =
        itemInput ? itemInput.value.trim() : "";

      const price =
        priceInput ? parseFloat(priceInput.value) : 0;


      if (item || (!isNaN(price) && price > 0)) {

        items.push({
          item: item || "Item",
          price: isNaN(price) ? 0 : price
        });

      }

    });


    return items;

  }



  /* =========================
     GENERATE BILL
  ========================== */

  generateBillBtn.addEventListener("click", function () {

    const shopName =
      shopNameInput.value.trim() || "My Shop";

    const items = getItems();


    if (items.length === 0) {

      alert("Please enter at least one service or item.");

      return;

    }


    let total = 0;

    items.forEach(function (entry) {
      total += entry.price;
    });


    let html = `

      <div class="preview-shop">
        ${escapeHtml(shopName)}
      </div>

      <div class="preview-date">
        ${new Date().toLocaleDateString("en-IN")}
      </div>

      <div class="preview-table">

        <div class="preview-row preview-header">

          <span>
            Service / Item
          </span>

          <span>
            Price
          </span>

        </div>

    `;


    items.forEach(function (entry) {

      html += `

        <div class="preview-row">

          <span>
            ${escapeHtml(entry.item)}
          </span>

          <span>
            ₹${entry.price.toFixed(2)}
          </span>

        </div>

      `;

    });


    html += `

        <div class="preview-total">

          <span>
            Total
          </span>

          <strong>
            ₹${total.toFixed(2)}
          </strong>

        </div>

      </div>

    `;


    previewContent.innerHTML = html;

    billPreview.classList.remove("hidden");

    billPreview.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });


    /* Analytics */

    if (typeof gtag === "function") {

      gtag("event", "generate_bill", {
        event_category: "Go Green",
        event_label: "Digital Bill Summary"
      });

    }

  });



  /* =========================
     WHATSAPP SHARE
  ========================== */

  whatsappBtn.addEventListener("click", function () {

    const shopName =
      shopNameInput.value.trim() || "My Shop";

    const items = getItems();


    if (items.length === 0) {

      alert("Please generate a bill first.");

      return;

    }


    let total = 0;

    let message =
      "🧾 *Bill Summary*\n\n";

    message +=
      "*" + shopName + "*\n\n";


    items.forEach(function (entry) {

      total += entry.price;

      message +=
        entry.item +
        " - ₹" +
        entry.price.toFixed(2) +
        "\n";

    });


    message +=
      "\n*Total: ₹" +
      total.toFixed(2) +
      "*";


    message +=
      "\n\n🌱 Sarvyanta Go Green";


    const whatsappUrl =
      "https://wa.me/?text=" +
      encodeURIComponent(message);


    window.open(
      whatsappUrl,
      "_blank"
    );


    /* Analytics */

    if (typeof gtag === "function") {

      gtag("event", "share_whatsapp", {
        event_category: "Go Green",
        event_label: "Digital Bill Summary"
      });

    }

  });



  /* =========================
     DOWNLOAD PDF
  ========================== */

  downloadBtn.addEventListener("click", function () {

    const items = getItems();


    if (items.length === 0) {

      alert("Please generate a bill first.");

      return;

    }


    /* Check jsPDF */

    if (
      !window.jspdf ||
      !window.jspdf.jsPDF
    ) {

      alert(
        "PDF library could not be loaded. Please check your internet connection and try again."
      );

      return;

    }


    const {
      jsPDF
    } = window.jspdf;


    const doc = new jsPDF();


    const shopName =
      shopNameInput.value.trim() || "My Shop";


    let total = 0;


    /* =========================
       PDF HEADER
    ========================== */

    doc.setFontSize(18);

    doc.text(
      "Bill Summary",
      20,
      20
    );


    doc.setFontSize(11);

    doc.text(
      "SARVYANTA - Go Green",
      20,
      30
    );


    doc.text(
      "Shop: " + shopName,
      20,
      40
    );


    doc.text(
      "Date: " +
      new Date().toLocaleDateString("en-IN"),
      20,
      48
    );


    /* =========================
       TABLE HEADER
    ========================== */

    doc.setFontSize(11);

    doc.text(
      "Service / Item",
      20,
      62
    );


    doc.text(
      "Price",
      150,
      62
    );


    doc.line(
      20,
      65,
      190,
      65
    );


    /* =========================
       ITEMS
    ========================== */

    let y = 75;


    items.forEach(function (entry) {

      total += entry.price;


      /*
        IMPORTANT:
        Use "Rs." instead of "₹"
        because the default jsPDF font
        does not reliably support the
        Indian Rupee Unicode character.
      */

      const priceText =
        "Rs. " +
        entry.price.toFixed(2);


      /* Keep long item names inside PDF */

      const itemText =
        doc.splitTextToSize(
          entry.item,
          115
        );


      doc.text(
        itemText,
        20,
        y
      );


      doc.text(
        priceText,
        150,
        y
      );


      y +=
        Math.max(
          8,
          itemText.length * 6
        );


      /* New page if required */

      if (y > 270) {

        doc.addPage();

        y = 20;

      }

    });


    /* =========================
       TOTAL
    ========================== */

    doc.line(
      20,
      y,
      190,
      y
    );


    y += 10;


    doc.setFontSize(13);


    doc.text(
      "Total",
      20,
      y
    );


    doc.text(
      "Rs. " + total.toFixed(2),
      150,
      y
    );


    /* =========================
       FOOTER
    ========================== */

    y += 20;


    doc.setFontSize(9);


    doc.text(
      "🌱 Sarvyanta Go Green",
      20,
      y
    );


    doc.text(
      "Building an Intelligent World",
      20,
      y + 7
    );


    /* =========================
       SAVE PDF
    ========================== */

    const safeShopName =
      shopName
        .replace(/[^a-z0-9]/gi, "_")
        .substring(0, 50);


    doc.save(
      safeShopName +
      "_Bill_Summary.pdf"
    );


    /* Analytics */

    if (typeof gtag === "function") {

      gtag("event", "download_bill", {
        event_category: "Go Green",
        event_label: "Digital Bill Summary PDF"
      });

    }

  });



  /* =========================
     RESET
  ========================== */

  resetBtn.addEventListener("click", function () {

    shopNameInput.value = "";

    itemsTable.innerHTML = "";


    for (let i = 0; i < 5; i++) {

      createItemRow();

    }


    calculateTotal();


    previewContent.innerHTML = "";

    billPreview.classList.add("hidden");


    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });


    /* Analytics */

    if (typeof gtag === "function") {

      gtag("event", "reset_bill", {
        event_category: "Go Green",
        event_label: "Digital Bill Summary"
      });

    }

  });



  /* =========================
     ESCAPE HTML
  ========================== */

  function escapeHtml(value) {

    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  }



  /* =========================
     INITIAL TOTAL
  ========================== */

  calculateTotal();

});
