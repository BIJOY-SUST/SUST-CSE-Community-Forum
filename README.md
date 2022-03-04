# SUST-CSE-Community-Forum

This is the code of our project for the course  ***CSE 446: Web Technologies***

![image](https://user-images.githubusercontent.com/39720940/127362104-6e77704b-7eb1-48e5-ae26-a6267ca00084.png)

Descriptions of the project is in [*description.md*](https://github.com/BIJOY-SUST/SUST-CSE-Community-Forum/blob/master/description.md)


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

