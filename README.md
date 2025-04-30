# NC News Seeding

If you would like to see the hosted version of this repo please followe this link:
    https://nc-news-rvfa.onrender.com/api

This project is a database of articles, topics, users and comments. Data is accessible through various endpoints as detailed in the link above. 

To use this repo yourself, fork this repo through github and then clone into your preferred local folder.

Install the dependencies using
    npm install

You must create two .env files for your databases:

    .env.test (for the test database).
        This file will direct to the test database i.e.
        PGDATABASE='INSERT TEST DATABASE NAME HERE'
        
    .env.development (for the development database).
        This file will direct to the development database i.e.
         PGDATABASE='INSERT DEVELOPMENT DATABASE NAME HERE'    

Seed the database using the following scripts
    npm run setup-dps
    npm run seed-dev

You can run tests using 
    npm test [file-name-here]
    eg
    npm test app

Minimum versions
node.js >=23.8.0
postgres >=16.8


