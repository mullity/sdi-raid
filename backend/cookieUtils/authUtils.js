const createNewToken = (username, secretKey,knexInstance) => {
  const jwt = require("jsonwebtoken");
  const token = jwt.sign({ username }, secretKey, { expiresIn: "1h" });
  console.log(token);
  //Create token in DB
  return knexInstance('users').select('id').where('username', username).then(userId => {
    console.log(userId)
    return knexInstance('logins')
      .insert({
        user_id: userId[0].id,
        token: token
      })
      .then(() => token)
      .catch(err => err)
  }).catch(err => err)

};

module.exports = {
  createNewToken: createNewToken
}