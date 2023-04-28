/**
 * @class Compute Node
 */
import { Schema, model, models} from 'mongoose';

const nodeSchema =  new Schema({
    /**
     * The owner of the node
     */
    owner: {
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: [true, "Node must have owner"]
    },
    /**
     * List of models that the node is capable of computing
     */
    capabilities: {
        type: [{
            type: Schema.Types.ObjectId, 
            ref: 'Model'
        }],
        required: [true, "Node must have capabilities listed"]
    }
});

const Node = models.Node || model('Node', nodeSchema)

export default Node;