
const products = [
  { name: "Croissant", icon: "🥐", price: 8 },
  { name: "Baguette", icon: "🥖", price: 10 },
  { name: "Focaccia", icon: "🍕", price: 12 },
  { name: "Cake", icon: "🍰", price: 15 }
];

const customers = [
  { name: "AMÉLIE", face: "👩🏻‍🦰", greeting: "I'd love a" },
  { name: "THOMAS", face: "👨🏻", greeting: "Can I have a" },
  { name: "CAMILLE", face: "👩🏽", greeting: "Un petit" },
  { name: "LOUIS", face: "👨🏽‍🦱", greeting: "I'm craving a" }
];

let coins = 20;
let reputation = 0;
let day = 1;
let ovenLevel = 1;
let selected = null;
let currentOrder = null;
let served = false;

const $ = id => document.getElementById(id);

function feedback(text) {
  $("feedback").textContent = text;
}

function updateHUD() {
  $("coins").textContent = coins;
  $("reputation").textContent = reputation;
  $("day").textContent = "DAY " + day;

  const cost = ovenLevel * 30;
  $("upgrade").textContent =
    "Upgrade oven · " + cost + " coins";
  $("upgrade").disabled = coins < cost;

  $("upgradeDescription").textContent =
    "Oven level " + ovenLevel +
    ". Each upgrade adds " + 3 +
    " bonus coins to a successful order.";
}

function renderMenu() {
  $("menu").innerHTML = "";

  products.forEach(product => {
    const button = document.createElement("button");
    button.className = "pastry";
    button.type = "button";

    button.innerHTML = `
      <span class="food">${product.icon}</span>
      <strong>${product.name}</strong>
      <small>${product.price} coins</small>
    `;

    button.addEventListener("click", () => {
      selected = product;
      document.querySelectorAll(".pastry").forEach(el =>
        el.classList.remove("selected")
      );
      button.classList.add("selected");
      feedback("You selected " + product.name +
        ". Ready to serve!");
    });

    $("menu").appendChild(button);
  });
}

function newCustomer() {
  const customer = customers[Math.floor(Math.random() * customers.length)];
  const product = products[Math.floor(Math.random() * products.length)];

  currentOrder = { customer, product };
  selected = null;
  served = false;

  $("customer").textContent = customer.face;
  $("customerName").textContent = customer.name + "'S ORDER";
  $("orderText").textContent =
    customer.greeting + " " +
    product.name.toLowerCase() + ", s'il vous plaît!";
  $("orderHint").textContent =
    "Reward: " + (product.price + 3 * (ovenLevel - 1)) +
    " coins";

  document.querySelectorAll(".pastry").forEach(el =>
    el.classList.remove("selected")
  );

  feedback("A customer is waiting. Choose the correct pastry!");
  updateHUD();
}

function serveOrder() {
  if (served) {
    feedback("This order is already complete. Welcome the next customer!");
    return;
  }

  if (!selected) {
    feedback("Choose a pastry from the display first!");
    return;
  }

  if (selected.name !== currentOrder.product.name) {
    feedback("Not quite! Check the customer's order again.");
    return;
  }

  const earned = selected.price + 3 * (ovenLevel - 1);

  coins += earned;
  reputation++;
  served = true;

  feedback("Délicieux! Correct order! You earned " +
    earned + " coins. Très bien!");

  $("orderHint").textContent = "Order completed! +" + earned + " coins";
  updateHUD();
}

function upgradeOven() {
  const cost = ovenLevel * 30;

  if (coins < cost) {
    feedback("Not enough coins for the oven upgrade yet.");
    return;
  }

  coins -= cost;
  ovenLevel++;

  feedback("Your oven is upgraded to level " + ovenLevel +
    "! Every successful order earns more.");
  updateHUD();
}

$("serve").addEventListener("click", serveOrder);

$("newDay").addEventListener("click", () => {
  day++;
  newCustomer();
});

$("upgrade").addEventListener("click", upgradeOven);

renderMenu();
updateHUD();
newCustomer();
