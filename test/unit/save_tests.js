$(document).ready(function() {
module('Save');


function save_tests_setup() {
	window.localStorage.clear();
	MilkCrate.initBucket({bucket: 'users'});
}

test('Simple save/get',function(){
	save_tests_setup();
	expect(3);


	var ob = {_id:1, name: 'alice'};
	MilkCrate.users.save(ob);
	var loaded = MilkCrate.users.get(1);

	equals(ob._id, loaded._id );
	equals(ob.name, loaded.name);
	same(ob,loaded);

});
test('Multiple Inserts autoassign incrementing ids',function(){
	save_tests_setup();
	expect(2);

	var alice   = {name: 'alice'};
	var bob     = {name: 'bob'};
	var charlie = {name: 'charlie'};
	var dave    = {name: 'dave'};

	MilkCrate.users.save(alice);
	MilkCrate.users.save(bob);
	MilkCrate.users.save(charlie);
	MilkCrate.users.save(dave);

	same(charlie.name, MilkCrate.users.get(3).name);
	same(3, MilkCrate.users.get(3)._id);
});


test('Upsert, no existing,  No multiples ',function(){
	save_tests_setup();
	expect(2);

	MilkCrate.users.update( {name:'alice'} , {name:'alice'}, true, false);
	var found = MilkCrate.users.find( {name:'alice'} );

	equal(found.length, 1, 'Should only find one upserted item');
	same(found[0],{_id: 1, name:'alice'});
});

test('Update existing item, no multiples',function(){
	save_tests_setup();
	expect(2);

	MilkCrate.users.save( {name:'alice'} );
	MilkCrate.users.save( {name:'bob'} );
	MilkCrate.users.save( {name:'charlie'} );
	MilkCrate.users.save( {name:'dave'} );

	MilkCrate.users.update( {name:'alice'} , {name:'alice',age:21}, true, false);

	var loaded = MilkCrate.users.get(1);
	var twentyone = MilkCrate.users.find({age:21});


	same(loaded,{_id: 1, name:'alice',age:21});
	same(twentyone,[{_id: 1, name:'alice',age:21}]);

});

test('Update existing items, with multiples',function(){
	save_tests_setup();
	expect(1);

	MilkCrate.users.save( {name:'alice' ,age:21} );
	MilkCrate.users.save( {name:'bob' ,age:21} );
	MilkCrate.users.save( {name:'charlie',age:32 } );
	MilkCrate.users.save( {name:'dave' ,age:34 } );

	MilkCrate.users.update( {age:21} , {birthday:'today'}, false, true);

	party = MilkCrate.users.find({birthday:'today'});

	same( party, [ { _id: 1, name: "alice", age: 21, birthday: "today" },
				   { _id: 2, name: "bob", age: 21 , birthday: "today" } ]);

});
test('Update using modifier: $inc (increment)',function(){
	save_tests_setup();
	expect(2);

	MilkCrate.users.save( {name:'alice' ,age:21} );
	MilkCrate.users.save( {name:'bob' ,age:21} );
	MilkCrate.users.save( {name:'charlie',age:32 } );
	MilkCrate.users.save( {name:'dave' ,age:32 } );

	MilkCrate.users.update( {age:21} , {$inc : { age: 1 }}, false, true);
	var updated = MilkCrate.users.find( {age:22});
	var unchanged = MilkCrate.users.find( {age:32});


	same( updated, [ { _id: 1, name: "alice", age: 22 },
				   { _id: 2, name: "bob", age: 22} ],'Expect users of age 21 to now be 22');
	same( unchanged, [ { _id: 3, name: "charlie", age: 32 },
				   { _id: 4, name: "dave", age: 32} ],'Expect users who do not match criteria to not be updated');

});
test('Update using modifier: $inc (increment) with higher step value',function(){
	save_tests_setup();
	expect(1);

	MilkCrate.users.save( {name:'alice' ,age:21} );
	MilkCrate.users.save( {name:'bob' ,age:21} );
	
	MilkCrate.users.update( {age:21} , {$inc : { age: 7 }}, false, true);
	var updated = MilkCrate.users.find( {age:28});

	same( updated, [ { _id: 1, name: "alice", age: 28 },
				   { _id: 2, name: "bob", age: 28} ],'Expect users of age 21 to now be 28');
	

});



});