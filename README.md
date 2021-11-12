# JavaScript-DecimalIntegersInWords

This adapter when it is passed a positive whole number will return that number in words with the appropriate punctuation marks.  If the positive whole number passed is in exponential notation, that is the parameter passed to the adapter is expressed in exponential notation, then this is considered to be an exception by the adapter.  It is an adapter because it adapts positive integers into their words representation.

## Dependencies - Command-line Use, Development and Unit Testing

### Command-line Use

##### Node is a dependency in order to run the adapter

For project only use install __Node__ local to the project, that is from inside the folder of the project:

```
cd ./project_folder

npm install --save-dev node
```

For global use install __Node__ as follows:

```
npm install -g node
```

### Development

In order to use the adapter in a development environment, it is advisable to create a project.  This can be done by making a project folder and then initialising it as a project:

```
mkdir ./project_folder

cd ./project_folder

npm init -y
```

In development it is usual to unit test new functional behaviour, therefore it is recommended to install the __Jest__ unit testing framework as shown in the next section.

### Unit Testing

It is recommended to use the __Jest__ unit testing framework.  The unit test of the adapter comes ready packaged with a __Jest__ unit test in the `__test__` folder.  This can be done in the project folder by installing the __Jest__ package:

```
npm install --save-dev jest
```

In the file __package.json__ in the project folder, ensure the following entry is in place:

```
  "scripts": {
    "test": "jest"
  }
 ```

## Example Usage

This repo contains a __Node__ script called __exampleUsage.js__, which can be run using the __Node__ server as follows:

```
node ./exampleUsage.js

nine hundred and ninety nine million, nine hundred thousand and one
```

As can be seen, the adapter takes positive integers as arguments and then converts them into their word representation (property: __decimalIntegerInWords__ in the objects), with the usual punctuation. 
