export default class Random {
    /**
     * @param {Object} arr
     * @returns {String}
     */
    static get(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    static boolean(trueProbability) {
        return Math.random() < trueProbability;
    }

    /**
     * @param {Object} arr
     * @returns {String}
     */
    static getByProbabilities(arr) {

        let keys = [];
        for (let key in arr) {
            keys.push(key);
        }

        const probabilitySum = keys.reduce((sum, key) => {
            return sum + arr[key];
        }, 0);

        if (probabilitySum === 0) {
            return Random.get(keys);
        }

        const randomValue = Math.random() * probabilitySum;

        let selected = keys[keys.length - 1];

        keys.reduce((sum, key) => {
            const valueSum = sum + arr[key];

            if (randomValue <= valueSum && randomValue >= sum) {
                selected = key;
            }

            return valueSum;
        }, 0);

        return selected;
    }
}