const _ = require('underscore');
const models = require('../models');

const { Domo } = models;

const makerPage = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), domos: docs });
  });
};

const makeDomo = (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.wins) {
    return res.status(400).json({ error: 'RAWR! Name, age, and wins are required' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    wins: req.body.wins,
    owner: req.session.account._id,
  };

  const newDomo = new Domo.DomoModel(domoData);

  const domoPromise = newDomo.save();

  domoPromise.then(() => res.json({ redirect: '/maker' }));

  domoPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists.' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });

  return domoPromise;
};

const makeRandomPage = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('random', { csrfToken: req.csrfToken(), domos: docs });
  });
};
const names = ['Jacob', 'Michael', 'Ethan', 'Joshua', 'Daniel', 'Alexander', 'Anthony', 'William', 'Christopher', 'Matthew', 'Jayden', 'Andrew', 'Joseph', 'David', 'Noah', 'Aiden', 'James', 'Ryan', 'Logan', 'John', 'Nathan', 'Elijah', 'Christian', 'Gabriel', 'Benjamin', 'Emma', 'Isabella', 'Emily', 'Madison', 'Ava', 'Olivia', 'Sophia', 'Abigail', 'Elizabeth', 'Chloe', 'Samantha', 'Addison', 'Natalie', 'Mia', 'Alexis', 'Alyssa', 'Hannah', 'Ashley', 'Ella', 'Sarah', 'Grace', 'Taylor', 'Brianna', 'Lily', 'Hailey', 'Anna', 'Victoria'];
const makeRandomDomo = (req, res) => {
  const domoData = {
    name: names[_.random(names.length)],
    age: _.random(1, 100),
    wins: _.random(0, 10),
    owner: req.session.account._id,
  };

  const newDomo = new Domo.DomoModel(domoData);

  const domoPromise = newDomo.save();

  domoPromise.then(() => res.json({ redirect: '/maker' }));

  domoPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists.' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });

  return domoPromise;
};

const getDomos = (request, response) => {
  const req = request;
  const res = response;

  return Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ domos: docs });
  });
};

module.exports.makerPage = makerPage;
module.exports.getDomos = getDomos;
module.exports.make = makeDomo;
module.exports.makeRandom = makeRandomDomo;
module.exports.makeRandomPage = makeRandomPage;
