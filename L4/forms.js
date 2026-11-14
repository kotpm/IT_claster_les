
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
        let table = field == "customerId" ? "customers" : "products";
        let data = loadData(table);
        if (data == null) return input;
        let name = field == "customerId" ? "fullName" : "name";
        for (let i = 0; i < data.length; i++) {
            input.add(new Option(data[i].id + " — " + data[i][name], data[i].id));
        }
    }
    setInputRules(input, field);
    return input;
}

function editCell(name, id, field, title) {
    let record = loadData(name, id);
    if (record == null) {
        alert("Запис недоступний або вже видалений.");
        return;
    }
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
            if (saveEdit(name, id, field, input.value)) dialog.close();
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

    saveEdit(name, id, field, value.trim());
}
