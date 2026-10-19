
// Створити поле для введення.
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

// Додати запис.
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
