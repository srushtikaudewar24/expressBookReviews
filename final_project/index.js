const express=require('express');
const session=require('express-session');
const jwt=require('jsonwebtoken');
const {authenticated,JWT_SECRET}=require('./router/auth_users.js');
const {general}=require('./router/general.js');
const app=express();
app.use(express.json());
app.use('/customer',session({secret:process.env.SESSION_SECRET||'bookstore-session-dev-secret',resave:false,saveUninitialized:false,cookie:{httpOnly:true,sameSite:'lax'}}));
app.use('/customer/auth',(req,res,next)=>{
  const token=req.session?.authorization?.accessToken||(req.get('Authorization')||'').replace(/^Bearer\s+/i,'');
  if(!token) return res.status(401).json({message:'User not logged in'});
  try{req.user=jwt.verify(token,JWT_SECRET);next();}
  catch{return res.status(403).json({message:'User not authenticated'});}
});
app.use('/customer',authenticated);
app.use('/',general);
const PORT=Number(process.env.PORT||5000);
if(require.main===module) app.listen(PORT,()=>console.log(`Bookstore server running on port ${PORT}`));
module.exports=app;
