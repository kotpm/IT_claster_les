
let currentTable = "products";

function fillTable(data, title, fields, headers) {
    let container = document.getElementById("table-container");
    container.innerHTML = "<h2></h2><table><thead><tr></tr></thead><tbody></tbody></table>";
    container.querySelector("h2").textContent = title;
    let headerRow = container.querySelector("tr");

    for (let j = 0; j < headers.length; j++) {
        let cell = document.createElement("th");
        cell.textContent = headers[j];
        headerRow.appendChild(cell);
    }
    let actions = document.createElement("th");
    headerRow.appendChild(actions);

    let body = container.querySelector("tbody");
    for (let i = 0; i < data.length; i++) {
        let row = body.insertRow();
        for (let j = 0; j < fields.length; j++) {
            let field = fields[j];
            let cell = row.insertCell();
            cell.textContent = data[i][field];
            if (field != "id" && field != "total" && field != "ordersCount") {
                cell.title = "Двічі клацніть, щоб змінити";
                cell.ondblclick = function () {
                    editCell(data, data[i], field, headers[j]);
                };
            }
        }
        let deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "-";
        deleteButton.className = "delete-button";
        deleteButton.setAttribute("aria-label", "Видалити запис №" + data[i].id);
        deleteButton.onclick = function () {
            deleteRow(data, data[i].id);
        };
        row.insertCell().appendChild(deleteButton);
    }

  
    let row = body.insertRow();
    row.className = "new-row";
    for (let j = 0; j < fields.length; j++) {
        let field = fields[j];
        let input = createInput(field);
        input.setAttribute("aria-label", headers[j]);
        if (field == "id") input.value = getNextId(data);
        if (field == "ordersCount") input.value = 0;
        if (field == "quantity") input.value = 1;
        row.insertCell().appendChild(input);
    }

    let button = document.createElement("button");
    button.textContent = "+";
    button.setAttribute("aria-label", "Додати запис");
    button.onclick = function () {
        addRow(row, data, fields);
    };
    row.insertCell().appendChild(button);
}
function showTable(name) {
    currentTable = name;
    document.getElementById("message").textContent = "";
    if (name == "products") {
        fillTable(products,
            "Товари",
            ["id", "name", "category", "brand", "price", "stock", "warranty"],
            ["ID", "Назва", "Категорія", "Виробник", "Ціна, грн", "На складі, шт.", "Гарантія, міс."]
        );
    } else if (name == "customers") {
        fillTable(customers,
            "Покупці",
            ["id", "fullName", "email", "city", "registrationDate", "type", "ordersCount"],
            ["ID", "ПІБ", "Електронна пошта", "Місто", "Дата реєстрації", "Тип покупця", "Кількість замовлень"]
        );
    } else if (name == "orders") {
        fillTable(orders,
            "Замовлення",
            ["id", "customerId", "productId", "quantity", "date", "total", "status"],
            ["ID", "ID покупця", "ID товару", "Кількість, шт.", "Дата", "Сума, грн", "Статус"]
        );
    }
}


showTable("products");
