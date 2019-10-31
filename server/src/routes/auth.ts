import { Router } from 'express';
import passport from 'passport';

const router = Router();

router.get('/user/login', passport.authenticate('user', {
  scope: [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'
  ]
}));

router.get('/account/register', passport.authenticate('account', {
  scope: [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/analytics.readonly'
  ],
  // @ts-ignore
  accessType: 'offline',
  prompt: 'consent'
}));

router.get('/user/redirect/:platform', passport.authenticate('user', { failureRedirect: '/' }),
  (req, res) => {
    const redirect = req.params.platform === 'awarewolf'
      ? 'https://awarewolf.netlify.com'
      : process.env.NODE_ENV !== 'production' ? 'http://localhost:3000' : 'https://wolfgang-analytics.netlify.com/';
    
    res.redirect(redirect);
  }
);

router.get('/account/redirect', passport.authenticate('account', { failureRedirect: '/', session: false }),
  (req, res) => {
    res.redirect(process.env.NODE_ENV !== 'production' ? 'http://localhost:3000/clients/add-client' : 'https://wolfgang-analytics.netlify.com/clients/add-client');
  }
);

router.get('/logout', (req, res) => {
  req.logOut();
  res.redirect(process.env.NODE_ENV !== 'production' ? 'http://localhost:3000/login' : 'https://wolfgang-analytics.netlify.com/login');
});

export default router