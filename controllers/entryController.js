const mongoose = require('mongoose');
const Entry = mongoose.model('Entry');

exports.addEntry = (req, res) => {
	res.render('addEntry', {title: 'Record Your Points!'});
};

exports.createEntry = async (req, res) => {
	req.body.author = req.user._id;
	const entry = await (new Entry(req.body)).save();
	req.flash('success', `Successfully created! Care to leave a review?`);
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

/*exports.getEntryBySlug = async (req, res, next) => {
	const entry = await Entry.findOne({ slug: req.params.slug }).populate('author');
	if(!entry) {
		return next();
	}
	res.render('store', {store, title: store.name});
}*/