# DatePicker

## Installation

```shell
yarn add datepicker-js
```

## Usage

```JavaScript
import datePicker from 'datepicker-js';

datepicker = datePcker(activator, {
    minYear: 2010,
    maxYear: 2020
});

dateicker.onpick = function(date){
    console.log(date);
}
```

### Parameters

- activator:*string|HTMLElement*
- options:*oject* *minYear:number, maxYear:number, defaultDate:string*

### Returns

- date:*object* *date:number, day:string, month:string, year:number*
