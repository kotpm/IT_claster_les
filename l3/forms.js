
function createInput(field) {
    let input = document.createElement("input");
    if (field == "type" || field == "status") {
        let values = ["Новий", "Постійний"];
        if (field == "status") values = ["В обробці", "У дорозі", "Виконано", "Скасовано"];
        input = document.createElement("select");
        for (let i = 0; i < values.length; i++) input.add(new Option(values[i], values[i]));
    }
    setInputRules(input, field);
    return input;
}

function editCell(data, record, field, title) {
    let hint = "";
    if (field == "date" || field == "registrationDate") hint = " (ДД.ММ.РРРР)";
    if (field == "type") hint = " (Новий, Постійний)";
    if (field == "status") hint = " (В обробці, У дорозі, Виконано, Скасовано)";
    let value = prompt("Змінити: " + title + hint, record[field]);
    if (value == null) return;

    let updated = {};
    for (let key in record) {
        updated[key] = record[key];
    }
    let error = checkEdit(data, updated, field, value.trim());
    if (error != "") {
        alert("Не збережено: " + error);
        return;
    }

    if (data == orders && record.customerId != updated.customerId) {
        let oldCustomer = findRecord(customers, record.customerId);
        let newCustomer = findRecord(customers, updated.customerId);
        oldCustomer.ordersCount--;
        newCustomer.ordersCount++;
    }
    for (let key in updated) {
        record[key] = updated[key];
    }
    showTable(currentTable);
    document.getElementById("message").textContent = "Запис змінено.";
}

function deleteRow(data, id) {
    let index = -1;
    for (let i = 0; i < data.length; i++) {
        if (data[i].id == id) {
            index = i;
            break;
        }
    }
    if (index == -1) return;

    let error = checkDelete(data, id);
    if (error != "") {
        alert("Неможливо видалити запис: " + error);
        return;
    }

    if (data == orders) {
        let customer = findRecord(customers, data[index].customerId);
        if (customer != null) customer.ordersCount--;
    }
    data.splice(index, 1);
    showTable(currentTable);
    document.getElementById("message").textContent = "Запис видалено.";
}

function addRow(row, data, fields) {
    let record = readRecord(row, fields);
    let message = document.getElementById("message");
    if (record == null) return;
    let error = checkRecord(data, record);
    if (error != "") {
        message.textContent = "Не збережено: " + error;
        return;
    }

    data.push(record);
    if (data == orders) {
        let customer = findRecord(customers, record.customerId);
        customer.ordersCount++;
    }
    showTable(currentTable);
    message.textContent = "Запис додано.";
}
