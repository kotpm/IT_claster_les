
function getNextId(data) {
    let maxId = 0;
    for (let i = 0; i < data.length; i++) {
        if (data[i].id > maxId) maxId = data[i].id;
    }
    return maxId + 1;
}


function findRecord(data, id) {
    for (let i = 0; i < data.length; i++) {
        if (data[i].id == id) return data[i];
    }
    return null;
}


function inputDate(value) {
    let parts = value.split(".");
    return parts[2] + "-" + parts[1] + "-" + parts[0];
}


function setInputRules(input, field) {
    input.required = true;
    if (field == "type" || field == "status") return;

    let numbers = ["id", "price", "stock", "warranty", "quantity", "customerId", "productId", "total", "ordersCount"];
    for (let i = 0; i < numbers.length; i++) {
        if (field == numbers[i]) {
            input.type = "number";
            input.min = 0;
            input.step = 1;
      
            input.max = Number.MAX_SAFE_INTEGER;
        }
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


function checkDelete(data, id) {
    for (let i = 0; i < orders.length; i++) {
        if (data == products && orders[i].productId == id) {
            return "дані використовуються в таблиці «Замовлення».";
        }
        if (data == customers && orders[i].customerId == id) {
            return "дані використовуються в таблиці «Замовлення».";
        }
    }
    return "";
}

function checkEdit(data, record, field, value) {
    let input = createInput(field);
    input.value = value;
    if (input.type == "date") {
        input.value = inputDate(value);
    }
    if (!input.checkValidity()) return "Некоректне значення поля.";
    if (input.type == "date" && inputDate(value) != input.value) {
        return "Введіть дату у форматі ДД.ММ.РРРР.";
    }
    record[field] = value;
    if (input.type == "number") {
        record[field] = Number(input.value);
    }

    if (data == customers && field == "registrationDate") {
        for (let i = 0; i < orders.length; i++) {
            if (orders[i].customerId == record.id && inputDate(orders[i].date) < inputDate(value)) {
                return "Дата реєстрації не може бути пізнішою за замовлення покупця.";
            }
        }
    }
    return checkRecord(data, record, record.id);
}

function checkRecord(data, record, ignoredId) {
    if (data == customers) {
        for (let i = 0; i < customers.length; i++) {
            if (customers[i].id != ignoredId && customers[i].email.toLowerCase() == record.email.toLowerCase()) {
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
        if (!input.reportValidity()) return null;
        let value = input.value;
        if (input.type == "number") value = Number(value);
        if (input.type == "date") {
            let parts = value.split("-");
            value = parts[2] + "." + parts[1] + "." + parts[0];
        }
        record[fields[j]] = value;
    }
    return record;
}
