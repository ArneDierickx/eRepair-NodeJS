18/04
======
no user feedback when a write-message goes well?

connection.connect();
connection.query(query, message, function (err) {});
-> I'm not sure this will always work ... What if the query is executed before the connection is open?
Remember that NodeJS is asynchronous ! (see https://www.w3schools.com/nodejs/nodejs_mysql.asp)

not much code to comment on ...
