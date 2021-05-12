const gamePage = (req, res) => {
  console.log(req.session.account);
  res.render('app', { csrfToken: req.csrfToken(), username: req.session.account.username });
};

module.exports.gamePage = gamePage;
