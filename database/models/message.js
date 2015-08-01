var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var schema = {
	from : {
		type : Schema.ObjectId,
		ref : 'User'
	},
	to : {
		type : Schema.ObjectId,
		ref : 'User'
	},
	content : {
		type : String,
		required : true
	},
	created : {
		type : Number,
		default : new Date().getTime()
	}
};

var MongooseSchema = new mongoose.Schema(schema);

mongoose.model('Message', MongooseSchema);

exports.schema = schema;