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
    this.waitingForCompletion = [] // Array of IDs of jobs we are waiting for to be completed
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
   * @param message Message to handle
   */
  handleJobGetInfoMessage(message) {
    return new Promise((resolve, reject) => {
      if(message.job.id) {
        if(this.jobs.has(message.job.id)) {
          message.reply(new Message('JOB_INFO', this.jobs.get(message.job.id)))
          resolve();
        }
      } else {
        reject(new Error("Cannot get job info: Invalid Job Info Request Message"));
      }
    })
  }

  /**
   * Handles new job message
   * @param {Message} message 
   */
  handleNewJobMessage(message) {
    return new Promise((resolve, reject) => {
      if(this.acceptingJobs && message.job) {
        Job.validate(message.job)
        .then((isValid) => {
          if(isValid) {
            this.setCurrentJob(message.payload.job)
            .then(() => {
              const message = new Message('JOB_ACCEPTED', {
                job: {
                  id: message.job.hash
                }
              })
              resolve(message);
            });
          } else {
            reject(new Error('Could not pickup job: Invalid Job'));
          }
        })
      }
    });
  }

  /**
   * Handle job accepted message
   * Updates our known job status and optionally drops current job if it's identical
   * @param {Message} message 
   */
  handleJobAcceptedMessage(message) {
    return new Promise((resolve, reject) => {
      if(Job.validate(message.job)) {
        const jobToModify = this.jobs.get(message.job.id);
        jobToModify.state = Job.JOBSTATE.PICKEDUP;
        this.jobs.set(message.job.id, jobToModify);
        resolve();
        //TODO: Drop job optionally
      } else {
        reject(new Error("Cannot handle accepted job message: Invalid Job"))
      }
    })
  }

  /**
   * 
   * @param {Message} message 
   */
  handleJobCompletedMessage(message) {
    if(Job.validate(message.job)) {
      if(this.jobs.has(message.job.hash)) {

      } else {
        this.jobs.set(message.job.hash, message.job);
      }
    } else {
      throw new Error("Cannot handle completed job message: Invalid Job")
    }
  }


  /**
   * Submit job to network
   * @param {Job} job
   */
  createAndBroadcastJob(job) {
    const message = new Message('JOB_CREATED', job);
    this.waitingForCompletion.push(job.hash)
    this.messageHandler.sendMessage(message);
  }

  /**
   * Get a job by id
   * @param {String} hash job identifier
   * @returns {Promise.<Job, Error>}  
   */
  getJob(hash) {
    return new Promise((resolve, reject) => {
      if (this.jobs.has(hash)) {
        resolve(this.jobs.get(hash))
      } else {
        reject(new Error(`Job with ID: ${hash} not found.`))
      }
    })
  }

  /**
   * Add a job to the job pool
   * @param {Job} job job to be added
   */
  addJob(job) {
    return new Promise((resolve, reject) => {
      if (!Job.validate(job)) {
        reject(new Error("Cannot add job to pool: Invalid Job"))
      } else if (!this.jobs.has(job.hash)) {
        this.jobs.set(job.hash, job)
      }
    })
  }

  /**
   * Remove a job from the job pool
   * @param hash the hash of the job to remove
   */
  removeJob(hash) {
    return new Promise((resolve, reject) => {
      if(this.jobs.has(hash)) {
        this.jobs.delete(hash)
        resolve();
      } else {
        reject(new Error(`Job doesn't exist`));
      }
    });
  }
}