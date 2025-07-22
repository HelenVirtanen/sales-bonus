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
    const purchasePrice = _product.purchase_price * quantity;
    const simpleRevenue = netRevenue - purchasePrice;
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
        console.log('SELLER', seller) 
        seller.sales_count += 1;
        console.log('SALES_COUNT', seller.sales_count)
        seller.revenue += record.total_amount;
        console.log('TOTAL', seller.revenue);

        // Расчёт прибыли для каждого товара
        record.items.forEach(item => {
            const product = productIndex[item.sku]; // Товар
            // Посчитать себестоимость (cost) товара как product.purchase_price, умноженную на количество товаров из чека
            // Посчитать выручку (revenue) с учётом скидки через функцию calculateRevenue
            // Посчитать прибыль: выручка минус себестоимость
        // Увеличить общую накопленную прибыль (profit) у продавца  

            // Учёт количества проданных товаров
            if (!seller.products_sold[item.sku]) {
                seller.products_sold[item.sku] = 0;
            }
            // По артикулу товара увеличить его проданное количество у продавца
        });
 });

    // @TODO: Сортировка продавцов по прибыли
    sellerStats.forEach((seller) => {
        console.log('Net revenue of seller', seller.revenue);
    });

    const sellerRating = sellerStats.toSorted(seller => seller.revenue);

    console.log('Raring by net revenue', sellerRating);

    // @TODO: Назначение премий на основе ранжирования

    // @TODO: Подготовка итоговой коллекции с нужными полями
}
