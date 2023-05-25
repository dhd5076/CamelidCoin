/**
 * @module Model used for managing the LLM model and generating completitions
 * @author Dylan Dunn
 * @todo Implement CUDA support, 
 * This https://llama-node.vercel.app/docs/cuda
 * has so far been an endless rabbit hole, but is the most promising lead.
 * May need to implement completition ourselves, especially if we want to define seeds at completion time, and submit tokens as input
 */

import { LLM } from "llama-node";
import { LLamaCpp } from "llama-node/dist/llm/llama-cpp.js";
import path from "path";
import { getRandomInt } from "../utils/random.js";
import { Job } from "./job.js";
import logger from '../utils/logger.js';

/**
 * @class Model
 * @classdesc Represents an LLM model
 */
export class Model {
    /**
     * @constructor
     * @param {String} modelFile model file name in /model
     */
    constructor(modelFile) {
        this.model = new LLM(LLamaCpp);

        const modelFileLocation = '/home/ddunn/Documents/Github/CamelidCoin/model/ggml-alpaca-7b-q4.bin'
        const config = {
            path: modelFileLocation,
            enableLogging: true,
            nCtx: 1024,
            nParts: -1,
            seed: 0,
            f16Kv: false,
            logitsAll: false,
            vocabOnly: false,
            useMlock: false,
            embedding: false,
            useMmap: true,
        };
        this.config = config;
    }

    /**
     * @method init
     * @description Initialize and load the model
     * @returns {Promise.<null, Error>}
     */
    init() {
        return new Promise(async (resolve, reject) => {
            try {
                logger.debug("Loading model file: " + this.config.path);
                await this.model.load(this.config);
                logger.debug("Model loaded successfully");
                resolve()
            } catch(error) {
                reject(new Error("Failed to initialize model: " + error));
            }
        })
    }

    /**
     * @method verifyCompletedJob
     * @description Validate a job using the RASTiC method
     * @see RASTiC Method in whitepaper for more information
     * @todo Optimize this method, several redundancies, but it works for now
     * @param {Job} job Job to validate
     */
    verifyCompletedJob(job) {
        return new Promise((resolve, reject) => {
            const promises = [
                this.validateSingleToken(job, 0),
                this.validateSingleToken(job, getRandomInt(1, job.output.length - 2)),  
                this.validateSingleToken(job, job.output.length - 1)
            ];

            Promise.all(promises).then(([continuity, integrity, truncation]) => {
                if(job.tokens == job.output.length - 1) {
                    truncation = true;
                }
                if(continuity && integrity && truncation) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }).catch((error) => {
                reject(error);
            })
        });
    }

    /**
     * @method validateSingleToken
     * @description Validate a single token in a sequence
     * @todo Adjust token type later when determined
     * @param {Job} input input token sequence
     * @param {Number} index the sequence index to validate
     */
    validateSingleToken(job, index) {
        return new Promise((resolve, reject) => {
            const concatSequence = job.input.concat(job.output.slice(0, index).join(""));
            this.generateCompletition(concatSequence, job.seed, 1)
            .then((completition) => {
                console.log(completition);
                if(completition[0] == job.output[index]) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            })
            .catch((error) => {
                console.log("fuck");
                //reject(new Error("Failed to validate token: " + error));
            })
        });
    }

    /**
     * @method tokenizeString
     * @description Tokenize a string
     * @param {String} input String to tokenize
     * @returns {Promise.<String[], Error>}
     */
    tokenizeString(input) {
        return new Promise((resolve, reject) => {
            this.model.tokenize(input).then((tokens) => {
                resolve(tokens)
            }).catch((error) => {
                reject(new Error("Failed to tokenize string: " + error));
            });
        });
    }

    /**
     * @method generateCompletition
     * @todo Adjust prompt type later when determined
     * @description Generate a completition based on a prompt and parameters
     * @param {String} prompt Prompt to use to begin completion
     * @param {Number} seed Deterministic seed to use
     * @param {Number} tokens Number of tokens to compute
     */
    generateCompletition(prompt, seed, tokens) {
        return new Promise((resolve, reject) => {
            var count = 0;
            var completition = [];
            this.model.createCompletion({
                nThreads: 16,
                nTokPredict: tokens,
                topK: 40,
                topP: 0.1,
                temp: 0.2,
                repeatPenalty: 1,
                prompt,
            }, (response) => {
                completition.push(response.token)
                console.log(response.token)
                if(response.completed || count == tokens) {
                    resolve(completition)
                    return;
                }
            }).catch((error) => {
                /**
                 * I dont't know why is an error,
                 * an issue has been opened on the original document
                 * It always errors out for 'Too many tokens predicted
                 * This is a hack in the meantime
                 */
                if(error.message == "Too many tokens predicted") {
                    resolve(completition)
                } else {
                    reject(new Error("Failed to generate completition: " + error));
                }
            });  
        })
    }
}