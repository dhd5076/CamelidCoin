/**
 * @module Job used for creating and managing jobs
 */

/**
 * @class Job
 */
export class Job {
    /**
     * 
     */
    constructor() {
    }

    /**
     * Checks whether or no the job is valid
     * @param {Job} job
     * @returns {Promise.<Boolean, Error>}
     */
    static validate(job) {
      return new Promise((resolve, reject) => {
        //TODO implement validation
        resolve(true);
      })
    }

    getHash() {
        this.
    }
}