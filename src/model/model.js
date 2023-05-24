/**
 * @module Model used for managing the LLM model and generating completitions
 * @author Dylan Dunn
 * @todo Implement CUDA support, 
 * This https://llama-node.vercel.app/docs/cuda
 * has so far been an endless rabbit hole, but is the most promising lead.
 * May need to implement completition ourselves, especially if we want to define seeds at completion time, and submit tokens as input
 */

import { LLM } from "llama-node";
import { LLamaRS } from "llama-node/dist/llm/llama-rs.js";
import path from "path";
import { Job } from "./job.js";
import { getRandomInt } from "../utils/random.js";
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
        this.model = new LLM(LLamaRS);

        const modelFileLocation = path.resolve(process.cwd(), "./model/" + modelFile);
        const config = {
            path: modelFileLocation,
            gpuLayers: 32,
            useGpu: false
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
     * @param {Job} job Job to validate
     */
    verifyCompletedJob(job) {
        return new Promise((resolve, reject) => {
            const promises = [
                //Note: we need to add 1 to the index we need since indexes start at 0
                this.validateSingleToken(job, 0),
                //TODO may need to be revised for short inputs/outputs, e.g. < 3/4 tokens
                this.validateSingleToken(job, getRandomInt(job.input.length + 3, job.input.length + job.output.length - 2)), 
                this.validateSingleToken(job, job.input.length + job.output.length)
            ]

            Promise.all(promises).then(([continuity, integrity, truncation]) => {
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
                if(completition[0] == job.output[index]) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            })
            .catch((error) => {
                reject(new Error("Failed to validate token: " + error));
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
            this.config.seed = seed;
            this.model.createCompletion({
                prompt,
                numPredict: tokens,
                temp: 0.2,
                topP: 1,
                topK: 40,
                repeatPenalty: 1,
                repeatLastN: 64,
                seed: seed,
                feedPrompt: true,
            }, (response) => {
                if(response.token == '\n\n<end>\n' || count == tokens) {
                    resolve(completition)
                    return;
                } else{
                    completition.push(response.token)
                }
            })  
        })
    }
}