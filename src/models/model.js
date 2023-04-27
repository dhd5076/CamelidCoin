/**
 * @class Model
 */
import { Schema, model, models} from 'mongoose';

const modelSchema =  new Schema({
    /**
     * The name of the model
     */
    name: {
        type: String,
        required: [true, "Model must have name"]
    },
    /**
     * The default parameters 
     */
    parameters: {
        type: Object,
        required: false
    },

});

const Model = models.Node || model('Model', modelSchema)

export default Model;