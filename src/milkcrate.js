/**
 * MilkCrateJS
 * Copyright 2010, Garrow Bedrossian
 * 
 *
 **/
(function(){

MilkCrate = {
	engine:null,
	initBucket: function initBucket(config) {
		if (!MilkCrate.engine) {
			MilkCrate.engine = window.localStorage;
		}

		MilkCrate[config.bucket] = {
			bucket: config.bucket,
			meta: {nextId: 1,rows:0},

			init: function init(){
				if ( MilkCrate._exists(this.bucket+'.meta')) {
					this.meta = MilkCrate._load(this.bucket+'.meta');
				}

			},
			get: function get(id){
				return MilkCrate._load(this._id(id));

			},
			find: function find(qry){
				var results = [];
				if (!qry) {
					// todo return all
				}

				if (typeof qry === 'object') {

					//
					if (qry._id) {
						if (MilkCrate._type(qry._id) == 'array'){
							for (var id in qry._id) {
								results.push(this.get(qry._id[id]));
							}
						} else {
							// simple case, we still return array
							// todo, handle arrays of ids
							results.push(this.get(qry._id));
						}
					
					} else {
						
						var required = 0;
						if ( qry.$and ){
							for (var clause in qry.$and) {
								if (qry.$and.hasOwnProperty(clause)) {
									required++;
								}
							}
							qry = qry.$and;
						} else {
							required = 1;
						}

						for (var cursor = 0; cursor < this.meta.rows; cursor++) {
							var current = this.get(cursor+1);
							var found = 0;
							for (var selector in qry) {
								if ( typeof current[selector] !== undefined ) {
									if (current[selector] === qry[selector]) {
										found++;
									}
								}
							}
							if (found >= required ) {
								results.push(current);
							}
						}

						
					}
				}
				
				return results;
			},
// ----------------------------------------------------------------------------

			// implements the mongodb equivalent
			//db.collection.update( criteria, objNew, upsert, multi )
			//
			//Arguments:
			//
			//criteria - query which selects the record to update;
			//objNew - updated object or $ operators (e.g., $inc) which manipulate the object
			//upsert - if this should be an "upsert"; that is, if the record does not exist, insert it
			//multi - if all documents matching criteria should be updated (the default is to only update the first document found)

			update: function update( criteria, objNew, upsert, multi ){
				upsert = (upsert) ? upsert : true;
				multi = (multi) ? multi : false;

				var updatables = this.find(criteria);


				if ( updatables.length === 0 ) {
					if (upsert === true) {
						// insert
						objNew._id = this._newId();
						saveid = this._id(objNew._id);
						this.meta.rows++;
						MilkCrate._save( saveid, objNew );
						this.saveMeta();
					}
				} else {
					
					if (!multi) {
						// only update the first element
						updatables = updatables.slice(0,1);
					}
				
					for (var u in updatables) {
						var current = updatables[u];
						
						for (var attr in objNew) {
							if (objNew.hasOwnProperty(attr)) {
								current[attr] = objNew[attr];
							}
						}
						MilkCrate._save(this._id(current._id), current);
						this.saveMeta();
					}
				}
			},
			/**
			 *
			**/
			save: function save(obj) {
				if (obj._id === undefined || obj._id === null ) {
					obj._id = this._newId();
				}
				var key = this._id(obj._id);

				// merge existing.
				var existing = MilkCrate._load(key);
				if (existing !== null) {
					for (var attr in obj) {
						if (obj.hasOwnProperty(attr)) {
							existing[attr] = obj[attr];
						}
						
					}
					MilkCrate._save(key,existing);
					this.saveMeta();
				} else {
				// new row
					this.meta.rows++;
					MilkCrate._save(key,obj);
					this.saveMeta();
				}




			},
			_id: function _id(id){
				return this.bucket + '[' + id +']';
			},
			_newId: function _newId(){
				return this.meta.nextId++;
			},
			saveMeta: function saveMeta() {
				MilkCrate._save(config.bucket+'.meta',this.meta);
			}

		};
// ---------bucket






	},
	// direct copy from Qunit hoozit()
	_type: function (o) {
		// Determine what is o.
		
		// shameless copypasta from Qunit.is()
		// Safe object type checking
		var is = function ( type, obj ) {
			return Object.prototype.toString.call( obj ) === "[object "+ type +"]";
		};

		if (is("String", o)) {
			return "string";

		} else if (is("Boolean", o)) {
			return "boolean";

		} else if (is("Number", o)) {

			if (isNaN(o)) {
				return "nan";
			} else {
				return "number";
			}

		} else if (typeof o === "undefined") {
			return "undefined";

		// consider: typeof null === object
		} else if (o === null) {
			return "null";

		// consider: typeof [] === object
		} else if (is( "Array", o)) {
			return "array";

		// consider: typeof new Date() === object
		} else if (is( "Date", o)) {
			return "date";

		// consider: /./ instanceof Object;
		//		   /./ instanceof RegExp;
		//		  typeof /./ === "function"; // => false in IE and Opera,
		//										  true in FF and Safari
		} else if (is( "RegExp", o)) {
			return "regexp";

		} else if (typeof o === "object") {
			return "object";

		} else if (is( "Function", o)) {
			return "function";
		} else {
			return undefined;
		}
	},
	_save: function(key,obj) {
		MilkCrate.engine.setItem(key,JSON.stringify(obj));
	},
	_load: function(key){
		var obj = MilkCrate.engine.getItem(key);
		if (obj !== null) {
			return JSON.parse(obj);
		}
	   return null;
	},
	_exists: function(key){
		return MilkCrate.engine.getItem(key) !== null;
	}
}

//end closure
}());