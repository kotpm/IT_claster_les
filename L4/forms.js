
function createInput(field) {
    let input = document.createElement("input");
    if (field == "type" || field == "status") {
        let values = ["Новий", "Постійний"];
        if (field == "status") values = ["В обробці", "У дорозі", "Виконано", "Скасовано"];
        input = document.createElement("select");
        for (let i = 0; i < values.length; i++) input.add(new Option(values[i], values[i]));
    }
    if (field == "customerId" || field == "productId") {
        input = document.createElement("select");
        input.add(new Option("Оберіть зі списку", ""));
        let data = products;
        let name = "name";
        if (field == "customerId") {
            data = customers;
            name = "fullName";
        }
        for (let i = 0; i < data.length; i++) {
            input.add(new Option(data[i].id + " — " + data[i][name], data[i].id));
        }
    }
    setInputRules(input, field);
    return input;
}

function editCell(data, record, field, title) {
    if (field == "customerId" || field == "productId") {
        let dialog = document.getElementById("edit-dialog");
        let container = document.getElementById("edit-field");
        let input = createInput(field);
        input.value = record[field];
        input.setAttribute("aria-label", title);
        container.innerHTML = "";
        container.appendChild(input);
        document.getElementById("edit-title").textContent = title;
        document.getElementById("edit-form").onsubmit = function (event) {
            event.preventDefault();
            if (saveEdit(data, record, field, input.value)) dialog.close();
        };
        dialog.showModal();
        return;
    }
    let hint = "";
    if (field == "date" || field == "registrationDate") hint = " (ДД.ММ.РРРР)";
    if (field == "type") hint = " (Новий, Постійний)";
    if (field == "status") hint = " (В обробці, У дорозі, Виконано, Скасовано)";
    let value = prompt("Змінити: " + title + hint, record[field]);
    if (value == null) return;

    saveEdit(data, record, field, value.trim());
}

function saveEdit(data, record, field, value) {
    let updated = {};
    for (let key in record) {
        updated[key] = record[key];
    }
    let error = checkEdit(data, updated, field, value);
    if (error != "") {
        alert("Не збережено: " + error);
        return false;
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
    let saved = saveData();
    showTable(currentTable);
    if (saved) document.getElementById("message").textContent = "Запис змінено.";
    return true;
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
    let saved = saveData();
    showTable(currentTable);
    if (saved) document.getElementById("message").textContent = "Запис видалено.";
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
    let saved = saveData();
    showTable(currentTable);
    if (saved) message.textContent = "Запис додано.";
}
