const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');
const entryController = require('../controllers/entryController');
const { catchErrors } = require('../handlers/errorHandlers');

// Stores
router.get('/', catchErrors(storeController.getStores));
router.get('/stores', catchErrors(storeController.getStores));
router.get('/stores/page/:page', catchErrors(storeController.getStores));
router.get('/add', 
	authController.isLoggedIn, 
	storeController.addStore
);
router.post('/add', 
	storeController.upload,
	catchErrors(storeController.resize),
	catchErrors(storeController.createStore)
);
router.post('/add/:id', 
	storeController.upload,
	catchErrors(storeController.resize),
	catchErrors(storeController.updateStore)
	);
router.get('/stores/:id/edit', catchErrors(storeController.editStore));
router.get('/store/:slug', catchErrors(storeController.getStoreBySlug));

router.get('/tags', catchErrors(storeController.getStoresByTag));
router.get('/tags/:tag', catchErrors(storeController.getStoresByTag));


// Users, Auth, Accounts, and more - KEEP
router.get('/login', userController.loginForm);
router.post('/login', authController.login);
router.get('/register', userController.registerForm);
router.post('/register', 
	userController.validateRegister,
	userController.register,
	authController.login
); 
router.get('/logout', authController.logout);
router.get('/account', 
	authController.isLoggedIn,
	userController.account
);
router.post('/account', catchErrors(userController.updateAccount));
router.post('/account/forgot', catchErrors(authController.forgot));
router.get('/account/reset/:token', catchErrors(authController.reset));
router.post('/account/reset/:token', 
	authController.confirmedPasswords, 
	catchErrors(authController.update)
);

// Maps, Hearts, Reviews
router.get('/map', storeController.mapPage);
router.get('/hearts', authController.isLoggedIn, catchErrors(storeController.getHearts));
router.post('/reviews/:id', 
	authController.isLoggedIn, 
	catchErrors(reviewController.addReview)
);
router.get('/top', catchErrors(storeController.getTopStores));

// Entries
router.get('/addEntry', 
	authController.isLoggedIn,
	entryController.addEntry);

router.post('/addEntry', 
	catchErrors(entryController.createEntry)
);
router.post('/addEntry/:id', 
	catchErrors(storeController.updateEntry)
);
router.get('/entries', catchErrors(entryController.getEntries));
router.get('/entry/:slug', catchErrors(entryController.getEntryBySlug));


// APIs
router.get('/api/search', catchErrors(storeController.searchStores));
router.get('/api/stores/near', catchErrors(storeController.mapStores));
router.post('/api/stores/:id/heart', catchErrors(storeController.heartStore));

module.exports = router;
