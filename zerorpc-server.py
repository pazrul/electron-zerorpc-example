from os import listdir
import zerorpc

class someBasicClass():
    def hello(self, name):
        return f'Hello, {name}'

    def get_array(self):
        return listdir('.');


    def get_object(self):
        dummyData = {
            'a_key': True,
            'an_array': [1, 2, 3],
            'something_witty': False,
            'string': 'Lorem Ipsum',
            'float': 3.14,
            'int': 9
        }
        return dummyData


    def determine_type(self, some_val):
        return {'value': some_val, 'type': type(some_val).__name__}

server = zerorpc.Server(someBasicClass())
server.bind('tcp://0.0.0.0:4242')
server.run()