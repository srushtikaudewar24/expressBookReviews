const express = require('express');
const axios = require('axios');
const books = require('./booksdb.js');
const {isValid, users} = require('./auth_users.js');
const public_users = express.Router();

public_users.post('/register', (req, res) => {
  const {username, password} = req.body || {};
  if (typeof username !== 'string' || !username.trim() || typeof password !== 'string' || !password) return res.status(400).json({message:'Please provide a username and password'});
  if (isValid(username)) return res.status(409).json({message:'User already exists'});
  users.push({username, password});
  return res.status(201).json({message:'User successfully registered. Now you can log in.'});
});
public_users.get('/', (req,res) => res.status(200).json(books));
public_users.get('/isbn/:isbn', (req,res) => {
  const book = books[req.params.isbn];
  return book ? res.status(200).json(book) : res.status(404).json({message:'Book not found'});
});
public_users.get('/author/:author', (req,res) => {
  const matches = Object.fromEntries(Object.entries(books).filter(([,b]) => b.author.toLowerCase() === req.params.author.toLowerCase()));
  return res.status(200).json(matches);
});
public_users.get('/title/:title', (req,res) => {
  const matches = Object.fromEntries(Object.entries(books).filter(([,b]) => b.title.toLowerCase() === req.params.title.toLowerCase()));
  return res.status(200).json(matches);
});
public_users.get('/review/:isbn', (req,res) => {
  const book=books[req.params.isbn];
  return book ? res.status(200).json(book.reviews) : res.status(404).json({message:'Book not found'});
});

// Async/await and Axios implementations for the final asynchronous tasks.
const API_URL=process.env.BOOKSTORE_API_URL || 'http://localhost:5000';
const getAllBooks=async()=> (await axios.get(`${API_URL}/`)).data;
const getBooksByISBN=async isbn => (await axios.get(`${API_URL}/isbn/${encodeURIComponent(isbn)}`)).data;
const getBooksByAuthor=async author => (await axios.get(`${API_URL}/author/${encodeURIComponent(author)}`)).data;
const getBooksByTitle=async title => (await axios.get(`${API_URL}/title/${encodeURIComponent(title)}`)).data;
module.exports={general:public_users,getAllBooks,getBooksByISBN,getBooksByAuthor,getBooksByTitle};
