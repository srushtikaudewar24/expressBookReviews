const express=require('express');
const jwt=require('jsonwebtoken');
const books=require('./booksdb.js');
const regd_users=express.Router();
const users=[];
const JWT_SECRET=process.env.JWT_SECRET || 'bookstore-development-secret-change-me';
const isValid=username=>users.some(user=>user.username===username);
const authenticatedUser=(username,password)=>users.some(user=>user.username===username && user.password===password);

regd_users.post('/login',(req,res)=>{
  const {username,password}=req.body||{};
  if(typeof username!=='string'||!username.trim()||typeof password!=='string'||!password) return res.status(400).json({message:'Username and password are required.'});
  if(!authenticatedUser(username,password)) return res.status(401).json({message:'Invalid username or password.'});
  const accessToken=jwt.sign({username},JWT_SECRET,{expiresIn:'1h'});
  req.session.authorization={accessToken};
  return res.status(200).json({message:'User successfully logged in',accessToken});
});
regd_users.put('/auth/review/:isbn',(req,res)=>{
  const isbn=req.params.isbn;
  if(!Object.prototype.hasOwnProperty.call(books,isbn)) return res.status(404).json({message:'Book not found'});
  const review=req.query.review ?? req.body?.review;
  if(typeof review!=='string'||!review.trim()) return res.status(400).json({message:'Review cannot be empty'});
  const username=req.user.username;
  books[isbn].reviews[username]=review.trim();
  return res.status(200).json({message:'Review added or updated successfully',reviews:books[isbn].reviews});
});
regd_users.delete('/auth/review/:isbn',(req,res)=>{
  const isbn=req.params.isbn;
  if(!Object.prototype.hasOwnProperty.call(books,isbn)) return res.status(404).json({message:'Book not found'});
  const username=req.user.username;
  if(!Object.prototype.hasOwnProperty.call(books[isbn].reviews,username)) return res.status(404).json({message:'Review not found for the logged-in user'});
  delete books[isbn].reviews[username];
  return res.status(200).json({message:'Review deleted successfully',reviews:books[isbn].reviews});
});
module.exports={authenticated:regd_users,isValid,authenticatedUser,users,JWT_SECRET};
