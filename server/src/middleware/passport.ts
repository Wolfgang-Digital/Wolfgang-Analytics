import { OAuth2Strategy } from 'passport-google-oauth';
import passport from 'passport';
import { get } from 'lodash';

import User, { UserDocument } from '../models/User';
import Account from '../models/Account';
import { oauthConfig, DEV, PORT } from '../config';

passport.serializeUser((user: UserDocument, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  }).catch(e => {
    done('An error occured connecting the database');
  });
});

passport.use('user', new OAuth2Strategy(
  {
    clientID: oauthConfig.clientID,
    clientSecret: oauthConfig.clientSecret,
    callbackURL: `${DEV ? `http://localhost:${PORT}` : 'https://wolfganganalytics.herokuapp.com'}/auth/user/redirect/analytics`
  },
  (accessToken, refreshToken, profile, done) => {
    const { name, emails, photos } = profile;

    const email = get(emails, '[0].value');

    if (!email) {
      done('Could not access email');
      return;
    }

    if (!email.match(/@wolfgangdigital.com$/)) {
      done('This platform is only available to Wolfgang Digital');
      return;
    }

    User.findOne({ email }).then(user => {
      if (user) {
        done(null, user);
        return;
      }
      User.create({
        firstName: name.givenName,
        lastName: name.familyName,
        email,
        profilePicture: get(photos, '[0].value'),
        roles: [],
        permissions: []
      }).then(newUser => {
        done(null, newUser);
      }).catch(e => {
        throw new Error(e);
      });
    }).catch(e => {
      console.log(e);
      done('An error occured while logging in');
    });
  })
);

passport.use('account', new OAuth2Strategy(
  {
    clientID: oauthConfig.clientID,
    clientSecret: oauthConfig.clientSecret,
    callbackURL: `${DEV ? `http://localhost:${PORT}` : 'https://wolfganganalytics.herokuapp.com'}/auth/account/redirect`
  },
  (accessToken, refreshToken, profile, done) => {
    const { emails } = profile;

    const email = get(emails, '[0].value');

    if (!email) {
      done('Could not access email');
      return;
    }

    if (!email.match(/@wolfgangdigital.com$/)) {
      done('This platform is only available to Wolfgang Digital');
      return;
    }

    Account.findOne({ email }).then(account => {
      if (account) {
        done('This account has already been registered');
        return;
      }
      Account.create({
        email,
        accessToken,
        refreshToken
      }).then(newAccount => {
        done(null, newAccount);
      }).catch(e => {
        throw new Error(e);
      });
    }).catch(e => {
      done('An error occured while registering your account');
    });
  })
);

export default passport;