import { default as PD, } from 'probability-distributions';

/**
 * base interface class for reinforced learning
 * @class ReinforcedLearningBase
 * @memberOf ml
 */
export class ReinforcedLearningBase{
  /**
   * base class for reinforced learning
   * @param {Object} [options={}]
   * @prop {Number} options.bounds - number of bounds / bandits
   * @prop {Function} options.getBound - get value of bound
   * @prop {Number} this.bounds - number of bounds / bandits
   * @prop {Array} this.last_selected - list of selections
   * @prop {Number} this.total_reward - total rewards
   * @prop {Number} this.iteration - total number of iterations
   * @returns {this} 
   */
  constructor(options = {}) {
    this.bounds = options.bounds || 5;
    this.getBound = options.getBound || function getBound(bound) {
      return bound;
    };
    this.last_selected = [];
    this.total_reward = 0;
    this.iteration = 0;
    return this;
  }
  /** 
   * interface instance method for reinforced learning step
  */
  learn() {
    throw new ReferenceError('Missing learn method implementation');
  }
  /** 
   * interface instance method for reinforced training step
  */
  train() {
    throw new ReferenceError('Missing train method implementation');
  }
  /** 
   * interface instance method for reinforced prediction step
  */
  predict() {
    throw new ReferenceError('Missing predict method implementation');
  }
}

/**
 * Implementation of the Upper Confidence Bound algorithm
 * @class UpperConfidenceBound
 * @memberOf ml
 */
export class UpperConfidenceBound extends ReinforcedLearningBase{
  /**
   * creates a new instance of the Upper confidence bound(UCB) algorithm. UCB is based on the principle of optimism in the face of uncertainty, which is to choose your actions as if the environment (in this case bandit) is as nice as is plausibly possible
   * @see {@link http://banditalgs.com/2016/09/18/the-upper-confidence-bound-algorithm/}
   * @example
   * const dataset = new ms.ml.UpperConfidenceBound({bounds:10});
   * @param {Object} [options={}]
   * @prop {Map} this.numbers_of_selections - map of all bound selections
   * @prop {Map} this.sums_of_rewards - successful bound selections
   * @returns {this} 
   */
  constructor(options = {}) {
    super(options);
    this.numbers_of_selections = new Map();
    this.sums_of_rewards = new Map();
    for (let i = 0; i < this.bounds; i++){
      this.numbers_of_selections.set(i, 0);
      this.sums_of_rewards.set(i, 0);
    }
    return this;
  }
  /**
   * returns next action based off of the upper confidence bound
   * @return {number} returns bound selection
   */
  predict() {
    let ad = 0; //ad is each bandit
    let max_upper_bound = 0;
    for (let i = 0; i < this.bounds; i++){
      let upper_bound = 1e400;
      if (this.numbers_of_selections.get( i ) > 0) {
        // if selected at least once
        let average_reward = this.sums_of_rewards.get( i ) / this.numbers_of_selections.get( i );
        let delta_i = Math.sqrt(3 / 2 * Math.log(this.iteration + 1) / this.numbers_of_selections.get( i ));
        upper_bound = average_reward + delta_i;
      } 
      if (upper_bound > max_upper_bound) { //get max at each round
        max_upper_bound = upper_bound;
        ad = i;
      }
    }
    return ad;
  }
  /**
   * single step trainning method
   * @param {Object} ucbRow - row of bound selections
   * @param {Function} [getBound=this.getBound] - select value of ucbRow by selection value
   * @return {this} 
   */
  learn(options={}) {
    const { ucbRow, getBound, } = options;
    let ad = this.predict();
    this.last_selected.push(ad);
    this.numbers_of_selections.set(ad,  this.numbers_of_selections.get(ad) + 1);
    let reward = ucbRow[getBound(ad)];
    this.sums_of_rewards.set(ad,  this.sums_of_rewards.get(ad) + reward);
    this.total_reward = this.total_reward + reward;
    this.iteration++;
    return this;
  }
  /**
   * training method for upper confidence bound calculations
   * @param {Object|Object[]} ucbRow - row of bound selections
   * @param {Function} [getBound=this.getBound] - select value of ucbRow by selection value
   * @return {this} 
   */
  train(options) {
    const {
      ucbRow,
      getBound = this.getBound,
    } = options;
    if (Array.isArray(ucbRow)) {
      for (let i in ucbRow) {
        this.learn({
          ucbRow: ucbRow[i],
          getBound,
        });
      }
    } else {
      this.learn({
        ucbRow,
        getBound,
      });
    }
    return this;
  }
}

/**
 * Implementation of the Thompson Sampling algorithm
 * @class ThompsonSampling
 * @memberOf ml
 */
export class ThompsonSampling extends ReinforcedLearningBase{
  /**
   * creates a new instance of the Thompson Sampling(TS) algorithm. TS a heuristic for choosing actions that addresses the exploration-exploitation dilemma in the multi-armed bandit problem. It consists in choosing the action that maximizes the expected reward with respect to a randomly drawn belief
   * @see {@link https://en.wikipedia.org/wiki/Thompson_sampling}
   * @example
   * const dataset = new ms.ml.ThompsonSampling({bounds:10});
   * @param {Object} [options={}]
   * @prop {Map} this.numbers_of_rewards_1 - map of all reward 1 selections
   * @prop {Map} this.numbers_of_rewards_0 - map of all reward 0 selections
   * @returns {this} 
   */
  constructor(options = {}) {
    super(options);
    this.numbers_of_rewards_1 = new Map();
    this.numbers_of_rewards_0 = new Map();
    for (let i = 0; i < this.bounds; i++){
      this.numbers_of_rewards_1.set(i, 0);
      this.numbers_of_rewards_0.set(i, 0);
    }
    return this;
  }
  /**
   * returns next action based off of the thompson sampling
   * @return {number} returns thompson sample
   */
  predict() {
    let ad = 0; //ad is each bandit
    let max_random = 0;
    for (let i = 0; i < this.bounds; i++){
      let random_beta = PD.rbeta(1, this.numbers_of_rewards_1.get(i) + 1, this.numbers_of_rewards_0.get(i) + 1);
      if (random_beta > max_random) {
        max_random = random_beta;
        ad = i;
      }
    }
    return ad;
  }
  /**
   * single step trainning method
   * @param {Object} tsRow - row of bound selections
   * @param {Function} [getBound=this.getBound] - select value of tsRow by selection value
   * @return {this} 
   */
  learn(options = {}) {
    const { tsRow, getBound, } = options;
    let ad = this.predict();
    this.last_selected.push(ad);
    let reward = tsRow[ getBound(ad) ];
    if (reward === 1) {
      this.numbers_of_rewards_1.set(ad,  this.numbers_of_rewards_1.get(ad) + 1);
    } else {
      this.numbers_of_rewards_0.set(ad,  this.numbers_of_rewards_0.get(ad) + 1);
    }
    this.total_reward = this.total_reward + reward;
    this.iteration++;
    return this;
  }
  /**
   * training method for thompson sampling calculations
   * @param {Object|Object[]} tsRow - row of bound selections
   * @param {Function} [getBound=this.getBound] - select value of tsRow by selection value
   * @return {this} 
   */
  train(options) {
    const {
      tsRow,
      getBound = this.getBound,
    } = options;
    if (Array.isArray(tsRow)) {
      for (let i in tsRow) {
        this.learn({
          tsRow: tsRow[i],
          getBound,
        });
      }
    } else {
      this.learn({
        tsRow,
        getBound,
      });
    }
    return this;
  }
}