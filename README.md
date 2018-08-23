# Electron GUI for Python Code

## What?
This is a demo application to show an Electron front end interacting with a Python backend. It uses ZeroRPC to send data directly to the other programs. ZeroRPC is a messaging interface built on ton of ZeroMQ and msgpack. It allows you to sent arbitrarty data from one language to another, no parsing or serializing/deserializing required.

This is not bundled to work on all machines. It is a code demo that can work as the starting point for a more expansive application for your own needs.


## Why?
Sometimes you need to talk across programming languages, and sometimes the overhead of a webserver is not worth the effort, or it will only run on a single machine or needs to be deployed to only certain desktops.

This allows you to develop a stand alone application using web technologies for display and interaction, while allowing you to do heavy lifting in Python if you don't think Node is appropriate for your needs.

Maybe you need a library that hasn't been ported to JS, but does exist in Python. Or maybe you want a user interface but your coding background/server backend is in Python.

I dunno, sometimes it's fun to play around with technologies without having to go all in on implementing a complete stack in `<language>`.


## Structure of Code

```text
│ 
├── index.html
├── client.js
├── electron-gui.png
├── main.js
├── package.json
├── README.md
├── styles.css
└── zerorpc-server.py
```

## Getting Started
clone repo:
`git clone https://github.com/pazrul/electron-zerorpc-example.git`

install zmq
* Linux: `sudo apt-get install libzmq3-dev`
* OSX: `brew install zmq`
* Windows: `http://zeromq.org/distro:microsoft-windows`

install dependencies:
`npm install`

Probably want to create a virtual env for python3
`python3 -m venv <target/for/virtual/env>`
`source <target/for/virtual/env>/bin/activate`

install zerorpc for python3
`pip install zerorpc`

run electron to see it working
`npm start`

## Interface
The interface has a number of buttons, all of which will send information to Python through ZeroRPC.

### What do the buttons do?
1. `Say Hello` - Sends a pre-set string to Python. Calls the `hello` method on the someDumbClass instance
2. `Get Files` - Calls the `get_array` method on the SomeDumbClass instance. Returns a list of files in the running directory
3. `Get Object` - Calls the `get_object` method on the SomeDumbClass instance. Returns a dict from Python to the JS client
4. `Send Value` - Calls the `determine_type` method on the SomeDumbClass instance. You pass a value, python tells you the type, and give the value back.
    * The type sent to the Python code is determined by the radio button selected above the Send Value button.

### How do the buttons do?
Each button on the client uses the [ipc interface](https://electronjs.org/docs/api/ipc-renderer) of Electron to send messages back to the main.js file.
In that file are listeners for each of the value sent by the buttons. Those listeners use ZeroRPC to invoke a method in the python code. When the value is returned, a `<type>-response` event is sent back via ipc to a pre-registered event listener where it is exposed to the client side.

## Author
**Jeremy Whitbred** - *(@pazrul)* - [pazrul github](https://github.com/pazrul)

## Quick Gotchas
1. node-gyp will not build properly on node version 10 right now. Use node version 8.*
