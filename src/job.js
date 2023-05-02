/**
 * @class Job
 */
export class Job {
    /**
     * @param {Object} [options={}] Optional job properties
     * @param {string} [options.creator] Job creator
     * @param {boolean} [options.completed=false] Whether job is completed
     * @param {number} [options.compensation=0] Job compensation
     * @param {Date} [options.createdAt=new Date()] Job creation date
     * @param {Date} [options.completedAt=null] Job completion date
     * @param {string} [options.inputTokens=''] Input tokens for the job
     * @param {string} [options.computedOutput=''] Computed output for the job
     */
    constructor(options = {}) {
      const {
        createdBy = '',
        completed = false,
        compensation = 0,
        createdAt = new Date(),
        completedAt = null,
        inputTokens = '',
        computedOutput = '',
      } = options;
      
      this.creator = creator;
      this.completed = completed;
      this.compensation = compensation;
      this.createdAt = createdAt;
      this.completedAt = completedAt;
      this.inputTokens = inputTokens;
      this.computedOutput = computedOutput;
    }

    /**
     * Verify job is correct
     */
    verify() {

    }

    /**
     * Compute the result of the job
     */
    compute() {

    }

    getHash() {

    }
}