import fastify from "fastify"
import axios from "axios"

import { getReportHandler } from "./modules/report.js"
import { getReportSchema, sendFormSchema } from "./schemas.js"

const server = fastify({
    logger: true
})

server.post('/form', { schema: sendFormSchema }, async (rq, rl) => {
    let response = await axios.post(
            process.env.ROLF_FORM_ENDPOINT,
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

server.listen({ port: process.env.PORT, host: process.env.PROD_HOST })