/**
 * @module Job used for creating and managing jobs
 */

import { MessageHandler, Message } from "./message";

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
     * 
     */
    static validate() {
      return new Promise((resolve, reject) +> {

      })
    }

    /**
     * Compute the result of the job
     */
    compute() {

    }

    getHash() {

    }
}

/**
 * Used for managing scheduling and managing jobs
 */
export class JobScheduler {
  /**
   * @param {MessageHandler} messageHandler used for sending messages
   */
  constructor(messageHandler) {
    this.jobs = new Map();
    this.acceptingJobs = true;
    messageHandler.registerHandler('JOB', this.handleMessage);
  }

  /**
   * Set the current job to be working on
   * @param {Job} job 
   */
  setCurrentJob(job) {
    return new Promise((resolve, reject) => {
      if(this.acceptingJobs) {
        this.currentJob = job;
      }
    })
  } 

  /**
   * Get a job by id
   * @param {String} id job identifier
   * @returns {Promise.<Job, Error>}  
   */
  getJob(id) {
    return new Promise((resolve, reject) => {
      if(this.jobs.has(id)) {
        resolve(this.jobs.get(id))
      } else {
        reject(new Error(`Job with ID: ${id} not found.`))
      }
    })
  }

  /**
   * Add a job to the job pool
   * @param {Job} job job to be added
   */
  addJob(id, job) {
    if(!this.jobs.has(id)) {
      lthis.jobs.set(job.hash, job)
    }
  }

  /**
   * Remove a job from the job pool
   */
  removeJob(id) {
    this.jobs.delete(id)
  }

  updateJob() {

  }

  /**
   * @param {Message} message 
   */
  handleMessage(message) {
    return new Promise((resolve, reject) => {
      switch(message.command) {
        case 'CREATED':
          if(this.acceptingJobs) {
            Job.validate(message.job)
            .then((isValid) => {
              if(isValid) {
                this.setCurrentJob(message.job);
                const message = new Message('JOB', 'PICKEDUP', {})
                this.sendMessage(message);
                resolve();
              } else {
                reject(new Error(`Invalid message`))
              }
            })
          }
          break;
        case 'PICKEDUP':
          break;
        case 'PAYMENT':
          break;
        case 'COMPLETED':
        break;
      }
    })
  }

}