/**
 * @module Job used for creating and managing jobs
 */

/**
 * @class Job
 */
export class Job {
    static get JOBSTATE() {
        return{
            NEW: 0,
            CREATED: 1,
            PICKEDUP: 2,
            COMPLETED: 3
        }
    }

    /**
     * Create new Job
     * @param {String} input input string
     * @param {Number} seed seed to use to generate output
     * @param {Number} tokens number of tokens to be generated
     * @param {JOBSTATE} state current state of the job
     * @param {String} output output of job if completed otherwise null
     */
    constructor(input, seed, tokens, state, timestamp, output) {
        this.input = input,
        this.seed = seed,
        this.tokens = tokens,
        this.state = state,
        this.output = output,
        this.timestamp = timestamp,
        this.calculateHash(hash => this.hash = hash);
    }

    /**
     * Create a new job that needs to be computed
     * @param {String} input the input of the job 
     * @
     */
    create(input, seed, tokens) {
        return new Promise((resolve, reject) => {
            try {
                const job = new Job(input, seed, tokens, JOBSTATE.CREATED, Date.now(), [])
                resolve(job)
            } catch(error) {
                reject(error)
            }
        })
    }

    /**
     * Checks whether or no the job is valid
     * Only verifies that the structure is correct, does not validate output
     * @param {Job} job
     * @returns {Promise.<Boolean, Error>}
     */
    static validate(job) {
      return new Promise((resolve, reject) => {
        //TODO: Validate job
        resolve(true);
      })
    }

    /**
     * Calculates the hash of the job
     * @returns {Promise.<String>} the hash of the job
     */
    calculateHash() {
        return new Promise((resolve, reject) => {  
            cryptoUtils.hash(JSON.stringify(this))
            .then(hash => resolve(hash))
            .catch(error => reject(error));
        })
    }
}