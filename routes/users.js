var express = require('express');
const { User } = require('../database/UserModels');
var router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();

function auth(req, res, next) {

  if (req.cookies.token) {
    const token = req.cookies.token
    jwt.verify(token, process.env.userKey, async (err, checkuser) => {

      if (err) {
        if (err) {
          console.log(err)
          return res.status(401).send("invalid token")
        }
        console.log(err)
        return res.status(401).send("token doesn't match")
      }
      console.log(checkuser)
      var result = await User.findOne({ where: { firm_name: checkuser.firm_name } })
      if (!result) {
        return res.status(401).send("no user found")
      }
      result.code = ""
      res.result = result
      req.user = result
      next()
    })
  }
  else {
    return res.status(401).send("No token Provide")

  }
}



router.get('/all', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['firm_name',]
    })

    res.status(200).send(users)
  } catch (error) {
    res.status(401).send(error)
  }
})



router.get('/users', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['firm_name', "email", "last_name", "phone_number", "has_mail", "is_admin", "id"]
    })

    res.status(200).send(users)
  } catch (error) {
    res.status(401).send(error)
  }
})


router.get('/users/:firmName', async (req, res) => {
  try {
    const users = await User.findOne({ where: { firm_name: req.params.firmName } })
    res.status(200).send(users)
  } catch (error) {
    res.status(401).send(error)
  }
})

router.post('/login', async (req, res) => {
  const user = await User.findOne({ where: { firm_name: req.body.firm_name } });
  if (user) {

    const password = user.dataValues.password
    var errors = null
    bcrypt.compare(req.body.password, password, async function (err, bool) {
      if (err) {
        res.status(401).send(err)
      }
      else if (bool === false) {
        res.status(401).send("invalide password")
      }
      else {
        const token = jwt.sign({ firm_name: req.body.firm_name }, process.env.userKey, { expiresIn: '24h' });
        const update = await User.update({ access_token: token }, {
          where: {
            firm_name: req.body.firm_name
          }
        });
        const isUpdate = await User.findOne({ where: { firm_name: req.body.firm_name } });
        isUpdate.password = null
        res.cookie("token", isUpdate.access_token, {
          httpOnly: true,
        })
        res.status(200).send(isUpdate)
      }

    })
  }
  else {
    res.status(401).send('no user found')
  }

})

router.get('/isAuth', auth, (req, res) => {
  console.log('msdklfjsdlkfjsmldfkj')
  res.status(200).send(res.result)

})

router.post('/', async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.code, salt)
    const user = await User.create({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      firm_name: req.body.firm_name,
      email: req.body.email,
      phone_number: req.body.phone_number,
      password: password,
      is_admin: req.body.is_admin,
    });

    res.status(200).send("utilisateur ajouté")
  } catch (error) {
    console.log(error)
    res.status(401).send(error)
  }
})
router.delete('/:firmName', async (req, res) => {
  try {
    const { firmName } = req.params


    await User.destroy({
      where: {
        firm_name: firmName
      }
    });

    res.status(200).send("utilisateur supprimé")

  } catch (error) {
    res.status(401).send(error)

  }
})


router.put('/:firmName', async (req, res) => {
  try {
    const { firmName } = req.params

    const salt = await bcrypt.genSalt(10);
    const update = await User.update({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      firm_name: req.body.firm_name,
      email: req.body.email,
      phone_number: req.body.phone_number,
      password: await bcrypt.hash(req.body.code, salt)

    }, {
      where: {
        firm_name: firmName
      }
    });
    res.status(200).send("utilisateur modifié")

  } catch (error) {
    res.status(401).send(error)

  }
})


router.patch("/", async (req, res) => {
try {
  console.log(req.body)
 await User.update({ has_mail : true },{ where : { firm_name : req.body }}); 



//  envoyer Mail
 res.status(200).send("notification envoyé")
  
} catch (error) {

  res.status(401).send(error)
  
}
})

router.patch('/:firmName',async (req,res)=> {
try {
  await User.update({ has_mail : false },{ where : { firm_name : req.params.firmName }}); 
  const isUpdate = await User.findOne({ where: { firm_name: req.params.firmName } });
  isUpdate.password = null

  res.status(200).send(isUpdate)


} catch (error) {
  console.log(error)
  res.status(401).send(error)

}
})

module.exports = router;
