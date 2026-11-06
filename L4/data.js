let products = [];
let customers = [];
let orders = [];

function saveData() {
    let data = {
        products: products,
        customers: customers,
        orders: orders
    };
    try {
        localStorage.setItem("shop-l4", JSON.stringify(data));
        return true;
    } catch (error) {
        alert("Не вдалося зберегти дані в браузері.");
        return false;
    }
}

function loadData() {
    try {
        let saved = localStorage.getItem("shop-l4");
        if (saved == null) {
            products = [];
            customers = [];
            orders = [];
            return;
        }
        let data = JSON.parse(saved);
        if (data == null || !Array.isArray(data.products) ||
            !Array.isArray(data.customers) || !Array.isArray(data.orders)) {
            alert("Збережені дані мають неправильний формат.");
            return;
        }
        products = data.products;
        customers = data.customers;
        orders = data.orders;
    } catch (error) {
        alert("Не вдалося прочитати збережені дані.");
    }
}

function exportData() {
    let data = { products: products, customers: customers, orders: orders };
    let file = new Blob([JSON.stringify(data, null, 4)], { type: "application/json" });
    let link = document.createElement("a");
    let url = URL.createObjectURL(file);
    link.href = url;
    link.download = "data.json";
    link.click();
    setTimeout(function () {
        URL.revokeObjectURL(url);
    }, 1000);
}

function importData(input) {
    let file = input.files[0];
    if (!file) return;
    let reader = new FileReader();
    reader.onload = function () {
        try {
            let data = JSON.parse(reader.result);
            if (!checkImport(data)) {
                alert("Неправильний формат даних або зв’язки між таблицями.");
                return;
            }
            localStorage.setItem("shop-l4", JSON.stringify(data));
            loadData();
            document.getElementById("edit-dialog").close();
            showTable(currentTable);
            document.getElementById("message").textContent = "Дані імпортовано.";
        } catch (error) {
            alert("Не вдалося імпортувати файл. Перевірте JSON і доступ до сховища.");
        }
    };
    reader.onerror = function () {
        alert("Не вдалося прочитати файл.");
    };
    reader.readAsText(file);
    input.value = "";
}

window.addEventListener("storage", function (event) {
    if (event.storageArea == localStorage && (event.key == "shop-l4" || event.key == null)) {
        document.getElementById("edit-dialog").close();
        loadData();
        showTable(currentTable);
    }
});
