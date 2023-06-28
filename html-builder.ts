import {BenchmarkSummary} from "./index.types";
import {BenchmarkResults} from "./benchmark.types";

export class HtmlBuilder {
    constructor(private benchmarkResults: BenchmarkSummary) {
    }
    createReport(): string {
        return `
<!DOCTYPE html>
<html lang="ru">
<head>
    <title>Результаты измерений</title>
    <meta charset="UTF-8">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;900&display=swap" rel="stylesheet">
</head>
<body>
<header>
Результаты измерений между: ${this.getDrivers().join(', ')}
</header>
<main>
${this.createMain()}
</main>
<footer>
Работа студента ЗКИ21-16Б Филина Дмитрия Алексеевича
</footer>
</body>
<style>
    *{
        margin: 0;
        padding: 0;
    }
    html, body {
        font-family: 'Roboto', sans-serif;;
        background-color: gainsboro;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
    }
    header, footer {
        background-color: rgba(0, 0, 0, 0.95);
        color: #d2d2d2;
        text-align: center;
        padding: 20px;
        font-weight: 700;
        font-size: 1.5rem;
    }
    footer {
        margin-top: auto;
        text-align: center;
    }
    .title {
        margin-top: 2rem;
        font-size: 1.25rem;
        text-align: center;
    }
    .tables {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(600px, 1fr));
        place-items: center;
        padding: 1.5rem;
    }
    table {
        width: 100%;
        border-collapse: collapse;
    }
    table, th, td {
        border: 1px solid black;
        padding: 0.1rem;
        text-align: center;

    }
    .table-title {
        text-align: center;
        font-weight: 700;
        font-size: 1.125rem;
    }
</style>
</html>
       `
    }
    private getDrivers(){
        return Object.keys(this.benchmarkResults[Object.keys(this.benchmarkResults)[0]])
    }
    private createMain() {
        let res = ''
        for(let prop in this.benchmarkResults) {
            res += `<p class="title">Для ${prop} измерений самым быстрым оказался: `
            let winner = ''
            for (let driver in this.benchmarkResults[prop]) {
                if(!winner ||
                    this.benchmarkResults[prop][driver].expectedValue.total < this.benchmarkResults[prop][winner].expectedValue.total){
                    winner = driver
                }
            }
            res += `<strong>${winner}</strong></p><div class="tables">`
            for (let driver in this.benchmarkResults[prop]) {
                res += this.createResultTable(driver, this.benchmarkResults[prop][driver])
            }
            res += `</div>`
        }
        return res
    }
    private createResultTable(driver: string, results: BenchmarkResults) {
        let headers = `<th></th>`
        for(let i = 0; i < results.measurements.length; i++) {
            headers += `<th>#${i+1}</th>`
        }
        headers += `<th>Мат.ожидание</th><th>Дисперсия</th>`
        let rows = ``

        for(let prop in results.expectedValue){
            rows += `<tr>`
            rows += `<td><strong>${prop.toUpperCase()}</strong></td>`
            results.measurements.forEach(measure => {
                rows += `<td>${Math.ceil(measure[prop])} мс.</td>`
            })
            rows += `<td>${Math.ceil(results.expectedValue[prop])}</td>`
            rows += `<td>${Math.ceil(results.variance[prop])}</td>`
            rows += `</tr>`
        }
        return `<div class="table"><p class="table-title">${driver}</p>
<table>
<thead>
<tr>
${headers}
</tr>
</thead>
<tbody>
${rows}
</tbody>
</table></div>
        `
    }
}