import Caver, { Unit } from "caver-js";

export const toHex = (caver: Caver, value: string): string =>
    caver.utils.toHex(value);

export const fromPeb = (
    caver: Caver,
    value: string | number,
    unit: Unit
): string => caver.utils.fromPeb(value, unit);

export const toPeb = (
    caver: Caver,
    value: string | number,
    unit: Unit
): string => caver.utils.toPeb(value, unit);
