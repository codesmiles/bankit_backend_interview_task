const mock_service_provider = (success_rate: number) => { 
    return () => Math.random() * 100 <= success_rate;
}

export const providers = [
    { name: 'Provider A', fn: mock_service_provider(70) },
    { name: 'Provider B', fn: mock_service_provider(90) },
    { name: 'Provider C', fn: mock_service_provider(95) },
];
// export const providers = [
//     { name: 'Provider A', fn: () => false },
//     { name: 'Provider B', fn: () => false },
//     { name: 'Provider C', fn: () => true },
// ];
