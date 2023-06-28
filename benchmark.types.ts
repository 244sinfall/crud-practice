export type BenchmarkRawData = {
    create: number,
    read: number,
    update: number,
    delete: number,
    total: number
}

export type BenchmarkResults = {
    measurements: BenchmarkRawData[]
    expectedValue: BenchmarkRawData
    variance: BenchmarkRawData
}