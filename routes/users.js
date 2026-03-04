var express = require('express');
var router = express.Router();
let { dataUsers, dataRoles } = require('../utils/data');

router.get('/', function (req, res, next) {
  res.send(dataUsers);
});

router.get('/:username', function (req, res, next) {
  let username = req.params.username;
  let result = dataUsers.filter(
    function (e) {
      return e.username == username
    }
  )
  if (result.length) {
    res.send(result[0]);
  } else {
    res.status(404).send({
      message: "USERNAME NOT FOUND"
    });
  }
});

router.post('/', function (req, res, next) {
  let existedUser = dataUsers.filter(
    function (e) {
      return e.username == req.body.username
    }
  )
  if (existedUser.length) {
    res.status(400).send({
      message: "USERNAME ALREADY EXISTS"
    });
    return;
  }

  let getRole = dataRoles.filter(
    function (e) {
      return e.id == req.body.roleId
    }
  )
  if (!getRole.length) {
    res.status(404).send({
      message: "ROLE ID NOT FOUND"
    });
    return;
  }

  let role = getRole[0];
  let newUser = {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    fullName: req.body.fullName,
    avatarUrl: req.body.avatarUrl,
    status: req.body.status ?? true,
    loginCount: req.body.loginCount ?? 0,
    role: {
      id: role.id,
      name: role.name,
      description: role.description
    },
    creationAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }

  dataUsers.push(newUser)
  res.send(newUser)
})

router.put('/:username', function (req, res, next) {
  let username = req.params.username;
  let result = dataUsers.filter(
    function (e) {
      return e.username == username
    }
  )
  if (!result.length) {
    res.status(404).send({
      message: "USERNAME NOT FOUND"
    });
    return;
  }

  result = result[0];

  let keys = Object.keys(req.body);
  for (const key of keys) {
    if (key == 'roleId') {
      let getRole = dataRoles.filter(
        function (e) {
          return e.id == req.body.roleId
        }
      )
      if (!getRole.length) {
        res.status(404).send({
          message: "ROLE ID NOT FOUND"
        });
        return;
      }
      let role = getRole[0];
      result.role = {
        id: role.id,
        name: role.name,
        description: role.description
      }
      continue;
    }

    if (key == 'username') {
      let existedUser = dataUsers.filter(
        function (e) {
          return e.username == req.body.username && e.username != username
        }
      )
      if (existedUser.length) {
        res.status(400).send({
          message: "USERNAME ALREADY EXISTS"
        });
        return;
      }
    }

    result[key] = req.body[key];
  }

  result.updatedAt = new Date(Date.now())
  res.send(result)
})

router.delete('/:username', function (req, res, next) {
  let username = req.params.username;
  let index = dataUsers.findIndex(
    function (e) {
      return e.username == username
    }
  )
  if (index < 0) {
    res.status(404).send({
      message: "USERNAME NOT FOUND"
    });
    return;
  }

  let removedUser = dataUsers.splice(index, 1)[0];
  res.send(removedUser)
});

module.exports = router;
