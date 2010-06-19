module('Find');


function find_tests_setup() {
	window.localStorage.clear();
	MilkCrate.initBucket({bucket: 'users'});
}




test('Find by _id' , function(){
	expect(1);
	find_tests_setup();

	var aliceSave = [{_id:1, name: 'alice'}];
	MilkCrate.users.save(aliceSave[0]);
	var aliceLoad = MilkCrate.users.find({_id:1});

	same(aliceLoad,aliceSave);
});


test('Find using multiple _ids' , function(){
	expect(1);
	find_tests_setup();

	var expected = [{_id:1, name: 'alice'},{_id:2, name: 'bob'},{_id:3, name: 'charlie'},{_id:4, name: 'dave'}];

	MilkCrate.users.save(expected[0]);
	MilkCrate.users.save(expected[1]);
	MilkCrate.users.save(expected[2]);
	MilkCrate.users.save(expected[3]);

	var results = MilkCrate.users.find({_id:[1,2,3,4]});

	same(results,expected);


});



///////////////////////////////////////////////
//	test('find method signatures', function(){
//		window.localStorage.clear();
//		MilkCrate.initBucket({bucket: 'users'});
//
//		MilkCrate.users.find({name:'alice'});
//		MilkCrate.users.find( /regex/ );
//		MilkCrate.users.find('alice');
//		MilkCrate.users.find(function(x){});
//		MilkCrate.users.find({_id: 1});
//		MilkCrate.users.find( ( function(){
//			//closure
//			return 'hello'
//			 } )() );
//	});
///////////////////////////////////////////////
	/**
	 * caught a bug with single items finds failing, wierd
	 **/
test('Find a single item by single attribute' , function(){
	expect(1);
	find_tests_setup();
	MilkCrate.users.save({name:'alice'});
	equals(MilkCrate.users.find({name:'alice'}).length,
		1,
		'Must have a single insert produce a one item');
});


test('Find by matching single attribute' , function(){
	expect(4);
	find_tests_setup();

	MilkCrate.users.save({name:'alice'});
	MilkCrate.users.save({name:'alice'});
	MilkCrate.users.save({name:'alice'});
	MilkCrate.users.save({name:'bob'});
	MilkCrate.users.save({name:'charlie'});
	MilkCrate.users.save({name:'charlie'});
	MilkCrate.users.save({name:'charlie'});

	var alice = MilkCrate.users.find({name:'alice'});
	var bob = MilkCrate.users.find({name:'bob'});
	var charlie = MilkCrate.users.find({name:'charlie'});
	var dave = MilkCrate.users.find({name:'dave'});

	equals(alice.length,3);
	equals(bob.length,1);
	equals(charlie.length,3);
	equals(dave.length,0);
});


test('Match using optional/missing properties' , function(){
	expect(1);
	find_tests_setup();

	MilkCrate.users.save({name:'alice',age:21});
	MilkCrate.users.save({name:'alice'});
	MilkCrate.users.save({name:'alice'});
	MilkCrate.users.save({name:'bob',age:21});
	MilkCrate.users.save({name:'charlie',age:21});
	MilkCrate.users.save({name:'charlie',age:30});
	MilkCrate.users.save({name:'charlie'});

	var keys_to_the_city = MilkCrate.users.find({age:21});


	equals(keys_to_the_city.length,3,
		'Expect 3 users of age 21:');
});


test('Match multiple attributes (OR) ' , function(){
	expect(1);
	find_tests_setup();

	MilkCrate.users.save({name:'alice',age:21});
	MilkCrate.users.save({name:'alice'});
	MilkCrate.users.save({name:'alice'});
	MilkCrate.users.save({name:'bob',age:21});
	MilkCrate.users.save({name:'charlie',age:21});
	MilkCrate.users.save({name:'charlie',age:30});
	MilkCrate.users.save({name:'charlie'});

	var we_built_this_city = MilkCrate.users.find({name:'alice',age:21});


	equals(we_built_this_city.length,5,
		'Expect 5 users who are either 21 or named alice:');
});


test('Match multiple attributes (AND) ' , function(){
	expect(1);
	find_tests_setup();

	MilkCrate.users.save({name:'alice',age:21});
	MilkCrate.users.save({name:'alice',age:33});
	MilkCrate.users.save({name:'alice'});
	MilkCrate.users.save({name:'bob',age:21});
	MilkCrate.users.save({name:'charlie',age:21});
	MilkCrate.users.save({name:'charlie',age:30});
	MilkCrate.users.save({name:'charlie'});

	var we_built_this_city = MilkCrate.users.find({$and: {name:'alice', age:21}});


	equals(we_built_this_city.length,1,
		'Expect 1 user, named alice, age 21:');
});
//
////////////////////////////////////////////////////////////////////////////////
//
//	test('Massive inserts ' , function(){
//		window.localStorage.clear();
//		MilkCrate.initBucket({bucket: 'users'});
//		inserts = 15;
//		names = ['aaa','bbb','ccc','ddd','eee','fff','ggg','hhh','iii','jjj'];
//
//		for (var i = 0; i < inserts; i++) {
//			MilkCrate.users.save({name: names[(i % 10)]});
//		}
//		console.log(MilkCrate.users.meta);
//		var res = MilkCrate.users.find();
//
//
//		equals(res.length,1,
//			'Expect 1 user, named alice, age 21:');
//	});


//	test('Big fat massive insert' , function(){
//		window.localStorage.clear();
//		MilkCrate.initBucket({bucket: 'users'});
//		inserts = 100000;
//		names = ['aaa','bbb','ccc','ddd','eee','fff','ggg','hhh','iii','jjj'];
//
//		items = [];
//		for (var i = 0; i < inserts; i++) {
//			items.push({name: names[(i % 10)]});
//		}
//		console.log(items.length);
//
//		MilkCrate.users.save({ itemsArray: items});
//
//
//		//var res = MilkCrate.users.find();
//
//
//		equals(inserts,items.length,'mesg');
////		equals(res.length,1,
////			'Expect 1 user, named alice, age 21:');
//	});





