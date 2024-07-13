// script.js

// Sample data storage (can be replaced with localStorage or backend API calls)
let itemsData = JSON.parse(localStorage.getItem('itemsData')) || [];
let customersData = JSON.parse(localStorage.getItem('customersData')) || [];
let sellsData = JSON.parse(localStorage.getItem('sellsData')) || [];
let receiptsData = JSON.parse(localStorage.getItem('receiptsData')) || [];

// DOM elements
const tabs = document.querySelectorAll('.tab');
const sidenav = document.querySelector('.sidenav');
const viewModal = document.getElementById('viewModal');
const modalItemName = document.getElementById('modalItemName');
const modalItemColor = document.getElementById('modalItemColor');
const meterList = document.getElementById('meterList');
const purchaseModal = document.getElementById('purchaseModal');
const purchaseDetails = document.getElementById('purchaseDetails');

// Initialize event listeners and default views
document.addEventListener('DOMContentLoaded', () => {
    // Add event listeners
    document.querySelectorAll('.sidenav a').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.getAttribute('href').substring(1); // Get tab name from href
            openTab(tabName);
        });
    });

    document.getElementById('itemForm').addEventListener('submit', addItem);
    document.getElementById('customerForm').addEventListener('submit', addCustomer);
    document.getElementById('sellForm').addEventListener('submit', addSell);

    initializeApp(); // Call initialize function to set up initial data
});

// Function to open a specific tab
function openTab(tabName) {
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(tabName).classList.add('active');

    if (tabName === 'sells') {
        populateCustomerSelect();
        populateItemDatalist();
    }
}

// Function to toggle side navigation open/close
function openNav() {
    sidenav.style.width = "200px";
}

function closeNav() {
    sidenav.style.width = "0";
}

// Function to clear local storage for all tabs
function clearStorage() {
    if (confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
        localStorage.removeItem('itemsData');
        localStorage.removeItem('customersData');
        localStorage.removeItem('sellsData');
        localStorage.removeItem('receiptsData');
        alert("All data has been cleared.");
        location.reload(); // Reload the page to reflect changes
    }
}

// Function to add an item to Items tab
function addItem(event) {
    event.preventDefault();
    const itemName = document.getElementById('itemName').value;
    const itemColor = document.getElementById('itemColor').value;
    const itemMeters = parseFloat(document.getElementById('itemMeters').value);

    if (!itemName || !itemColor || isNaN(itemMeters) || itemMeters <= 0) {
        alert("Please fill out all fields correctly.");
        return;
    }

    // Check if item already exists
    const existingItem = itemsData.find(item => item.name === itemName && item.color === itemColor);

    if (existingItem) {
        existingItem.meters.push(itemMeters); // Add meter to existing item
    } else {
        itemsData.push({ name: itemName, color: itemColor, meters: [itemMeters] }); // Create new item with meters array
    }

    localStorage.setItem('itemsData', JSON.stringify(itemsData));
    renderItemsTable();
    document.getElementById('itemForm').reset();
}

// Function to render items in the Items table
function renderItemsTable() {
    const tbody = document.querySelector('#itemTable tbody');
    tbody.innerHTML = '';

    itemsData.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.color}</td>
            <td>
                <button onclick="viewItem('${item.name}', '${item.color}')">View</button>
                <button onclick="deleteItemRow('${item.name}', '${item.color}')" class="red">Delete All</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Function to view item details in modal
function viewItem(name, color) {
    const item = itemsData.find(item => item.name === name && item.color === color);
    if (item) {
        modalItemName.textContent = item.name;
        modalItemColor.textContent = `Color: ${item.color}`;
        meterList.innerHTML = `Meters: ${item.meters.join(', ')}`;
        viewModal.style.display = "block";
    }
}

// Function to close view modal
function closeModal() {
    viewModal.style.display = "none";
}

// Function to delete an item row in Items tab
function deleteItemRow(name, color) {
    if (confirm(`Are you sure you want to delete all entries of ${name} - ${color}?`)) {
        itemsData = itemsData.filter(item => !(item.name === name && item.color === color));
        localStorage.setItem('itemsData', JSON.stringify(itemsData));
        renderItemsTable();
    }
}

