const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');

const entrySchema = new mongoose.Schema({
	name: {
		type: String,
		trim: true,
		required: 'Please enter an entry name!'
	},
	dateOfEvent: {
		type: Date,
		required: 'Please enter a date!'
	},
	created: {
		type: Date,
		default: Date.now
	},
	action: {
		type: String,
		trim: true,
		required: 'Please enter an action!'
	},
	points: {
		type: Number,
		min: 1,
		max: 500,
		required: 'Please enter your points!'
	},
	description: {
		type: String,
		trim: true, 
		required: 'Please enter a description!'
	},
	slug: String,
	author: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: 'You must supply an author!'
	}	
});

entrySchema.pre('save', async function(next){
	if (!this.isModified('name')){
		next(); //skip it
		return; // stop this function from running
	}
	this.slug = slug(this.name);
	//find other entries that have a slug of wes, wes-1, wes-2
	const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
	const entriesWithSlug = await this.constructor.find({ slug: slugRegEx });
	if(entriesWithSlug.length) {
		this.slug = `${this.slug}-${entriesWithSlug.length + 1}`;
	}
	next();
});

module.exports = mongoose.model('Entry', entrySchema);