interface DatePickerOptions {
    maxYear: number;
    minYear: number;
    defaultDate: string;
}

interface FormatedDate {
    data: number;
    year: number;
    day: 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';
    month: 'jan' | 'feb' | 'mar' | 'apr' | 'may' | 'jun' | 'jul' | 'aug' | 'sept' | 'oct' | 'nov' | 'dec',
    monthNumber: string
}

declare module 'html-datepicker-js' {
    export function DatePicker(activator: HTMLElement | string, options: DatePickerOptions): FormatedDate
}