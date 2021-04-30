const gamePage = (req, res) => {
  res.render('app', { csrfToken: req.csrfToken() });
};

module.exports.gamePage = gamePage;
