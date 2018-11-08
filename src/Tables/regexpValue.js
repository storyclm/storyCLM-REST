//яваскриптовый regexp не поддерживает некоторые модификаторы (например, "(?i)"), поэтому сделал обертку над строкой, чтобы передавать все в шаблоне
export let regexpValue = function (pattern) {
    this.pattern = pattern;
}