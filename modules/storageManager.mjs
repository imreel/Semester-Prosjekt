import pg from "pg"
import SuperLogger from "./SuperLogger.mjs";


class DBManager {

    #credentials = {};

    constructor(connectionString) {
        this.#credentials = {
            connectionString,
            ssl: (process.env.DB_SSL === "true") ? true : false
        };

    }

    async testConnection() {
        const client = new pg.Client(this.#credentials);
        try {
            await client.connect();
            const sql = "SELECT * FROM users";
            const params = [];
            const resp = await client.query(sql, params);
            if (resp) {
                console.log(resp.rows);
            }
        } catch (error) {
            console.log("feil ved test av SQL server: ", error);
        }
    }

    async exists(user) {
        const client = new pg.Client(this.#credentials);
        let resp = null;
        let isExisting = false;
        try {
            await client.connect();
            const sql = "SELECT * FROM users WHERE email = $1";
            const params = [user.email];
            resp = await client.query(sql, params);
            if(resp){
                isExisting = resp.rows.length > 0;
            }

        } catch (error) {
            
        } finally {
            client.end(); 
        }
        return isExisting;
    }

    async updateUser(user) {

        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const output = await client.query('Update "public"."Users" set "name" = $1, "email" = $2, "password" = $3 where id = $4;', [user.name, user.email, user.pswHash, user.id]);

        } catch (error) {
           
        } finally {
            client.end();
        }

        return user;

    }

    async deleteUser(user) {

        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const output = await client.query('Delete from "public"."Users"  where id = $1;', [user.id]);

         

        } catch (error) {
          
        } finally {
            client.end();
        }

        return user;
    }

    async createUser(user) {

        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const output = await client.query('INSERT INTO users (name, email, pswhash) VALUES($1::Text, $2::Text, $3::Text) RETURNING id;', [user.name, user.email, user.pswHash]);

            

            if (output.rows.length == 1) {
                
                user.id = output.rows[0].id;
            }

        } catch (error) {
            console.error(error);
           
        } finally {
            client.end();
        }

        return user;

    }
    

    async getUserFromEmail(email){
        const client = new pg.Client(this.#credentials);
        try {
            await client.connect();
            const sql = "SELECT * FROM users WHERE email = $1";
            const params = [email];
            const resp = await client.query(sql, params);
            if (resp && (resp.rows.length === 1)) {
                return resp.rows[0];
            }
        } catch (error) {
            console.log("feil ved test av SQL server: ", error);
        }
        return null;
    }

}



let connectionString = process.env.ENVIORMENT == "local" ? process.env.DB_CONNECTIONSTRING_LOCAL : process.env.DB_CONNECTIONSTRING_PROD;



if (connectionString == undefined) {
    throw ("You forgot the db connection string");
}

export default new DBManager(connectionString);