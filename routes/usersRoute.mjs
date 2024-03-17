import express, { response } from "express";
import jwt from "jsonwebtoken";
import User from "../modules/user.mjs";
import { HTTPCodes } from "../modules/httpConstants.mjs";
import SuperLogger from "../modules/SuperLogger.mjs";
import DBManager from "../modules/storageManager.mjs";





const USER_API = express.Router();
USER_API.use(express.json()); 



USER_API.get('/', (req, res, next) => {
    SuperLogger.log("Demo of logging tool");
    SuperLogger.log("A important msg", SuperLogger.LOGGING_LEVELS.CRTICAL);
})



USER_API.post('/', async (req, res, next) => {


    const { name, email, pswHash } = req.body;

    if (name != "" && email != "" && pswHash != "") {
        const user = new User();
        user.name = name;
        user.email = email;

        
        user.pswHash = pswHash;

       
        let exists = await DBManager.exists(user);

        if (!exists) {
            DBManager.createUser(user);
            res.status(HTTPCodes.SuccesfullRespons.Ok).end();
        } else {
            res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).end();
        }

    } else {
        res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).send("Mangler data felt").end();
    }

});

USER_API.put('/:id', (req, res) => {
   
})

USER_API.delete('/:id', (req, res) => {
   
})


USER_API.post('/login', async (req, res, next) => {
    const { email, pswHash } = req.body;
    const user = await DBManager.getUserFromEmail(email);
    const shemaRespond = {
        code: HTTPCodes.SuccesfullRespons.Ok,
        msg: "",
        data: ""
    }
    if (user) {
        if (user.pswhash === pswHash) {
            shemaRespond.code = HTTPCodes.SuccesfullRespons.Ok;
            shemaRespond.msg = "Login ok!";
            shemaRespond.data = user;
        } else {
            shemaRespond.code = HTTPCodes.ClientSideErrorRespons.Unauthorized;
            shemaRespond.msg = "Wrong password!";
            shemaRespond.data = null;
        }
    } else {
        shemaRespond.code = HTTPCodes.ClientSideErrorRespons.Unauthorized;
        shemaRespond.msg = "Wrong email!";
        shemaRespond.data = null;
    }
    res.status(shemaRespond.code).send(JSON.stringify(shemaRespond));
})

const generateAuthData = (result) => {
    let token = "";
    let currentUser = {};
    if (result) {
        currentUser = {
            id: result.id,
            email: result.email,
            name: result.name,
        };
        token = jwt.sign({currentUser}, process.env.TOKEN_SECRET);
    }
    return token;
};
export default USER_API
