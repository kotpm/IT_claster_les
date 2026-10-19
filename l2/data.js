let products = [
    {
        id: 1,
        name: "Навушники",
        category: "Аудіо",
        brand: "SoundLab",
        price: 2499,
        stock: 18,
        warranty: 12
    },
    {
        id: 2,
        name: "Миша",
        category: "Периферія",
        brand: "TechPoint",
        price: 899,
        stock: 32,
        warranty: 24
    },
    {
        id: 3,
        name: "Клавіатура",
        category: "Периферія",
        brand: "TechPoint",
        price: 3299,
        stock: 12,
        warranty: 24
    }
];


let customers = [
    {
        id: 1,
        fullName: "Коваль Олена Іванівна",
        email: "olena@ukr.net",
        city: "Київ",
        registrationDate: "03.09.2026",
        type: "Новий",
        ordersCount: 1
    },
    {
        id: 2,
        fullName: "Мельник Андрій Петрович",
        email: "andrii@gmail.com",
        city: "Львів",
        registrationDate: "12.09.2026",
        type: "Новий",
        ordersCount: 1
    },
    {
        id: 3,
        fullName: "Бондар Марія Олегівна",
        email: "mariia@ukr.net.com",
        city: "Одеса",
        registrationDate: "24.09.2026",
        type: "Новий",
        ordersCount: 1
    }
];

let orders = [
    {
        id: 1,
        customerId: 1,
        productId: 1,
        quantity: 1,
        date: "10.10.2026",
        total: 2499,
        status: "Виконано"
    },
    {
        id: 2,
        customerId: 2,
        productId: 2,
        quantity: 2,
        date: "11.10.2026",
        total: 1798,
        status: "Виконано"
    },
    {
        id: 3,
        customerId: 3,
        productId: 3,
        quantity: 1,
        date: "12.10.2026",
        total: 3299,
        status: "У дорозі"
    }
];