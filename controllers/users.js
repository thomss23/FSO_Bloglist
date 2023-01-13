const User = require('../models/user')
const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()

usersRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body
  
    if (!username || !password) {
      return response.status(400).json({error: "Username and password are required"});
    }
    
    if (username.length < 3 || password.length < 3) {
      return response.status(400).json({error: "Username and password must be at least 3 characters"});
    }
  
    try {
      const user = await User.findOne({username});
      if (user) {
        return response.status(400).json({error: "Username is already taken"});
      }
    } catch(err) {
      return response.status(500).json({error: "Error checking for existing user"});
    }
  
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
  
    const user = new User({
      username,
      name,
      passwordHash,
    })
  
    const savedUser = await user.save()
  
    response.status(201).json(savedUser)
})
  
usersRouter.get('/', async (request, response) => {
    const users =  await User.find({}).populate('blogs')
  
    const usersToJson = users.map(user => user.toJSON())
  
    response.status(200).json(usersToJson)
})

module.exports = usersRouter