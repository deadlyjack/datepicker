import './styles/main.scss';

import tag from 'html-tag-js';
import mustache from 'mustache';
import content from './templates/content.hbs';
import header from './templates/header.hbs';

/**
 * 
 * @param {string | HTMLElement} activator 
 * @param {object} options 
 * @param {number | 'current'} options.minYear 
 * @param {string | 'current'} options.defaultDate default date on calendar formate - mm/dd/yyyy
 * @param {number | 'current'} options.maxYear 
 * @param {number | 'auto'} options.height 
 * @param {number | 'auto'} options.width 
 */
function DatePicker(activator, options = {}) {
    if (!activator) throw new Error('Activator cannot be undefined');

    if (typeof activator === 'string')
        activator = tag.get(activator);
    else
        activator = tag(activator);

    const events = {
        onchange: () => {},
        onpick: () => {},
        hide
    };

    const _d = options.defaultDate ? new Date(options.defaultDate) : new Date();
    const defaultDate = formate(_d);
    const __date = formate(_d);
    let highlight = defaultDate;

    delete __date.full;

    const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    const minYear = options.minYear || defaultDate.year;
    const maxYear = options.maxYear || defaultDate.year;
    const $content = tag('div', {
        className: '__content',
        onclick: handlePick
    });
    const $header = tag('div', {
        className: '__titlebar',
        onclick: handleClick
    });
    const $calendar = tag('div', {
        id: '__DatePicker',
        children: [
            $header,
            $content
        ]
    });
    const $mask = tag('span', {
        className: 'mask',
        onclick: hide
    });

    activator.addEventListener('click', render);

    /**
     * @this HTMLElement
     */
    function render() {

        const {
            top,
            right,
            left,
            bottom
        } = this.getBoundingClientRect();

        $calendar.style.cssText = `top:${bottom}px;right:${innerWidth-right}px`;

        let year = defaultDate.year;
        let month = defaultDate.month;

        const years = [];
        let my = minYear;
        while (my <= maxYear) {
            years.push(my++);
        }

        $header.innerHTML = mustache.render(header, {
            defaultYear: year,
            years,
            month,
        });
        $content.innerHTML = mustache.render(content, {
            dates: plot(year, month)
        });

        $content.get(`[data-date='${defaultDate.date}']`).classList.add('hilight');
        $header.get('.__year').value = defaultDate.year;
        $header.get('.__year').onchange = handleChange;

        document.body.appendChild($mask);
        document.body.appendChild($calendar);

        const calendar = $calendar.getBoundingClientRect();
        const diff = {
            x: calendar.width - calendar.right,
            y: (calendar.top + calendar.height) - innerHeight
        };
        if (diff.x > 0) {
            $calendar.style.right = null;
            $calendar.style.left = left + 'px';
        }
        if (diff.y > 0) {
            $calendar.style.top = null;
            $calendar.style.bottom = (innerHeight - top) + 'px';
        }

        document.onkeydown = function (e) {
            if (e.keyCode === 27 || e.which === 27) {
                e.preventDefault();
                hide();
            }
        };
    }

    function hide() {
        $mask.remove();
        $calendar.remove();
        document.onkeydown = null;
    }


    /**
     * 
     * @param {MouseEvent} e 
     */
    function handleClick(e) {
        const action = e.target.getAttribute('action');
        if (!action) return;

        let month = months.indexOf(__date.month);

        switch (action) {
            case 'prev':
                if (month === 0) {
                    if (__date.year === minYear) return;
                    --__date.year;
                } else {
                    __date.month = months[--month];
                }
                break;

            case 'next':
                if (month === 11) {
                    if (__date.year === maxYear) return;
                    ++__date.year;
                } else {
                    __date.month = months[++month];
                }
                break;
        }
        repaint();
    }

    function handleChange() {
        __date.year = parseInt(this.value);
        repaint();
    }

    function repaint() {
        $header.get('.__year').value = __date.year;
        $header.get('.__month').textContent = __date.month;
        $content.innerHTML = mustache.render(content, {
            dates: plot(__date.year, __date.month)
        });

        if (highlight.compare(__date)) {
            $content.get(`[data-date='${highlight.date}']`).classList.add('hilight');
        }
    }

    /**
     * 
     * @param {MouseEvent} e 
     */
    function handlePick(e) {
        const date = e.target.getAttribute('data-date');
        const day = e.target.getAttribute('data-day');

        if (date && events.onpick) {
            __date.date = parseInt(date);
            __date.day = day;
            const monthNumber = fixed(months.indexOf(__date.month) + 1, 2);
            events.onpick({
                ...__date,
                monthNumber
            });
            highlight.copy(__date);
            repaint();
        }
    }

    /**
     * 
     * @param {number} year 
     * @param {number} month 
     */
    function plot(year, month) {
        const week = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
        const monthNumber = months.indexOf(month);

        const rows = [
            [],
            [],
            [],
            [],
            [],
            []
        ];
        let date = 0;
        for (let row of rows) {
            for (let j = 0; j < week.length; ++j) {
                const d = new Date(`${month}/${++date}/${year}`);
                const isSameMonth = d.getMonth() === monthNumber;
                const fdate = isSameMonth ? formate(d) : null;
                if (fdate) {
                    const diff = week.indexOf(fdate.day) - j;

                    if (diff) {
                        for (let d = 0; d < diff; ++d, ++j) {
                            row.push('');
                        }
                    }

                    row.push({
                        date: date + '',
                        day: fdate.day
                    });

                } else {
                    row.push('');
                }
            }
        }

        if (rows.slice(-1).join('').replace(/\,/g, '') === '') rows.pop();

        return rows;
    }

    /**
     * 
     * @param {Date} date 
     * @returns {formatedDate}
     */
    function formate(date) {
        const _date = date.toDateString().replace(/\s/g, '/').toLowerCase();

        if (_date === 'invalid/date') return;

        const ar = _date.split('/');

        const formatedDate = {};

        formatedDate.year = parseInt(ar[3]);
        formatedDate.date = parseInt(ar[2]);
        formatedDate.month = ar[1];
        formatedDate.day = ar[0];

        Object.setPrototypeOf(formatedDate, {
            compare: function (data) {
                return (data && this.month === data.month && this.year === data.year);
            },
            copy: function (date) {
                this.year = date.year;
                this.date = date.date;
                this.month = date.month;
                this.day = date.day;
            }
        });

        return formatedDate;
    }

    function fixed(num, digit) {
        num = num + '';
        if (num.length < digit) {
            for (let i = 1; i < digit; ++i) {
                num = '0' + num;
            }
        }

        return num;
    }

    return events;
}


/**
 * @typedef {object} formatedDate
 * @property {number} date
 * @property {number} year
 * @property {string} month
 * @property {string} day
 * @property {function(formatedDate):boolean} compare
 */

export default DatePicker;