const { ca } = require("element-plus/es/locales.mjs");

/**
 * Функция для расчета выручки
 * @param purchase запись о покупке
 * @param _product карточка товара
 * @returns {number}
 */
function calculateSimpleRevenue(purchase, _product) {
   // @TODO: Расчет выручки от операции
    const { discount, quantity, sale_price} = purchase;
    const grossRevenue = sale_price * quantity;
    const discountPercent = 1 - discount / 100;
    const netRevenue = grossRevenue * discountPercent;
    const cost = _product.purchase_price * quantity;
    const simpleRevenue = netRevenue - cost;
    return simpleRevenue;
}

/**
 * Функция для расчета бонусов
 * @param index порядковый номер в отсортированном массиве
 * @param total общее число продавцов
 * @param seller карточка продавца
 * @returns {number}
 */
function calculateBonusByProfit(index, total, seller) {
    // @TODO: Расчет бонуса от позиции в рейтинге
    const { profit } = seller;
    const firstPlaceBonus = 0.15;
    const secondThirdPlaceBonus = 0.10;
    const defaultBonus = 0.05;

    if (index === 0) {
        return profit * firstPlaceBonus;
    }

    if (index === 1 || index === 2) {
        return profit * secondThirdPlaceBonus;
    }

    if (index === total - 1) {
        return 0;
    }

    return profit * defaultBonus;
}

/**
 * Функция для анализа данных продаж
 * @param data
 * @param options
 * @returns {{revenue, top_products, bonus, name, sales_count, profit, seller_id}[]}
 */
function analyzeSalesData(data, options) {
    const { calculateRevenue, calculateBonus } = options;

    // @TODO: Проверка входных данных
    if (!data ||
        !Array.isArray(data.purchase_records) ||
        !Array.isArray(data.products) ||
        !Array.isArray(data.sellers) ||
        !Array.isArray(data.customers)
    ) {
        throw new Error('Некорректные входные данные');
    } 

    // @TODO: Проверка наличия опций
    if (!options ||
        typeof calculateRevenue !== 'function' ||
        typeof calculateBonus !== 'function'
    ) {
        throw new Error('Не хватает опций (функций) для работы с данными');
    } 


    // @TODO: Подготовка промежуточных данных для сбора статистики
    const sellerStats = data.sellers.map(seller => ({
        id: seller.id,
        name: `${seller.first_name} ${seller.last_name}`,
        revenue: 0,
        profit: 0,
        sales_count: 0,
        products_sold: {}
    }));
    console.log('Statistics of sellers', sellerStats);


    // @TODO: Индексация продавцов и товаров для быстрого доступа
    const sellerIndex = Object.fromEntries(sellerStats.map(seller => [seller.id, seller]));
    console.log('Seller indexes', sellerIndex);

    const productIndex = data.products.reduce((result, product) => ({
        ...result,
        [product.sku]: product
    }), {});

    console.log('Product indexes', productIndex);

    // @TODO: Расчет выручки и прибыли для каждого продавца
    data.purchase_records.forEach(record => {
        const seller = sellerIndex[record.seller_id];
        seller.sales_count += 1;
        seller.revenue += record.total_amount;

        // Расчёт прибыли для каждого товара
        record.items.forEach(item => {
            const product = productIndex[item.sku];
            const profit = calculateSimpleRevenue(item, product);
            seller.profit += profit; 

            // Учёт количества проданных товаров
            if (!seller.products_sold[item.sku]) {
                seller.products_sold[item.sku] = 0;
            }
            // По артикулу товара увеличить его проданное количество у продавца
            seller.products_sold[item.sku] += item.quantity;
        });
    });

    // @TODO: Сортировка продавцов по прибыли
    sellerStats.forEach((seller, index) => {
        console.log(`Profit of seller № ${index}`, seller.profit);
    });

    const sellerRatingProfit = sellerStats.sort((sellerA, sellerB) => sellerB.profit - sellerA.profit);
    console.log('Ranking by profit', sellerRatingProfit);

    // @TODO: Назначение премий на основе ранжирования
    sellerStats.forEach((seller, index) => {
        seller.bonus = calculateBonusByProfit(index, sellerStats.length, seller);
        console.log('BONUS', seller.bonus);
        seller.top_products = Object.entries(seller.products_sold).map(([sku, quantity]) => ([{sku, quantity}]));
        console.log('TOP PRODUCTS', seller.top_products);
        // Формируем топ-10 товаров
    });

    // @TODO: Подготовка итоговой коллекции с нужными полями
}
