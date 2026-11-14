
function checkImport(data) {
    if (data == null) return false;
    let tables = [data.products, data.customers, data.orders];
    let textFields = [
        ["name", "category", "brand"],
        ["fullName", "email", "city", "registrationDate", "type"],
        ["date", "status"]
    ];
    let numberFields = [
        ["id", "price", "stock", "warranty"],
        ["id", "ordersCount"],
        ["id", "customerId", "productId", "quantity", "total"]
    ];
    for (let i = 0; i < tables.length; i++) {
        if (!Array.isArray(tables[i])) return false;
        for (let j = 0; j < tables[i].length; j++) {
            let record = tables[i][j];
            if (record == null) return false;
            for (let k = 0; k < textFields[i].length; k++) {
                if (typeof record[textFields[i][k]] != "string") return false;
            }
            for (let k = 0; k < numberFields[i].length; k++) {
                let value = record[numberFields[i][k]];
                if (typeof value != "number" || !Number.isFinite(value) || value < 0) return false;
            }
            if (!Number.isSafeInteger(record.id)) return false;
            for (let k = 0; k < j; k++) {
                if (tables[i][k].id == record.id) return false;
            }
        }
    }
    for (let i = 0; i < data.orders.length; i++) {
        let order = data.orders[i];
        if (findRecord(data.customers, order.customerId) == null) return false;
        if (findRecord(data.products, order.productId) == null) return false;
    }
    return true;
}

function getNextId(name) {
    let data = loadData(name);
    if (data == null) return null;
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
    if (input.tagName == "SELECT") return;

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


function checkDelete(name, id) {
    let stored = loadData();
    if (stored == null) return "Не вдалося прочитати дані.";
    for (let i = 0; i < stored.orders.length; i++) {
        if (name == "products" && stored.orders[i].productId == id) {
            return "дані використовуються в таблиці «Замовлення».";
        }
        if (name == "customers" && stored.orders[i].customerId == id) {
            return "дані використовуються в таблиці «Замовлення».";
        }
    }
    return "";
}

function checkEdit(name, record, field, value) {
    let stored = loadData();
    if (stored == null) return "Не вдалося прочитати дані.";
    if (["id", "total", "ordersCount"].includes(field) || !(field in record)) {
        return "Це поле не можна змінювати.";
    }
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
    if (input.type == "number" || field == "customerId" || field == "productId") {
        record[field] = Number(input.value);
    }

    if (name == "customers" && field == "registrationDate") {
        for (let i = 0; i < stored.orders.length; i++) {
            if (stored.orders[i].customerId == record.id && inputDate(stored.orders[i].date) < inputDate(value)) {
                return "Дата реєстрації не може бути пізнішою за замовлення покупця.";
            }
        }
    }
    return checkRecord(name, record, record.id);
}

function checkRecord(name, record, ignoredId) {
    let stored = loadData();
    if (stored == null) return "Не вдалося прочитати дані.";
    if (name == "customers") {
        for (let i = 0; i < stored.customers.length; i++) {
            if (stored.customers[i].id != ignoredId && stored.customers[i].email.toLowerCase() == record.email.toLowerCase()) {
                return "Покупець із такою поштою вже є.";
            }
        }
    }
    if (name == "orders") {
        let customer = findRecord(stored.customers, record.customerId);
        let product = findRecord(stored.products, record.productId);
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
        if (input.type == "number" || fields[j] == "customerId" || fields[j] == "productId") value = Number(value);
        if (input.type == "date") {
            let parts = value.split("-");
            value = parts[2] + "." + parts[1] + "." + parts[0];
        }
        record[fields[j]] = value;
    }
    return record;
}