// Function to initialize application and render initial data
function initializeApp() {
    renderItemsTable();
    renderCustomersTable();
    renderSellsTable();
    renderReceiptsTable();
}

// Function to populate customer dropdown in Sells tab
function populateCustomerSelect() {
    const customerSelect = document.getElementById('customerSelect');
    customerSelect.innerHTML = '<option value="">Select Customer</option>';

    customersData.forEach(customer => {
        const option = document.createElement('option');
        option.value = customer.phone;
        option.textContent = `${customer.name} (${customer.phone})`;
        customerSelect.appendChild(option);
    });
}

// Function to populate item datalist in Sells tab
function populateItemDatalist() {
  const itemDatalist = document.getElementById('itemList');
  itemDatalist.innerHTML = '';

  itemsData.forEach(item => {
      item.meters.forEach(meter => {
          const option = document.createElement('option');
          option.value = `${item.name} - ${item.color} - ${meter}`;
          itemDatalist.appendChild(option);
      });
  });
}
// Function to add a customer to Customers tab
function addCustomer(event) {
    event.preventDefault();
    const customerName = document.getElementById('customerName').value;
    const customerPhone = document.getElementById('customerPhone').value;
    const customerAddress = document.getElementById('customerAddress').value;

    if (!customerName || !customerPhone || !customerAddress) {
        alert("Please fill out all fields correctly.");
        return;
    }

    // Check if customer already exists
    const existingCustomer = customersData.find(customer => customer.phone === customerPhone);

    if (existingCustomer) {
        alert("Customer with this phone number already exists.");
        return;
    }

    customersData.push({ name: customerName, phone: customerPhone, address: customerAddress });
    localStorage.setItem('customersData', JSON.stringify(customersData));
    renderCustomersTable();
    document.getElementById('customerForm').reset();
}

