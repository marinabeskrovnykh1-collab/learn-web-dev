// App — корневой компонент приложения.
//
// ЗАДАНИЕ
// --------
// Перенесите свою страницу выбора даты и времени из нативного JS
// на React. У вас уже есть:
//   - готовая вёрстка (HTML);
//   - готовые стили (CSS);
//   - рабочий код на нативном JS (валидация дат, рендер календаря,
//     обработчики кликов, выбор слота).
//
// Теперь нужно то же самое сделать в React.
//
// ЧТО НУЖНО СДЕЛАТЬ
// ------------------
// 1. Разбить страницу на компоненты. Как именно — решайте сами.
//    Обычно выделяют: шапку, подвал, календарь, сетку слотов,
//    нижнюю панель.
//
// 2. Перенести вёрстку из HTML в JSX. Стили оставить как есть,
//    просто положить их в тот же проект (например, в src/styles/
//    или рядом с компонентами).
//
// 3. Заменить нативное состояние (переменные + прямые манипуляции
//    с DOM) на useState. Какие именно данные должны жить в состоянии —
//    подумайте сами. Скорее всего: текущий месяц, выбранный день,
//    выбранное время, массив слотов.
//
// 4. Рендер календаря и слотов делать через JSX и .map(),
//    без innerHTML и querySelector.
//
// 5. Обработчики кликов — через onClick прямо в JSX,
//    без addEventListener.
//
// 6. Функции для работы с датами, которые вы уже написали
//    на нативном JS (построение сетки календаря, сравнение дат,
//    проверка «не раньше сегодня»), можно переиспользовать.
//    Они чистые — не зависят от React. Создайте файл
//    src/utils/date.js и перенесите их туда.
//
//
// ПОДСКАЗКА
// ---------
// Если что-то не работает или непонятно, как перевести нативный
// код на React — вернитесь к лекции. Там разбирались все
// основные приёмы: состояние, пропсы, рендер списков, колбэки.
//
// Ниже — пустой каркас. Здесь можно начать писать.

import { useState } from 'react';
import Calendar from './components/Calendar';
import TimeSlots from './components/TimeSlots';
import { TODAY } from './utils/date';
import './index.css'; 

const SLOTS = [
  { time: "10:00", available: true },
  { time: "12:00", available: true },
  { time: "14:00", available: true },
  { time: "15:00", available: true },
  { time: "16:00", available: true },
  { time: "17:00", available: true }
];

function App() {
  const [currentYear, setCurrentYear] = useState(TODAY.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(TODAY.getMonth());
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const handleDayClick = (day) => {
    setSelectedDay(day);
    setSelectedTime(null);
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDay(null);
    setSelectedTime(null);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDay(null);
    setSelectedTime(null);
  };

  const isNextEnabled = selectedDay !== null && selectedTime !== null;

  return (
    <>
      <header className="header">
        <div className="header__logo">ТВОЙ СТИЛЬ</div>
        <nav className="header__nav">
          <a href="#" className="header__nav-link">Услуги</a>
          <a href="#" className="header__nav-link">Галерея</a>
          <a href="#" className="header__nav-link">Команда</a>
          <a href="#" className="header__nav-link">Отзывы</a>
          <a href="#" className="header__nav-link">Контакты</a>
        </nav>
      </header>

      <section className="steps">
        <div className="steps__item">
          <span className="steps__circle">1</span>
          <span className="steps__text">Выбор мастера</span>
        </div>
        <div className="steps__item">
          <span className="steps__circle">2</span>
          <span className="steps__text">Выбор услуги</span>
        </div>
        <div className="steps__item steps__item--active">
          <span className="steps__circle">3</span>
          <span className="steps__text">Выбор времени</span>
        </div>
        <div className="steps__item steps__item--disabled">
          <span className="steps__circle">4</span>
          <span className="steps__text">Ваши контакты</span>
        </div>
        <div className="steps__item steps__item--disabled">
          <span className="steps__circle">5</span>
          <span className="steps__text">Подтверждение</span>
        </div>
      </section>

      <main className="main">
        <div className="main__header">
          <a href="#" className="main__back-link">&lt; Назад</a>
          <h1 className="main__title">Выберите <span className="text-green">дату</span> и время</h1>
        </div>

        <div className="content-grid">
          <Calendar 
            currentYear={currentYear}
            currentMonth={currentMonth}
            selectedDay={selectedDay}
            onDayClick={handleDayClick}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
          />

          <TimeSlots 
            slots={SLOTS}
            selectedTime={selectedTime}
            onTimeClick={setSelectedTime}
            onNext={() => alert(`Вы записаны на ${selectedDay} числа в ${selectedTime}`)}
            isNextEnabled={isNextEnabled}
          />
        </div>
      </main>

      <footer className="footer">
        <div className="footer__content">
          <div className="footer__col">
            <div className="footer__logo">ТВОЙ СТИЛЬ</div>
            <p className="footer__desc">Дружелюбное описание услуг</p>
          </div>
          <div className="footer__col">
            <h3 className="footer__title">КОНТАКТЫ</h3>
            <p className="footer__text">ул. Садовая, 15, Москва</p>
            <p className="footer__text footer__text--phone">+7 (495) 123-45-67</p>
          </div>
          <div className="footer__col">
            <h3 className="footer__title">РЕЖИМ РАБОТЫ</h3>
            <p className="footer__text">Пн–Пт: 9:00 – 21:00</p>
            <p className="footer__text">Сб–Вс: 10:00 – 19:00</p>
          </div>
        </div>
        <div className="footer__bottom">
          <p className="footer__copy">© 2026. Все права защищены.</p>
          <a href="#" className="footer__link">Политика конфиденциальности</a>
        </div>
      </footer>
    </>
  );
}

export default App;