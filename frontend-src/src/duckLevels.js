export default [
    { equation: '20 * t', coeffs: [{title: '', step: 1, min: 0, max: 40, start: 10}], speedEquation: (q) => `${q[0]}` },
    { equation: '30 * t', coeffs: [{title: '', step: 1, min: 0, max: 40, start: 10}], speedEquation: (q) => `${q[0]}` },
    { equation: '35 * t' },
    { equation: '10 * t^2', coeffs: [{title: 't', step: 1, min: 0, max: 40, start: 5}], speedEquation: (q) => `${q[0]} * t` },
    { equation: '15 * t^2' },
    { equation: '2 * t^2 + 10 * t', coeffs: [
        {title: 't', step: 1, min: 0, max: 40, start: 5},
        {title: '',  step: 1, min: 0, max: 10, start: 1},
    ], speedEquation: (q) => `${q[0]} * t + ${q[1]}` },
    { equation: '15 * t^2 - 5*t' },
    { equation: '0.5 * t^3 + t^2 + 3 * t' },
    { equation: '3.5 * t^3 - 2*t^2 - 3 * t' },
    { equation: '40*sin(t*3) + 20*t' },
    { equation: '10*sin(1.89*t + 4.7) + 10' },
]