# SUST-CSE-Community-Forum

### Server up instruction

1. Download this repository.
2. If your mongodb server does not launches automatically use the following command- 

        {{path_to_mongodb}}/mongodb/bin/mongod --dbpath=/home/{{user_name}}/mongodb-data     
3. Navigate  to the folder  ‘./sustcselife’  using cmd
4. Run the command

        nodemon src/app.js -e hbs,js,css
5. The server will be up and running in your port 3005.
6. Access the website from your browser using the address : localhost:3005


 user_name = Your username on your Linux Machine.  
-dbpath parameter takes the path of the ‘mongodb-data’ file. You can change it accordingly. 

### We used the following languages/Framework/database in our project:

**Backend** - Node.js+Express.js+Cookie-Parser\
**Frontend** - HTML+CSS+Bootstrap+Handlebars+Ajax\
**Database** - MongoDB+Mongoose
### Versions:
MongoDB = db version v3.6.8\
Nodejs = v10.19.0\
NPM = 6.14.4
