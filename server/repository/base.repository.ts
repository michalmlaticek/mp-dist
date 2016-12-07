import { Document, Model, Types } from 'mongoose';

export class BaseRepository<T extends Document> {

    protected _model: Model<Document>;

    constructor(schemaModel: Model<Document>) {
        this._model = schemaModel;
    }

    create(item: T, callback: (error: any, result: any) => void) {
        this._model.create(item, callback);
    }

    findBy(filter: any, callback: (error: any, result: any) => void) {
        this._model.find(filter, callback);
    }

    retrieve(callback: (error: any, result: any) => void) {
        this._model.find({}, callback)
    }

    update(_id: Types.ObjectId, item: T, callback: (error: any, result: any) => void) {
        this._model.update({ _id: _id }, item, callback);
    }

    delete(_id: string, callback: (error: any, result: any) => void) {
        this._model.remove({ _id: this.toObjectId(_id) }, (err) => callback(err, null));
    }

    findById(_id: string, callback: (error: any, result: T) => void) {
        this._model.findById(_id, callback);
    }

    private toObjectId(_id: string): Types.ObjectId {
        return Types.ObjectId.createFromHexString(_id)
    }
}