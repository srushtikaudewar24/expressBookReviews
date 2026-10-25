# Express Book Reviews — Srushti's Final Project

A working Express API for an online bookstore, created from the IBM Skills Network `expressBookReviews` starter repository.

The application lives in `final_project/` and implements:
- GET `/`: all books
- GET `/isbn/:isbn`: details for an ISBN
- GET `/author/:author`: books by author
- GET `/title/:title`: books by title
- GET `/review/:isbn`: book reviews
- POST `/register`: register a new account
- POST `/customer/login`: log in and create a session
- PUT `/customer/auth/review/:isbn`: add or update the current user's review
- DELETE `/customer/auth/review/:isbn`: remove the current user's review

`final_project/router/general.js` also provides asynchronous Axios / async-await methods for the four book lookups.

## Run

```bash
cd final_project
npm install
npm start
```

Default API address: `http://localhost:5000`.

This project uses the starter `router/booksdb.js` book data and an in-memory user database for course evaluation. Restarting the server resets users and reviews. Use environment variables `JWT_SECRET` and `SESSION_SECRET` for non-demo deployments.
