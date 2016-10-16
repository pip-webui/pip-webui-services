# Pip.WebUI.Core User's Guide

## <a name="contents"></a> Contents
- [Installing](#install)
- [pipTranslate service](#translate_service)
- [pip-translate directive](#translate)
- [pip-translate-html directive](#translate_html)
- [pipError service](#error)
- [pipTransaction service](#transaction)
- [pipState service](#state)
- [pipTheme service](#theme)
- [pipTimer service](#timer)
- [pipDebug service](#debug)
- [Questions and bugs](#issues)


## <a name="install"></a> Installing

Add dependency to **pip-webui** into your **bower.json** or **package.json** file depending what you use.
```javascript
"dependencies": {
  ...
  "pip-webui": "*"
  ...
}
```

Alternatively you can install **pip-webui** manually using **bower**:
```bash
bower install pip-webui
```

or install it using **npm**:
```bash
npm install pip-webui
```

Include **pip-webui** files into your web application.
```html
<link rel="stylesheet" href=".../pip-webui-lib.min.css"/>
<link rel="stylesheet" href=".../pip-webui.min.css"/>
...
<script src=".../pip-webui-lib.min.js"></script>
<script src=".../pip-webui.min.js"></script>
```


## <a name="translate_service"></a> pipTranslate service

**pipTranslate** service enables translations of strings in web applications.

### Usage

Before using the service, you shall define string resources in your components
during configure phase:
```javascript
    var myModule = angular.module('myModule.Translate', []);

    myModule.config(function (pipTranslateProvider) {

        pipTranslateProvider.translations('en', {
            KEY1: 'Text for key 1',
            KEY2: 'Text for key 2',
            KEY3: '<b>HTML</b> for <i>key 3</i>'
        });

        pipTranslateProvider.translations('ru', {
            KEY1: 'Текст для ключа 1',
            KEY2: 'Текст для ключа 2',
            KEY3: '<b>HTML</b> для <i>ключа 3</i>'
        });
        
    });
```

Then you can all **pipTranslate** service to extract text by key translated for the current language:
```javascript
// Set language
pipTranslate.use('ru');
pipTranslate.translate('KEY1');
```

Methods:
Todo: Describe the service methods


## <a name="translate"></a> pip-translate directive

**pip-translate** directive translates strings inside HTML page.

### Usage
```html
<pip-translate key="KEY1"/>
```

### Attributes
* **key** - key of resource string to translate


## <a name="translate_html"></a> pip-translate-html directive

**pip-translate-tml** directive translates strings, but instead of text it injects HTML into a page.

### Usage
```html
<pip-translate-html key="KEY3"/>
```

### Attributes
* **key** - key of resource string to translate


## <a name="error"></a> pipError service

When page communicates with server, it may perform several transactions at once. When failures occure, they may come in batches. **pipError** service allows to combine multiple errors in specific context. It also helps to decouple business logic that throws errors from UI that visualizes them.

### Usage
Todo: Add code snippet that shows usage of the service

### Methods
Todo: Describe service methods


## <a name="transaction"></a> pipTransaction service

When page communicates with server, it may execute multiple concurrent requests. **pipTransaction** helps to coordinate one or multiple concurrent requests and combine them into a single transaction. It also helps to decouple business logic that performs transaction from UI that visualizes transaction state.

### Usage
Todo: Add code snippet that shows usage of the service

Todo: Add screenshot that shows how transaction state is visualized

### Methods
Todo: Describe service methods


## <a name="state"></a> pipState service

**pipState** service extends **ui-router** with few useful features

### Usage
Todo: Add code snippet that shows usage of the service

### Methods
Todo: Describe service methods


## <a name="theme"></a> pipTheme service

**pipTheme** service allows to change color themes in the application. Theme colors are defined in **pip-webui-css** module

### Usage
Todo: Add code snippet that shows usage of the service

Todo: Add screenshot that shows how few themes

### Methods
Todo: Describe service methods


## <a name="timer"></a> pipTimer service

Web applications often need to perform some tasks periodically - check new data on the server, refresh screen and so on. **pipTimer** service sends events in configured time intervals. That helps to minimize number of timers in the code and coordinate asynchronous processing.

### Usage
Todo: Add code snippet that shows usage of the service

### Methods
Todo: Describe service methods


## <a name="debug"></a> pipDebug service

**pipDebug** service allows to turn on/off debugging state and log debug messages when debugging is enabled.

### Usage
Todo: Add code snippet that shows usage of the service

### Methods
Todo: Describe service methods


## <a name="issues"></a> Questions and bugs

If you have any questions regarding the module, you can ask them using our 
[discussion forum](https://groups.google.com/forum/#!forum/pip-webui).

Bugs related to this module can be reported using [github issues](https://github.com/pip-webui/pip-webui-services/issues).
