MilkCrate
===========

MilkCrate is a wrapper around html localStorage/globalStorage that provides
support for saving and querying collections of objects.

MilkCrate attempts to implement a similar querying interface to mongoDB.
http://www.mongodb.org


Using MilkCrate
------------

Create a bucket for your collection.
`MilkCrate.initBucket( {bucket: 'users'} );`

This generates a bucket, giving you access to it directly from the MilkCrate object.

Save a new user
`MilkCrate.users.save( { name: 'Alice', email: 'alice@example.com' } );`

Find users named 'Alice'
`MilkCrate.users.find({name:'Alice'});`

For more info see the unit tests or full documentation.



TODO
-----

 - API Documentation, currently the unit tests are it.

 - Mongodb style group() queries.  find/group somewhat like map/reduce

 - Implement shims for browsers that don't support localStorage.

