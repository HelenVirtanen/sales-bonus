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
    const { calculateSimpleRevenue, calculateBonusByProfit } = options;

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
        typeof calculateSimpleRevenue !== 'function' ||
        typeof calculateBonusByProfit !== 'function'
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

    // @TODO: Индексация продавцов и товаров для быстрого доступа

    // @TODO: Расчет выручки и прибыли для каждого продавца

    // @TODO: Сортировка продавцов по прибыли

    // @TODO: Назначение премий на основе ранжирования

    // @TODO: Подготовка итоговой коллекции с нужными полями
}
