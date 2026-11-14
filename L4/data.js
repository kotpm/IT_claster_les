function addRow(row, name, fields) {
    let record = readRecord(row, fields);
    let message = document.getElementById("message");
    if (record == null) return;
    record.id = getNextId(name);
    if (record.id == null) return;
    let error = checkRecord(name, record, null);
    if (error != "") {
        message.textContent = "Не збережено: " + error;
        return;
    }

    try {
        localStorage.setItem("shop-l4:" + name + ":" + record.id, JSON.stringify(record));
    } catch (error) {
        message.textContent = "Не вдалося зберегти запис.";
        return;
    }
    showTable(currentTable);
    message.textContent = "Запис додано.";
}

function deleteRow(name, id) {
    let record = loadData(name, id);
    if (record == null) return;

    let error = checkDelete(name, id);
    if (error != "") {
        alert("Неможливо видалити запис: " + error);
        return;
    }

    try {
        localStorage.removeItem("shop-l4:" + name + ":" + id);
    } catch (error) {
        alert("Не вдалося видалити запис.");
        return;
    }
    showTable(currentTable);
    document.getElementById("message").textContent = "Запис видалено.";
}


function saveEdit(name, id, field, value) {
    let record = loadData(name, id);
    if (record == null) {
        alert("Цей запис уже видалено.");
        return false;
    }
    let updated = {};
    for (let key in record) {
        updated[key] = record[key];
    }
    let error = checkEdit(name, updated, field, value);
    if (error != "") {
        alert("Не збережено: " + error);
        return false;
    }

    try {
        localStorage.setItem("shop-l4:" + name + ":" + record.id, JSON.stringify(updated));
    } catch (error) {
        alert("Не вдалося зберегти зміни.");
        return false;
    }
    showTable(currentTable);
    document.getElementById("message").textContent = "Запис змінено.";
    return true;
}


function loadData(table, id) {
    try {
        let saved = localStorage.getItem("shop-l4");
        if (saved != null) {
            let oldData = JSON.parse(saved);
            if (!checkImport(oldData)) return null;
            // Перенесення старого формату до окремих записів.
            for (let name of ["products", "customers", "orders"]) {
                for (let record of oldData[name]) {
                    localStorage.setItem("shop-l4:" + name + ":" + record.id, JSON.stringify(record));
                }
            }
            localStorage.removeItem("shop-l4");
        }
        let data = { products: [], customers: [], orders: [] };
        let names = ["products", "customers", "orders"];
        for (let i = 0; i < names.length; i++) {
            let name = names[i];
            let prefix = "shop-l4:" + name + ":";
            for (let j = 0; j < localStorage.length; j++) {
                let key = localStorage.key(j);
                if (key.indexOf(prefix) == 0) {
                    data[name].push(JSON.parse(localStorage.getItem(key)));
                }
            }
            data[name].sort(function (a, b) {
                return a.id - b.id;
            });
        }
      
        for (let customer of data.customers) {
            customer.ordersCount = 0;
        }
        for (let order of data.orders) {
            let customer = findRecord(data.customers, order.customerId);
            if (customer != null) customer.ordersCount++;
        }
        if (table == null) return data;
        if (id == null) return data[table];
        return findRecord(data[table], id);
    } catch (error) {
        alert("Не вдалося прочитати збережені дані.");
        return null;
    }
}

window.addEventListener("storage", function (event) {
    if (event.storageArea == localStorage && (event.key == null || event.key == "shop-l4" || event.key.indexOf("shop-l4:") == 0)) {
        document.getElementById("edit-dialog").close();
        showTable(currentTable);
    }
});
