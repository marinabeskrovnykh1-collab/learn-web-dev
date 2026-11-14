// JavaScript для страницы выбора даты и времени.
//
// ЗАДАНИЕ
// ========
// Оживить свою свёрстанную страницу. Скорее всего на ней будет работать:
//   1. При открытии страницы выбрать день по умолчанию.
//   2. По клику на день — день становится выбранным,
//      слоты обновляются.
//   3. По клику на слот — время становится выбранным,
//      попадает в нижнюю панель.
//   4. Стрелки «‹» и «›» листают месяцы.
//   5. Дни раньше «сегодня» нельзя выбрать.
//   6. Нижняя панель обновляется при выборе дня и времени.
//
// ГДЕ ЖИВУТ ДАННЫЕ
// ----------------
// Слотов пока нет с сервера. Захардкодьте массив в этом файле.
// Формат слота: { time: "10:00", available: true }.
// «Сегодня» можно взять из new Date() или захардкодить —
// как удобнее для проверки.
//
// СТРУКТУРА КОДА
// --------------
// Разделите код на смысловые части комментариями:
//   1. Данные (слоты, «сегодня»).
//   2. Состояние (месяц, день, время, слоты).
//   3. Чистые функции (для работы с датами).
//   4. Отрисовка и обработчики.
//   5. Инициализация.
//
// ЧИСТЫЕ ФУНКЦИИ
// --------------
// Если понадобится строить сетку календаря — вот функция,
// которую можно использовать. Она не зависит от DOM,
// просто принимает год и месяц и возвращает массив недель.
//
// function buildCalendarGrid(year, month) {
//   const firstDay = new Date(year, month, 1);
//   const lastDay = new Date(year, month + 1, 0);
//   const daysInMonth = lastDay.getDate();
//   const startDayOfWeek = firstDay.getDay();
//   const offset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
//   const prevMonthLastDay = new Date(year, month, 0).getDate();
//
//   const cells = [];
//
//   for (let i = offset - 1; i >= 0; i--) {
//     cells.push({ day: prevMonthLastDay - i, otherMonth: true });
//   }
//   for (let d = 1; d <= daysInMonth; d++) {
//     cells.push({ day: d, otherMonth: false });
//   }
//   const totalCells = Math.ceil(cells.length / 7) * 7;
//   let nextDay = 1;
//   while (cells.length < totalCells) {
//     cells.push({ day: nextDay, otherMonth: true });
//     nextDay++;
//   }
//
//   const weeks = [];
//   for (let i = 0; i < cells.length; i += 7) {
//     weeks.push(cells.slice(i, i + 7));
//   }
//   return weeks;
// }

// Начните писать код здесь.
const MONTHS_NOMINATIVE = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

const SLOTS = [
    { time: "10:00", available: true },
    { time: "12:00", available: true },
    { time: "14:00", available: true },
    { time: "15:00", available: true },
    { time: "16:00", available: true },
    { time: "17:00", available: true }
];

const TODAY = new Date(2026, 9, 15); 

let state = {
    currentYear: TODAY.getFullYear(),
    currentMonth: TODAY.getMonth(),
    selectedDay: null,
    selectedTime: null
};

function buildCalendarGrid(year, month) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    let startDayOfWeek = firstDay.getDay();
    startDayOfWeek = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

    const weeks = [];
    let week = [];

    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = 0; i < startDayOfWeek; i++) {
        const day = prevMonthLastDay - startDayOfWeek + i + 1;
        week.push({ day: day, otherMonth: true });
    }

    for (let day = 1; day <= daysInMonth; day++) {
        week.push({ day: day, otherMonth: false });
        if (week.length === 7) {
            weeks.push(week);
            week = [];
        }
    }

    if (week.length > 0) {
        let nextMonthDay = 1;
        while (week.length < 7) {
            week.push({ day: nextMonthDay, otherMonth: true });
            nextMonthDay++;
        }
        weeks.push(week);
    }
    return weeks;
}

