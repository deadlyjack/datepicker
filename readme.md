# DatePicker

A custom HTML datepicker developed in vanilla JavaScript. Easy to use and user friendly

## Installation

```shell
yarn add datepicker-js
```

## Usage

```JavaScript
import datePicker from 'datepicker-js';

datepicker = datePicker(activator, {
    minYear: 2010,
    maxYear: 2020
});

dateicker.onpick = function(date){
    console.log(date);
}
```

### Parameters

- `activator`: `string`|`HTMLElement`
- `options`: **`object`** **minYear**`number`, **maxYear**`number`, **defaultDate**`string`

### Methods

- `onpick`: fires when user picks a date
  - parameter:**`object`** **date**`number`, **day**`string`, **month**`string`, **year**`number`
