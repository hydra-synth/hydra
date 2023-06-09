# Contributing Code

## Running locally
To run locally, you must have nodejs, yarn and npm installed. Install node and npm from: https://nodejs.org/en/

Install yarn from the command line
```
npm install --global yarn
```
open terminal and enter directory
```
cd hydra
```
install dependencies:
```
yarn install
```
run server
```
yarn serve
```
go to https://localhost:8000 in the browser

## To develop
Edit [frontend/public/index.html](frontend/public/index.html) to load 'bundle.js' rather than 'bundle.min.js'

Run development server
```
yarn dev
```
