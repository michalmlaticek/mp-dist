import { connect, connection, Connection } from 'mongoose';
import { conn_string } from '../config';

export class DataAccess {
    static mongooseInstance: any;
    static mongooseConnection: Connection;

    // constructor() {
    //     DataAccess.connect();
    // }

    static connect(): Connection {
        if (this.mongooseInstance) return this.mongooseInstance;

        this.mongooseConnection = connection;
        this.mongooseConnection.once("open", () => {
            console.log("Conectado ao mongodb.");
        });

        this.mongooseInstance = connect(conn_string);
        return this.mongooseInstance;
    }

}