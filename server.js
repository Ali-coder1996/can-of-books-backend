'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const mongoose =require('mongoose')
const app = express();
app.use(cors());
const PORT = process.env.PORT || 3001;
const myUserModel =require('./model/schemas');

mongoose.connect('mongodb://localhost:27017/books', {useNewUrlParser: true, useUnifiedTopology: true});

const client = jwksClient({
  jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
});

const getKey=(header, callback)=>{
  client.getSigningKey(header.kid, function(err, key) {
      const signingKey = key.publicKey || key.rsaPublicKey;
      callback(null, signingKey);
    });
}

app.get('/auth',(req,res)=>{
  const token=req.headers.authorization.split(' ')[1];
  jwt.verify(token,getKey,{},(err,user)=>{
      if(err){
          res.send('invalid token');
      }
      res.send(user)
  })
});

function seedOwerCollection(){
  const ali =new myUserModel({
    email: 'alisalamehhjouj@gmail.com',
    book:[{
      title:'the silent patient',
      description:' a woman  act of violence against her husband—and of the therapist obsessed with uncovering her motive. ... One evening her husband Gabriel returns home late from a fashion shoot, and Alicia shoots him five times in the face, and then never speaks another word',
      status: '	Alex Michaelides'
    },
    {
      title:'The Big Short',
      description:' Inside the Doomsday Machine” is a very informative and entertaining book. For those looking to understand the basics of the 2008 financial crisis, this is one very good place to start',
      status: 'Michael James Burry'
    },
    {
      title:'War and Peace ',
      description:'  is a literary work mixed with chapters on history and philosophy by the Russian author Leo Tolstoy, first published serially, then published in its entirety in 1869.',
      status: 'Leo Tolstoy'
    },]
  })
  ali.save()
  console.log(ali)
}
// seedOwerCollection();
//http://localhost:3001/books?email=alisalamehhjouj@gmail.com
app.get('/books', (req, res) => {
  let {email} = req.query
  myUserModel.find({email : email},(error, item)=>{
    if(error){
      res.send('we have error')
    }else {
      res.send(item[0].book)
    }
  })
})

app.listen(PORT, () => console.log(`listening on ${PORT}`));
