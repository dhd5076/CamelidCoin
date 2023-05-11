/**
 * @module JobScheduler used for managing job pool
 */

import { Message } from "../networking/message.js";
import { MessageHandler } from "../networking/messageHandler.js";
import { Job } from './job.js';

/**
 * Used for managing scheduling and managing jobs
 */
export class JobManager {
  /**
   * @param {MessageHandler} messageHandler used for sending messages
   * @param {Boolean} fullNode full node will accept new jobs
   */
  constructor(messageHandler, fullNode) {
    this.jobs = new Map();
    this.acceptingJobs = fullNode;
    this.awaitingCompletion = false; // Set to true when we have submitted a job and are waiting on completion
    this.submittedJobs = [] // Array of IDs of jobs we are waiting for to be completed
    this.fullNode = true;
    messageHandler.registerHandler('JOB_CREATED', this.handleNewJobMessage);
    messageHandler.registerHandler('JOB_ACCEPTED', this.handleJobAcceptedMessage);
    messageHandler.registerHandler('JOB_COMPLETED', this.handleJobCompletedMessage);
    messageHandler.registerHandler('JOB_GET_INFO', this.handleJobGetInfoMessage);
  }

  /**
   * Set the current job to be working on
   * @param {Job} job 
   */
  setCurrentJob(job) {
    return new Promise((resolve, reject) => {
      if(this.acceptingJobs) {
        this.currentJob = job;
        this.acceptingJobs = false;
        resolve();
      } else {
        reject(new Error("Not accepting new jobs."))
      }
    })
  }

  /**
   * Handle request for job info
   * @param message.
   */
  handleJobGetInfoMessage(message) {
    if(message.job.id) {
      if(this.jobs.has(message.job.id)) {
        message.
      }
    } else {
      throw new Error("Cannot get job info: Invalid Job Info Request Message")
    }
  }

  /**
   * 
   * @param {Message} message 
   */
  handleNewJobMessage(message) {
    if(this.acceptingJobs && message.job) {
      Job.validate(message.job)
      .then((isValid) => {
        if(isValid) {
          this.setCurrentJob(message.payload.job);
          const message = new Message('JOB_ACCEPTED', {
            job: {
              id: message.job.hash
            }
          })
          this.sendMessage(message);
        } else {
          throw new Error('Could not pickup job: Invalid Job')
        }
      })
    }
  }

  /**
   * Handle job accepted message
   * @param {Message} message 
   */
  handleJobAcceptedMessage(message) {
    
  }

  /**
   * 
   * @param {Message} message 
   */
  handleJobCompletedMessage(message) {

  }


  /**
   * Submit job to network
   * @param {Job} job
   */
  submitJob(job) {

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
}