
function getNextId(data) {
    return data.length + 1;
}


function findRecord(data, id) {
    for (let i = 0; i < data.length; i++) {
        if (data[i].id == id) return data[i];
    }
    return null;
}


function inputDate(value) {
  
    return value.split(".").reverse().join("-");
}


function setInputRules(input, field) {
    input.required = true;
    if (field == "type" || field == "status") return;

    let numbers = ["id", "price", "stock", "warranty", "quantity", "customerId", "productId", "total", "ordersCount"];
    // includes перевіряє, чи є назва поля в списку числових полів.
    if (numbers.includes(String(field))) {
        input.type = "number";
        input.min = 0;
        input.step = 1;
        input.max = Number.MAX_SAFE_INTEGER;
    }
    if (field == "quantity" || field == "customerId" || field == "productId") input.min = 1;
    if (field == "price" || field == "total") input.step = 0.01;
    if (field == "price") input.min = 0.01;
    if (field == "email") input.type = "email";
    if (field == "date" || field == "registrationDate") input.type = "date";
    if (field == "id" || field == "total" || field == "ordersCount") {
        input.readOnly = true;
        input.required = false;
        input.placeholder = "Автоматично";
    }
}


function checkRecord(data, record) {
    if (data == customers) {
        for (let i = 0; i < customers.length; i++) {
            if (customers[i].email.toLowerCase() == record.email.toLowerCase()) {
                return "Покупець із такою поштою вже є.";
            }
        }
    }
    if (data == orders) {
        let customer = findRecord(customers, record.customerId);
        let product = findRecord(products, record.productId);
        if (customer == null || product == null) return "Такого ID покупця або товару немає.";
        if (inputDate(record.date) < inputDate(customer.registrationDate)) {
            return "Замовлення не може бути раніше реєстрації покупця.";
        }
        record.total = Math.round(product.price * record.quantity * 100) / 100;
        if (!Number.isSafeInteger(Math.round(record.total * 100))) return "Сума замовлення завелика.";
    }
    return "";
}

function readRecord(row, fields) {
    let record = {};
    document.getElementById("message").textContent = "";
    for (let j = 0; j < fields.length; j++) {
        let input = row.cells[j].firstChild;
        input.value = input.value.trim();
        // Браузер сам показує помилку біля неправильного поля.
        if (!input.reportValidity()) return null;
        let value = input.value;
        if (input.type == "number") value = Number(value);
        if (input.type == "date") value = value.split("-").reverse().join(".");
        record[fields[j]] = value;
    }
    return record;
}
