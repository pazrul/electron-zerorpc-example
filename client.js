const ipc = require('electron').ipcRenderer;
let output;
let errorHeader;

function sendData(dataName, value) {
    hideError();
    if (value) {
        ipc.send(dataName, value);
    } else {
        ipc.send(dataName);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const mapping = {
        string: 'A Test String',
        int: 99,
        float: 9.99,
        list: [1, '2', 3, true],
        object: {
            key: 'value'
        },
        bool: true
    };

    output = document.getElementById('output');
    errorHeader = document.getElementById('error');

    const sayHello = document.getElementById('sayHello');
    const getArray = document.getElementById('getArray');
    const getObject = document.getElementById('getObject');
    const sendValue = document.getElementById('sendValue');

    sayHello.addEventListener('click', () => sendData('hello'));
    getArray.addEventListener('click', () => sendData('array'));
    getObject.addEventListener('click', () => sendData('object'));
    sendValue.addEventListener('click', () => {
        const group = document.getElementById('typeGroup')
        const selectedButton = group.querySelector('input:checked');
        if (selectedButton) {
            const selectedValue = selectedButton.value
            sendData('type', mapping[selectedValue]);
        } else {
            writeError('Select a Type First!');
        }
    });

    addListeners();
});


function addListeners() {
    ipc.on('hello-response', (_, data) => addLi(data));
    ipc.on('array-response', (_, data) => addLi(`${data.constructor.name} - ${data}`));
    ipc.on('object-response', (_, data) => addLi(`${data.constructor.name} - ${JSON.stringify(data)}`));
    ipc.on('type-response', (_, data) => {
        const printableValue = data.value instanceof Object ? JSON.stringify(data.value) : data.value;
        addLi(`${printableValue} is ${data.type}`)
    })
}

function addLi(text) {
    const liElem = document.createElement('li');
    liElem.textContent = text;
    output.appendChild(liElem);
}

function writeError(msg) {
    errorHeader.textContent = msg;
    if (msg === '') {
        hideError();
    } else {
        showError();
    }

}

function showError() {
    errorHeader.classList.remove('hidden');
}

function hideError() {
    errorHeader.classList.add('hidden');
}