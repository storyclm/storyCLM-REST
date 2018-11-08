export default function promiseRepeater (maxAttempts, repeatIf, beforeNewAttempt) {
    this.beforeNewAttempt = beforeNewAttempt || function () { return Promise.resolve(); };//перед следующей попыткой
    this.maxAttempts = maxAttempts||1;
    this.repeatIf = repeatIf;
}
promiseRepeater.prototype.repeat = function (promiseCreator) {
    var self = this;
    return new Promise(function (resolve, reject) {
        self._repeatRecursion(promiseCreator, resolve, reject, 1, null);
    })
};

promiseRepeater.prototype._repeatRecursion = function (promiseCreator, resolve, reject, currentAttempt, lastError) {
    var self = this;
    if (currentAttempt > this.maxAttempts) return reject(lastError);
    promiseCreator()
        .then(function (result) {
            return resolve(result);
        })
        .catch(function (error) {
            if (self.repeatIf && !self.repeatIf(error)) return reject(error);
            return self.beforeNewAttempt(error, currentAttempt)
                .then(function () {
                    return self._repeatRecursion(promiseCreator, resolve, reject, currentAttempt + 1, error);
                });
        })
};