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
            count++;
            completition.push(response.token)
            console.log(completition)
        })
    }
}

let a = new Model("ggml-alpaca-7b-q4.bin");
a.init()
.then(() => {
    a.generateCompletition("A dialog, where User interacts with AI. AI is helpful, kind, obedient, honest, and knows its own limits. \n User: Hello, AI. \n AI: Hello! How can I assist you today? \n User: How are you doing today? AI:", 1, 32)
})