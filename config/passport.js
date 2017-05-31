var LocalStrategy   = require('passport-local').Strategy;

module.exports = function(passport) {
	passport.serializeUser(function(user, done) {
        done(null, 'admin');
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        done(null, {username:'admin'});
    });

	passport.use(new LocalStrategy(
	    function(username, password, done) {
	    	if (username !== 'admin')
	            return done(null, false);

	        if (password !== 'admin')
	            return done(null, false);

	        return done(null, {username:'admin'});
    }));
};