// Function to render customers in the Customers table
function renderCustomersTable() {
    const tbody = document.querySelector('#customerTable tbody');
    tbody.innerHTML = '';

    customersData.forEach(customer => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${customer.name}</td>
            <td>${customer.phone}</td>
            <td>${customer.address}</td>
            <td>
                <button onclick="deleteCustomerRow('${customer.phone}')" class="red">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Function to delete a customer row in Customers tab
function deleteCustomerRow(phone) {
    if (confirm(`Are you sure you want to delete ${phone}?`)) {
        customersData = customersData.filter(customer => customer.phone !== phone);
        localStorage.setItem('customersData', JSON.stringify(customersData));
        renderCustomersTable();
        populateCustomerSelect(); // Update customer dropdown in Sells tab
    }
}

// Function to add a sell to Sells tab
function addSell(event) {
    event.preventDefault();
    const customerSelect = document.getElementById('customerSelect');
    const selectedCustomer = customerSelect.value;
    const itemSearch = document.getElementById('itemSearch').value;
    const quantity = parseFloat(document.getElementById('quantity').value);
    const price = parseFloat(document.getElementById('price').value);

    if (!selectedCustomer || !itemSearch || isNaN(quantity) || quantity <= 0 || isNaN(price) || price <= 0) {
        alert("Please fill out all fields correctly.");
        return;
    }

    const [itemName, itemColor, itemMeter] = itemSearch.split(' - ');
    const itemIndex = itemsData.findIndex(item => item.name === itemName && item.color === itemColor && item.meters.includes(parseFloat(itemMeter)));

    if (itemIndex === -1 || itemsData[itemIndex].meters.reduce((acc, cur) => acc + cur, 0) < quantity) {
        alert("Item not found or insufficient quantity.");
        return;
    }

    const customer = customersData.find(customer => customer.phone === selectedCustomer);

    sellsData.push({ customer, itemName, itemColor, quantity, price, date: new Date().toISOString() });
    localStorage.setItem('sellsData', JSON.stringify(sellsData));
    updateItemQuantity(itemName, itemColor, parseFloat(itemMeter), quantity);
    renderSellsTable();
    document.getElementById('sellForm').reset();
}

// Function to render sells in the Sells table
function renderSellsTable() {
    const tbody = document.querySelector('#sellTable tbody');
    tbody.innerHTML = '';

    sellsData.forEach(sell => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${sell.customer.name} (${sell.customer.phone})</td>
            <td>${sell.itemName} - ${sell.itemColor}</td>
            <td>${sell.quantity}</td>
            <td>${sell.price}</td>
            <td>${new Date(sell.date).toLocaleDateString()}</td>
            <td>
                <button onclick="deleteSellRow('${sell.date}')" class="red">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Function to delete a sell row in Sells tab
function deleteSellRow(date) {
    if (confirm("Are you sure you want to delete this sell?")) {
        sellsData = sellsData.filter(sell => sell.date !== date);
        localStorage.setItem('sellsData', JSON.stringify(sellsData));
        renderSellsTable();
    }
}

// Function to update item quantity after a sell
function updateItemQuantity(itemName, itemColor, itemMeter, soldQuantity) {
    const itemIndex = itemsData.findIndex(item => item.name === itemName && item.color === itemColor && item.meters.includes(itemMeter));

    if (itemIndex !== -1) {
        const meters = itemsData[itemIndex].meters;
        for (let i = 0; i < meters.length; i++) {
            if (meters[i] === itemMeter) {
                meters[i] -= soldQuantity;
                if (meters[i] <= 0) {
                    meters.splice(i, 1); // Remove meter if it becomes zero or negative
                }
                break;
            }
        }
        localStorage.setItem('itemsData', JSON.stringify(itemsData));
        renderItemsTable();
    }
}

// Function to print a receipt in Receipts tab

function printReceipt() {
  const printContents = purchaseDetails.innerHTML;
  const originalContents = document.body.innerHTML;
  document.body.innerHTML = printContents;
  window.print();
  document.body.innerHTML = originalContents;
}


// Function to render receipts in Receipts tab
function renderReceiptsTable() {
    const customerReceiptSelect = document.getElementById('customerReceiptSelect');
    customerReceiptSelect.innerHTML = '<option value="">Select Customer</option>';

    customersData.forEach(customer => {
        const option = document.createElement('option');
        option.value = customer.phone;
        option.textContent = `${customer.name} (${customer.phone})`;
        customerReceiptSelect.appendChild(option);
    });
}

// Function to generate receipt for a customer
document.getElementById('receiptForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const customerPhone = document.getElementById('customerReceiptSelect').value;

    if (!customerPhone) {
        alert("Please select a customer.");
        return;
    }

    const customerSells = sellsData.filter(sell => sell.customer.phone === customerPhone);

    if (customerSells.length === 0) {
        alert("No sells found for this customer.");
        return;
    }

    let totalAmount = 0;
    let receiptDetails = `<h3>Receipt for ${customerSells[0].customer.name} (${customerPhone})</h3><ul>`;

    customerSells.forEach(sell => {
        totalAmount += sell.quantity * sell.price;
        receiptDetails += `<li>${sell.quantity} ${sell.itemName} - ${sell.itemColor} at ${sell.price.toFixed(2)} each</li>`;
    });

    receiptDetails += `</ul><h4>Total Amount: ${totalAmount.toFixed(2)}</h4>`;
    purchaseDetails.innerHTML = receiptDetails;
    purchaseModal.style.display = "block";
});

// Function to close receipt modal
function closeReceiptModal() {
    purchaseModal.style.display = "none";
}
// Function to render sells in the Sells table
function renderSellsTable() {
  const tbody = document.querySelector('#sellTable tbody');
  tbody.innerHTML = '';

  sellsData.forEach(sell => {
      const row = document.createElement('tr');
      row.innerHTML = `
          <td>${sell.customer.name} (${sell.customer.phone})</td>
          <td>${sell.itemName} - ${sell.itemColor}</td>
          <td>${sell.quantity}</td>
          <td>${sell.price}</td>
          <td>${new Date(sell.date).toLocaleDateString()}</td>
          <td>
              <button onclick="viewSellDetails('${sell.date}')" class="blue">View</button>
              <button onclick="deleteSellRow('${sell.date}')" class="red">Delete</button>
          </td>
      `;
      tbody.appendChild(row);
  });
}
// Function to view sell details
function viewSellDetails(date) {
  const sell = sellsData.find(sell => sell.date === date);
  if (sell) {
      const modalContent = document.getElementById('purchaseDetails');
      const totalPrice = sell.quantity * sell.price;
      let detailsHTML = `
          <div class="receipt-logo">
              <img src="logo.jpg" alt="Logo">
          </div>
          <h3>Sell Details</h3>
          <p><strong>Customer:</strong> ${sell.customer.name} (${sell.customer.phone})</p>
          <p><strong>Item:</strong> ${sell.itemName} - ${sell.itemColor}</p>
          <p><strong>Quantity:</strong> ${sell.quantity}</p>
          <p><strong>Price per Meter:</strong> $${sell.price.toFixed(2)}</p>
          <p><strong>Total Price:</strong> $${totalPrice.toFixed(2)}</p>
          <p><strong>Date:</strong> ${new Date(sell.date).toLocaleString()}</p>
          <button onclick="printSellReceipt()"></button>
      `;
      modalContent.innerHTML = detailsHTML;
      purchaseModal.style.display = "block";
  }
}
// Array to store item entries
let itemEntries = [];
document.addEventListener('DOMContentLoaded', () => {
  openTab('items');
  populateTables();
  populateCustomerDropdown(); // Populate the customer dropdown in the receipts tab
});

// Add this function to populate the customer dropdown in the receipt form
function populateCustomerDropdown() {
  const customerDropdown = document.getElementById('receipt-customer');
  customerDropdown.innerHTML = ''; // Clear existing options
  const customers = getCustomersFromStorage();
  customers.forEach(customer => {
      const option = document.createElement('option');
      option.value = customer.name;
      option.textContent = customer.name;
      customerDropdown.appendChild(option);
  });
}

// Add event listener for the receipt form submission
const receiptForm = document.getElementById('receipt-form');
receiptForm.addEventListener('submit', (e) => {
  e.preventDefault();
  generateCustomerReceipt();
});

// Function to generate receipt for selected customer
function generateCustomerReceipt() {
  const customerName = document.getElementById('receipt-customer').value;
  const invoices = getInvoicesFromStorage();
  const customerInvoices = invoices.filter(invoice => invoice.customer === customerName);
  const totalAmount = customerInvoices.reduce((total, invoice) => total + invoice.amount, 0);

  const receiptOutput = document.getElementById('receipt-output');
  receiptOutput.innerHTML = `
      <h3>Receipt for ${customerName}</h3>
      <p><strong>Total Amount:</strong> $${totalAmount.toFixed(2)}</p>
  `;
}

// Other existing functions remain unchanged...
// Function to view item details in modal
function viewItem(name, color) {
  const item = itemsData.find(item => item.name === name && item.color === color);
  if (item) {
    modalItemName.textContent = item.name;
    modalItemColor.textContent = `Color: ${item.color}`;
    meterList.innerHTML = ''; // Clear previous meter list
    item.meters.forEach((meter, index) => {
      const meterElement = document.createElement('p');
      meterElement.textContent = `Meter ${index + 1}: ${meter}`;
      
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.classList.add('delete-meter');
      deleteButton.addEventListener('click', () => deleteMeter(name, color, meter));
      
      meterElement.appendChild(deleteButton);
      meterList.appendChild(meterElement);
    });
    viewModal.style.display = "block";
  }
}

// Function to delete a specific meter from item
function deleteMeter(name, color, meterToDelete) {
  const itemIndex = itemsData.findIndex(item => item.name === name && item.color === color);
  if (itemIndex !== -1) {
    const meters = itemsData[itemIndex].meters;
    itemsData[itemIndex].meters = meters.filter(meter => meter !== meterToDelete);
    localStorage.setItem('itemsData', JSON.stringify(itemsData));
    renderItemsTable();
    viewItem(name, color); // Re-render modal with updated meters
  }
}
