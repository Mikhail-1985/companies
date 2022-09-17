1. Установить зависимости ```npm install```
2. Установить json server ```npm i json-server```
3. Установить concurrently ```npm i concurrently```
4. Добавить строки в package.json в раздел scripts ```"serve": "concurrently \"npm run mock\" \"npm run start\"",
    "mock": "json-server -w db.json -p 4200" ```
5. Запустить приложение ```npm run serve```
