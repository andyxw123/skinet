let data: number | string;

data = '42';
data = 12;

interface ICar {
    colour: string;
    model: string;
}

// Inheritance
interface ISpeedyCar extends ICar {
    topSpeed: number;
    spoiler?: boolean; // Optional property
}

const car1: ICar = {
    colour: 'blue',
    model: 'bmw'
};

const car2: ISpeedyCar = {
    colour: 'red',
    model: 'mercedes',
    topSpeed: 100
};

const car3: ISpeedyCar = {
    colour: 'yellow',
    model: 'mclaren',
    topSpeed: 200,
    spoiler: true
};

// Function declaration with parameter and return types specified
const multiply = (x: number, y: number): number => {
    return x * y;
};

const multiplyToString = (x: number, y: number): string => {
    return (x * y).toString();
};

const voidFunction = (x: number, y: number): void => {
    // Do something but don't return anything
};
