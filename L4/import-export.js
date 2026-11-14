function exportData() {
    let data = loadData();
    if (data == null) return;
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
            let changes = [];
            let applied = 0;
            try {
                let names = ["products", "customers", "orders"];
                for (let i = 0; i < names.length; i++) {
                    let name = names[i];
                    let prefix = "shop-l4:" + name + ":";
                    for (let j = 0; j < data[name].length; j++) {
                        let record = data[name][j];
                        let key = prefix + record.id;
                        let oldValue = localStorage.getItem(key);
                        let newValue = JSON.stringify(record);
                        if (oldValue != newValue) {
                            changes.push({ key: key, oldValue: oldValue, newValue: newValue });
                        }
                    }
                    for (let j = 0; j < localStorage.length; j++) {
                        let key = localStorage.key(j);
                        if (key.indexOf(prefix) == 0) {
                            let id = Number(key.slice(prefix.length));
                            if (findRecord(data[name], id) == null) {
                                changes.push({ key: key, oldValue: localStorage.getItem(key), newValue: null });
                            }
                        }
                    }
                }
                for (let i = 0; i < changes.length; i++) {
                    if (changes[i].newValue == null) {
                        localStorage.removeItem(changes[i].key);
                    } else {
                        localStorage.setItem(changes[i].key, changes[i].newValue);
                    }
                    applied++;
                }
                localStorage.removeItem("shop-l4");

            } catch (error) {
                try {
                    for (let i = applied - 1; i >= 0; i--) {
                        if (changes[i].oldValue == null) {
                            localStorage.removeItem(changes[i].key);
                        } else {
                            localStorage.setItem(changes[i].key, changes[i].oldValue);
                        }
                    }
                } catch (restoreError) {
                    alert("Не вдалося відновити попередні дані.");
                }
                alert("Не вдалося зберегти дані в браузері.");
                return;
            }
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
