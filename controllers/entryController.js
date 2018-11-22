const mongoose = require('mongoose');
const Entry = mongoose.model('Entry');

exports.addEntry = (req, res) => {
	res.render('addEntry', {title: 'Record Your Points!'});
};

exports.createEntry = async (req, res) => {
	req.body.author = req.user._id;
	console.log(req.body);
	const entry = await (new Entry(req.body)).save();
	req.flash('success', `Successfully created!`);
	res.redirect(`/addEntry`);
}; 

exports.updateEntry = async (req, res) => {
	const entry = await Entry.findOneAndUpdate({_id: req.params.id}, req.body, {
		new: true, // return the new entry instead of the old one
		runValidators: true
	}).exec(); 
	req.flash('success', `Successfully updated!`);
	res.redirect(`/addEntry`);
};

exports.getEntryBySlug = async (req, res, next) => {
	const entry = await Entry.findOne({ slug: req.params.slug }).populate('author');
	if(!entry) {
		return next();
	}
	res.render('entry', {entry, title: entry.name});
}

exports.getEntries = async (req, res, next) => {
	const page = req.params.page || 1;
	const limit = 6;
	const skip = (page * limit) - limit;

	const entriesPromise = Entry
		.find()
		.skip(skip)
		.limit(limit)
		.sort({created: 'desc'});
	const countPromise = Entry.count();

	const [entries, count] = await Promise.all([entriesPromise, countPromise]);

	const pages = Math.ceil(count / limit);
	if (!entries.length && skip) {
		req.flash('info', `Hey! You asked for page ${page}. But that doesn't exist, so I put you on page ${pages}.`);
		res.redirect(`/entries/page/${pages}`)
	}
	res.render('entries', {title: 'Entries', entries, page, pages, count});
};

const confirmOwner = (entry, user) => {
	if(!entry.author.equals(user._id)) {
		throw Error('You must own an entry in order to edit it!')
	}
};