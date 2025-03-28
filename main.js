const transactions = JSON.parse(localStorage.getItem("transactions")) || [];

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  signDisplay: "always",
});
const list = document.getElementById("transactionList");
const form = document.getElementById("transactionForm");
const status = document.getElementById("status");
const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");

form.addEventListener("submit", addTransaction);

function updateBalance() {
  const incomeTotal = transactions
    .filter((trx) => trx.type === "income")
    .reduce((total, trx) => total + trx.amount, 0);

  const expenseTotal = transactions
    .filter((trx) => trx.type === "expense")
    .reduce((total, trx) => total + trx.amount, 0);

  const balanceTotal = incomeTotal - expenseTotal;

  balance.textContent = formatter.format(balanceTotal).substring(1);
  income.textContent = formatter.format(incomeTotal);
  expense.textContent = formatter.format(expenseTotal * -1);
}

function renderList() {
  list.innerHTML = "";

  status.textContent = "";
  if (transactions.length === 0) {
    status.textContent = "No Transactions.";
    return;
  }

  transactions.forEach(({ id, name, amount, date, type }) => {
    const sign = "income" === type ? 1 : -1;
    const li = document.createElement("li");

    li.innerHTML = `
            <div class="
            <div class="name">
                <h4>${name}</h4>
                <p>${new Date(date).toLocaleDateString()}</p>
            </div>
            <div class="total-trans">
              <div class="amount ${type}">
                  <span>${formatter.format(amount * sign)}</span>
              </div>
              <div class="action">
                  <i class="fa-solid fa-xmark" onclick="deleteTransaction(${id})"></i>
              </div>
            </div>
        `;

    list.appendChild(li);
  });
}
updateBalance();
renderList();

function deleteTransaction(id) {
  const index = transactions.findIndex((trx) => trx.id === id);
  transactions.splice(index, 1);

  saveTransaction();
  renderList();
  updateBalance();
}

function addTransaction(e) {
  e.preventDefault();

  const formData = new FormData(this);

  transactions.push({
    id: transactions.length + 1,
    name: formData.get("name"),
    amount: parseFloat(formData.get("amount")),
    date: new Date(formData.get("date")),
    type: "on" === formData.get("type") ? "income" : "expense",
  });

  this.reset();

  saveTransaction();
  updateBalance();
  renderList();
}

function saveTransaction() {
  transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

  localStorage.setItem("transactions", JSON.stringify(transactions));
}
