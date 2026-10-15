function fillTable(title, data, fields, headers) {
    let html = "<h2>" + title + "</h2>";
    html += "<table><thead><tr>";

    for (let j = 0; j < headers.length; j++) {
        html += "<th>" + headers[j] + "</th>";
    }

    html += "</tr></thead><tbody>";

    for (let i = 0; i < data.length; i++) {
        let item = data[i];
        html += "<tr>";

        for (let j = 0; j < fields.length; j++) {
            let field = fields[j];
            html += "<td>" + item[field] + "</td>";
        }

        html += "</tr>";
    }

    html += "</tbody></table>";
    document.getElementById("table-container").innerHTML = html;
}


function showTable(name) {
    if (name == "products") {
        fillTable(
            "Товари",
            products,
            ["id", "name", "category", "brand", "price", "stock", "warranty"],
            ["ID", "Назва", "Категорія", "Виробник", "Ціна, грн", "На складі, шт.", "Гарантія, міс."]
        );
    } else if (name == "customers") {
        fillTable(
            "Покупці",
            customers,
            ["id", "fullName", "email", "city", "registrationDate", "type", "ordersCount"],
            ["ID", "ПІБ", "Електронна пошта", "Місто", "Дата реєстрації", "Тип покупця", "Кількість замовлень"]
        );
    } else if (name == "orders") {
        fillTable(
            "Замовлення",
            orders,
            ["id", "customerId", "productId", "quantity", "date", "total", "status"],
            ["ID", "ID покупця", "ID товару", "Кількість, шт.", "Дата", "Сума, грн", "Статус"]
        );
    }
}


showTable("products");
