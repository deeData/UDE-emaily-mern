﻿const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = ('mongoose');
const keys = require('../config/keys');


//const User = mongoose.model('users');

//Bring over mongoose constructors
var db = require('../models');

//contain id 
passport.serializeUser((user, done) => {
    done( null, user.id );
});

//pull user id 
passport.deserializeUser((id, done) => {
    db.User.findById(id)
        .then((user) => {
            done(null, user);
        });
});


//set up GoogleStrategy to authenticate app with Google
passport.use(
    new GoogleStrategy({
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: '/auth/google/callback',
        proxy: true

        //access token tells Google that the user allowed app to get user's data
        //refresh token refreshes/updates the time period access token is valid
    }, (accessToken, refreshToken, profile, done) => {
        db.User.findOne({ googleId: profile.id })
            .then((existingUser) => {
                if (existingUser) {
                    done(null, existingUser);
                } else {
                    //instance of user
                    new db.User({ googleId: profile.id }).save()
                        .then((user) => {
                            done(null, user)
                        });
                }
            });
        //console.log('accessToken', accessToken);
        //console.log('refreshToken', refreshToken);
        //console.log('profile', profile);
    })
);