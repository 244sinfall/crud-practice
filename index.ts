import {BenchmarkDriver} from "./benchmark-driver";
import {RedisDriver} from "./redis-driver";
import {ClickhouseDriver} from "./clickhouse-driver";
import {clearInterval} from "timers";
import {DbDriver} from "./db-driver";
import * as fs from "fs";
import {HtmlBuilder} from "./html-builder";
import {BenchmarkSummary} from "./index.types";
import {BenchmarkResults} from "./benchmark.types";

const drivers: DbDriver[] = [new RedisDriver(), new ClickhouseDriver()]

const benchmarks = drivers.map(driver => new BenchmarkDriver(driver))

const results: BenchmarkSummary = {};

const runBenchmark = async(operations: number) => {
    const benchmarkResult: {[driverName: string]: BenchmarkResults} = {}
    for (const benchmarkDriver of benchmarks) {
        benchmarkResult[benchmarkDriver.getDriverName()] = await benchmarkDriver.benchmark(operations)
    }
    return benchmarkResult
}

const benchmark = async(setOfTries: number[]) => {
    for (let numberOfOperations of setOfTries) {
        results[numberOfOperations] = await runBenchmark(numberOfOperations)
    }
    return results
}

const blockingInterval = setInterval(() => undefined, 100)

benchmark([10, 100, 1000]).then(results => {
    clearInterval(blockingInterval)
    fs.unlink('output.html', err => {
        if(err) console.log(err)
    })
    let stream = fs.createWriteStream(`output.html`);
    stream.once('open', function(fd) {
        stream.write(new HtmlBuilder(results).createReport())
        console.log('HTML report was created.')
        stream.end();
    });
})