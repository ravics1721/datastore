# Data Store in MERN

## Get Started

## *API*
 - Go to the api directory
 - install packages `npm install`
 - And create `.env` and csv file that contains the user data
 - `env` will have to following variables
   - `CSV_FILE_PATH` path of csv file
   - `DB_URL` mongodb databse url
   - `PORT` is optional, default value is `5050`
 - In order to migrate data from csv to mongodb database
 - run following command `npm run load:db`
 - once it's done now run the api by `npm run dev`
 - now run the client app to see data on ui


## *Client[UI]*
 - go to the `client` directory 
 - install all packages `npm install`
 - create a `.env` file with following variable 
    - `VITE_API_URL` will have the api url with `/api` end point like `http://localhost:5050/api`
 - run the application `npm run dev`
 - open [`http://127.0.0.1:5173/`](http://127.0.0.1:5173/)


*****