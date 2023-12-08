import fastify from "fastify"
import axios from "axios"
import 'dotenv/config'

import { getReportHandler } from "./modules/report.js"
import { getReportSchema, sendFormSchema } from "./schemas.js"

const server = fastify({
    logger: true
})

server.post('/form', { schema: sendFormSchema }, async (rq, rl) => {
    let response = await axios.post(
            'https://test-inspector.isb.rolf.ru/ti35/?p_json=',
            rq.body, {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    )
    return response.data
})

server.get('/getReport', { schema: getReportSchema }, async (rq, rl) => {
    const report = await getReportHandler(rq.query.type, rq.query.number)
    rl.code(report.statusCode).send(report.result)
})

server.listen({ port: 3000, host: '91.228.221.88' })