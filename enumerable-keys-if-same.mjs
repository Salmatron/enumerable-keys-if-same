// @ts-check

const basePropertyIsEnumerable = Object.prototype.propertyIsEnumerable;

export function enumerableKeysIfSame(a, b) {
    if (a === undefined) {
        throw new TypeError('can\'t convert undefined to object');
    }

    if (a === null) {
        throw new TypeError('can\'t convert null to object');
    }

    if (b === undefined) {
        throw new TypeError('can\'t convert undefined to object');
    }

    if (b === null) {
        throw new TypeError('can\'t convert null to object');
    }

    if (typeof a !== typeof b) {
        throw new TypeError('Type mismatch: `a` is of type "' + (typeof  a) + '" but `b` is of type "' + (typeof b) + '"');
    }

    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    const keysCount = keysA.length >>> 0;

    if (keysCount !== keysB.length) {
        return null;
    }

    if (keysCount !== 0) {
        if (keysCount !== (new Set(keysA.concat(keysB)).size)) {
            return null;
        }
    }

    if ((typeof a !== 'object') && (typeof a !== 'function')) {
        // Primitive types can't have own symbol keys
        return keysA;
    }

    const allSyms = new Set(Object.getOwnPropertySymbols(a).concat(Object.getOwnPropertySymbols(b)));

    if (allSyms.size === 0) {
        return keysA;
    }

    const aHasEnumerable = basePropertyIsEnumerable.bind(a);
    const bHasEnumerable = basePropertyIsEnumerable.bind(b);

    const enumerableKeys = (keysCount !== 0) ? keysA : [];

    for (const sym of allSyms) {
        const aHas = aHasEnumerable(sym);

        if (aHas !== bHasEnumerable(sym)) {
            return null;
        }

        if (aHas) {
            enumerableKeys.push(sym);
        }
    }

    return enumerableKeys;
}

