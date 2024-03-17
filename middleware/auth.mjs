import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
    const token = req.header("authorization");
    if (!token) return res.status(401).json({ message: "Acess denied"});
    try {
        const { currentUser } = jwt.verify(token, process.env.TOKEN_SECRET);
       req.currentUser = currentUser;
       next();
    } catch (error) {
        res.status(400).json({ message : "Invalid token "});
    } 
   };

   export default auth; 
