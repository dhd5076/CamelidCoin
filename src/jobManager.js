/**
 * @module JobScheduler used for managing job pool
 */

import { MessageHandler, Message } from "./message";

/**
 * Used for managing scheduling and managing jobs
 */
export class JobManager {
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
   * @param id the id of the job to remove
   */
  removeJob(id) {
    return new Promise((resolve, reject) => {
      if(this.jobs.has(id)) {
        this.jobs.delete(id)
        resolve();
      } else {
        reject(new Error(`Job doesn't exist`));
      }
    });
  }

  /**
   * Replace job with new job
   * @param {*} id 
   * @param {Job} job 
   */
  updateJob(id, job) {
    return new Promise((resolve, reject) => {
      if(this.jobs.has(id)) {
        this.jobs.set(id, job)
        resolve();
      } else {
        reject();
      }
    })
  }

  /**
   * @param {Message} message 
   */
  handleMessage(message) {
    return new Promise((resolve, reject) => {
      switch(message.subtype) {
        case STATE.CREATED:
          if(this.acceptingJobs) {
            Job.validate(message.job)
            .then((isValid) => {
              if(isValid && message.job.state) {
                this.setCurrentJob(message.payload.job);
                const message = new Message('JOB', 'PICKEDUP', j)
                this.sendMessage(message);
                resolve();
              } else {
                reject(new Error(`Invalid message`))
              }
            })
          }
          break;
        case STATE.PICKEDUP:
          break;
        case STATE.PAID:
          break;
        case STATE.COMPLETED:
        break;
      }
    })
  }

}

const STATE = {
  CREATED: 1,
  PICKEDUP: 2,
  COMPLETED: 3
}