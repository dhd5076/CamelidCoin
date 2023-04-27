/**
 * @class Compute Job
 */
import { Schema, model, models} from 'mongoose';

const jobSchema =  new Schema({
    /**
     * The user who submitted the compute job
     */
    client: {
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: [true, "Compute job must have client"]
    },
    /**
     * Has this compute job been fulfilled already
     */
    fulfilled: {
        type: Boolean,
        default: true
    },
    /**
     * What model is this compute job using
     */
    model: {
        type: Schema.Types.ObjectId,
        ref: 'Model',
        required: [true, "Compute job must have model"]
    },
    /**
     * Seed to use for LLM computation
     */
    seed: {
        //TODO: Figure out what exact numerical type to use
        type: Number,
        required: [true, "Compute job must have seed"] 
    },
    /**
     * What nodes completed the compute job 
     */
    fulfilledBy: [{
        type: Schema.Types.ObjectId,
        ref: 'Node',
        required: false
    }],
    /**
     * Number of times the compute job has been confirmed
     */
    confirmations: {
        type: Number,
        required: false
    }
})

const Model = models.Job || model('Job', jobSchema)

export default Job;