function compareDates(a, b) {
    const d1 = new Date(a.year, a.month, a.day);
    const d2 = new Date(b.year, b.month, b.day);
    if (d1 < d2) return -1;
    if (d1 > d2) return 1;
    return 0;
}

function isDateSelectable(day, month, year) {
    return compareDates({ year, month, day }, { year: TODAY.getFullYear(), month: TODAY.getMonth(), day: TODAY.getDate() }) >= 0;
}

function renderCalendar() {
    const grid = document.getElementById('calendar-grid');
    const title = document.getElementById('calendar-month-title');
    
    title.textContent = `${MONTHS_NOMINATIVE[state.currentMonth]} ${state.currentYear}`;
    const weeks = buildCalendarGrid(state.currentYear, state.currentMonth);
    
    grid.innerHTML = `
        <div class="calendar__weekday">Пн</div>
        <div class="calendar__weekday">Вт</div>
        <div class="calendar__weekday">Ср</div>
        <div class="calendar__weekday">Чт</div>
        <div class="calendar__weekday">Пт</div>
        <div class="calendar__weekday">Сб</div>
        <div class="calendar__weekday">Вс</div>
    `;
    
    weeks.forEach(week => {
        week.forEach(cell => {
            let classes = "calendar__day";
            
            if (cell.otherMonth) {
                classes += " other-month";
            } else {
                const selectable = isDateSelectable(cell.day, state.currentMonth, state.currentYear);
                
                if (!selectable) {
                    classes += " disabled";
                } else if (cell.day === state.selectedDay) {
                    classes += " selected";
                }
            }
            
            const div = document.createElement('div');
            div.className = classes;
            div.textContent = cell.day;
            
            if (!cell.otherMonth && isDateSelectable(cell.day, state.currentMonth, state.currentYear)) {
                div.dataset.day = cell.day;
                div.addEventListener('click', onDayClick);
            }
            grid.appendChild(div);
        });
    });
}

function renderTimeSlots() {
    const container = document.getElementById('time-slots-container');
    container.innerHTML = '';
    
    SLOTS.forEach(slot => {
        let classes = "time-slot";
        if (slot.time === state.selectedTime) classes += " selected";
        
        const btn = document.createElement('button');
        btn.className = classes;
        btn.textContent = slot.time;
        btn.dataset.time = slot.time;
        btn.addEventListener('click', onTimeSlotClick);
        
        container.appendChild(btn);
    });
}

function updateContinueButton() {
    const btn = document.getElementById('btn-next');
    if (state.selectedDay && state.selectedTime) {
        btn.disabled = false;
    } else {
        btn.disabled = true;
    }
}

function onDayClick(event) {
    state.selectedDay = parseInt(event.currentTarget.dataset.day);
    state.selectedTime = null;
    renderTimeSlots();
    renderCalendar();
    updateContinueButton();
}

function onTimeSlotClick(event) {
    state.selectedTime = event.currentTarget.dataset.time;
    renderTimeSlots();
    updateContinueButton();
}

function setupMonthNavigation() {
    document.getElementById('btn-prev-month').addEventListener('click', () => {
        state.currentMonth--;
        if (state.currentMonth < 0) {
            state.currentMonth = 11;
            state.currentYear--;
        }
        state.selectedDay = null;
        state.selectedTime = null;
        renderCalendar();
        renderTimeSlots();
        updateContinueButton();
    });

    document.getElementById('btn-next-month').addEventListener('click', () => {
        state.currentMonth++;
        if (state.currentMonth > 11) {
            state.currentMonth = 0;
            state.currentYear++;
        }
        state.selectedDay = null; 
        state.selectedTime = null;
        renderCalendar();
        renderTimeSlots();
        updateContinueButton();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderCalendar();
    renderTimeSlots();
    setupMonthNavigation();
    updateContinueButton(); 
});