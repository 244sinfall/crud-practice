import {BenchmarkResults} from "./benchmark.types";

export type BenchmarkSummary = {
    [Operations: number]: {
        [Driver: string]: BenchmarkResults// milliseconds
    }
}