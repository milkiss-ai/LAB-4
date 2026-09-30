// ============================================================
// src/DiscountCalculator.jsx
// ============================================================

import { useState } from "react";
import "./DiscountCalculator.css";

// Справочник категорий:
// ключ — id, значение — название и размер скидки
const CATEGORIES = [
  { id: "electronics", label: "Электроника", discount: 5 },
  { id: "clothing", label: "Одежда", discount: 15 },
  { id: "groceries", label: "Продукты", discount: 10 },
  { id: "books", label: "Книги", discount: 20 },
  { id: "other", label: "Другое", discount: 0 },
];

// Ставка НДС — 22%
const VAT_RATE = 0.22;

function DiscountCalculator() {
  // ---------------- Состояние ----------------

  // Цена товара хранится как строка,
  // потому что input в React работает со строками
  const [price, setPrice] = useState("");

  // Выбранная категория
  const [category, setCategory] = useState("electronics");

  // Показывать ли результаты расчёта
  const [calculated, setCalculated] = useState(false);

  // Сообщение об ошибке
  const [error, setError] = useState("");

  // ---------------- Обработчики ----------------

  // Изменение цены
  function handlePriceChange(e) {
    const value = e.target.value;

    // Разрешаем только цифры и одну точку
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setPrice(value);
      setError("");
      setCalculated(false);
    }
  }

  // Изменение категории
  function handleCategoryChange(e) {
    setCategory(e.target.value);

    // При изменении категории старый результат скрываем
    setCalculated(false);
  }

  // Нажатие кнопки "Рассчитать"
  function handleCalculate() {
    const numPrice = parseFloat(price);

    // Если поле пустое
    if (!price.trim()) {
      setError("Введите цену товара");
      setCalculated(false);
      return;
    }

    // Если введено не число или отрицательное/нулевое значение
    if (isNaN(numPrice) || numPrice <= 0) {
      setError("Цена должна быть положительным числом");
      setCalculated(false);
      return;
    }

    // Если всё правильно
    setError("");
    setCalculated(true);
  }

  // Сброс формы
  function handleReset() {
    setPrice("");
    setCategory("electronics");
    setCalculated(false);
    setError("");
  }

  // ---------------- Вычисления ----------------

  // Находим выбранную категорию
  const selectedCategory = CATEGORIES.find(
    (c) => c.id === category
  );

  // Преобразуем цену в число
  const numPrice = parseFloat(price) || 0;

  // Получаем процент скидки
  const discountPercent = selectedCategory
    ? selectedCategory.discount
    : 0;

  // Сумма скидки
  const discountAmount = calculated
    ? numPrice * (discountPercent / 100)
    : 0;

  // Цена после скидки
  const priceAfterDiscount = calculated
    ? numPrice - discountAmount
    : 0;

  // НДС
  const vatAmount = calculated
    ? priceAfterDiscount * VAT_RATE
    : 0;

  // Итоговая сумма
  const total = calculated
    ? priceAfterDiscount + vatAmount
    : 0;

  // Форматирование суммы в рублях
  function formatRub(value) {
    return value.toLocaleString("ru-RU", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  // ---------------- Разметка ----------------

  return (
    <div className="calculator-wrapper">

      <h2 className="calculator-title">
        Калькулятор скидок
      </h2>

      {/* Поле цены */}
      <div className="field">
        <label htmlFor="price" className="field__label">
          Цена товара (₽)
        </label>

        <input
          id="price"
          type="text"
          className={`field__input ${
            error ? "field__input--error" : ""
          }`}
          value={price}
          onChange={handlePriceChange}
          placeholder="Например: 1000"
          inputMode="decimal"
        />

        {error && (
          <span className="field__error">
            {error}
          </span>
        )}
      </div>

      {/* Выбор категории */}
      <div className="field">
        <label htmlFor="category" className="field__label">
          Категория товара
        </label>

        <select
          id="category"
          className="field__input field__select"
          value={category}
          onChange={handleCategoryChange}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.label} — скидка {cat.discount}%
            </option>
          ))}
        </select>
      </div>

      {/* Кнопки */}
      <div className="actions">

        <button
          type="button"
          className="btn btn--primary"
          onClick={handleCalculate}
        >
          Рассчитать
        </button>

        <button
          type="button"
          className="btn btn--secondary"
          onClick={handleReset}
        >
          Сбросить
        </button>

      </div>

      {/* Результаты показываем только после нажатия "Рассчитать" */}
      {calculated && !error && (
        <div className="results">

          <h3 className="results__title">
            Результат расчёта
          </h3>

          <table className="results__table">
            <tbody>

              <tr>
                <td>Исходная цена</td>
                <td className="results__value">
                  {formatRub(numPrice)} ₽
                </td>
              </tr>

              <tr>
                <td>
                  Скидка ({discountPercent}%, категория
                  «{selectedCategory.label}»)
                </td>

                <td className="results__value results__value--discount">
                  −{formatRub(discountAmount)} ₽
                </td>
              </tr>

              <tr>
                <td>Цена после скидки</td>
                <td className="results__value">
                  {formatRub(priceAfterDiscount)} ₽
                </td>
              </tr>

              <tr>
                <td>НДС (22%)</td>
                <td className="results__value">
                  +{formatRub(vatAmount)} ₽
                </td>
              </tr>

              <tr className="results__row--total">
                <td>Итого к оплате</td>
                <td className="results__value">
                  {formatRub(total)} ₽
                </td>
              </tr>

            </tbody>
          </table>

        </div>
      )}

    </div>
  );
}

export default DiscountCalculator;