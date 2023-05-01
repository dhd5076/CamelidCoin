/**
 * @module Model
 */

import { LLM } from "llama-node";
import { LLamaRS } from "llama-node/dist/llm/llama-rs.js";
import path from "path";

/**
 * @class Model
 */
export class Model {
    /**
     * @param {String} modelFile path to the model file 
     */
    constructor(modelFile) {
        this.model = new LLM(LLamaRS);
        const config = {
            path: path.resolve(process.cwd(), "../model/" + modelFile)
        };
        this.config = config;
    }

    /**
     * Load and initialized model
     */
    init() {
        return new Promise(async (resolve, reject) => {
            await this.model.load(this.config);
            resolve()
        })
    }

    /**
     * Generates a completion based on parameters 
     * @param {String} prompt Prompt to use to begin completion
     * @param {Number} seed Deterministic seeed to use
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
                seed: 0,
                feedPrompt: true,
            }, (response) => {
                console.log(completition)
                if(response.token == '\n\n<end>\n') {
                    resolve(completition)
                    return;
                } else{
                    completition.push(response.token)
                }
            })  
        })
    }
}