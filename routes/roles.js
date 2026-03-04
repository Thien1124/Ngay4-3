var express = require('express');
var router = express.Router();
let { dataRoles, dataUsers } = require('../utils/data');

function genRoleId() {
  let ids = dataRoles.map(
    function (e) {
      return Number.parseInt(String(e.id).replace('r', ''))
    }
  )
  return 'r' + (Math.max(...ids) + 1)
}

router.get('/', function (req, res, next) {
  res.send(dataRoles);
});

router.get('/:id', function (req, res, next) {
  let id = req.params.id;
  let result = dataRoles.filter(
    function (e) {
      return e.id == id
    }
  )
  if (result.length) {
    res.send(result[0]);
  } else {
    res.status(404).send({
      message: "ID NOT FOUND"
    });
  }
});

router.get('/:id/users', function (req, res, next) {
  let id = req.params.id;
  let result = dataRoles.filter(
    function (e) {
      return e.id == id
    }
  )
  if (!result.length) {
    res.status(404).send({
      message: "ID NOT FOUND"
    });
    return;
  }

  let usersInRole = dataUsers.filter(
    function (e) {
      return e.role && e.role.id == id
    }
  )
  res.send(usersInRole)
});

router.post('/', function (req, res, next) {
  let newRole = {
    id: genRoleId(),
    name: req.body.name,
    description: req.body.description,
    creationAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }
  dataRoles.push(newRole)
  res.send(newRole)
})

router.put('/:id', function (req, res, next) {
  let id = req.params.id;
  let result = dataRoles.filter(
    function (e) {
      return e.id == id
    }
  )
  if (!result.length) {
    res.status(404).send({
      message: "ID NOT FOUND"
    });
    return;
  }

  result = result[0];
  let keys = Object.keys(req.body);
  for (const key of keys) {
    result[key] = req.body[key];
  }
  result.updatedAt = new Date(Date.now())

  for (const user of dataUsers) {
    if (user.role && user.role.id == id) {
      user.role = {
        id: result.id,
        name: result.name,
        description: result.description
      }
      user.updatedAt = new Date(Date.now())
    }
  }

  res.send(result)
})

router.delete('/:id', function (req, res, next) {
  let id = req.params.id;
  let index = dataRoles.findIndex(
    function (e) {
      return e.id == id
    }
  )
  if (index < 0) {
    res.status(404).send({
      message: "ID NOT FOUND"
    });
    return;
  }

  let usersInRole = dataUsers.filter(
    function (e) {
      return e.role && e.role.id == id
    }
  )
  if (usersInRole.length) {
    res.status(400).send({
      message: "ROLE IS IN USE"
    });
    return;
  }

  let removedRole = dataRoles.splice(index, 1)[0];
  res.send(removedRole)
})

module.exports = router;
