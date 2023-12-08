import * as crypto from "crypto"
import axios from "axios"


export const getReportHandler = async function (type, number) {
    let result = 'Мы не нашли информацию об этом автомобиле'
    let statusCode = 404
    
    const report = await createVehicleReport(type, number)

    if (report.result) {
        let parsed = parseData(report.msg)

        if (parsed) {
            result = parsed
            statusCode = 200
        }
    } else if (!report.result && report.msg === 'fail') {
        statusCode = 404
        result = 'Ошибка валидации. Неверные данные'
    }
    
    return {
        statusCode,
        result
    }
}


const parseData = (report) => {
    const content = report.data[0].content

    if (!content.tech_data) return false
    if (!content.tech_data.brand) return false
    if (!content.tech_data.model) return false
    if (!content.identifiers.vehicle) return false
    if (!content.tech_data.year) return false
    if (!content.tech_data.engine) return false
    if (!content.tech_data.body) return false
    if (!content.tech_data.wheel) return false

    return {
        markType: content.tech_data.brand.name.normalized,
        modelType: content.tech_data.model.name.normalized,
        regNum: content.identifiers.vehicle.reg_num,
        productionYear: content.tech_data.year,
        engineType: content.tech_data.engine.fuel.type,
        enginePower: content.tech_data.engine.power.hp,
        engineVolume: content.tech_data.engine.volume,
        carColor: content.tech_data.body.color.name,
        steeringWheel: content.tech_data.wheel.position
    }
}


const getVehicleReport = async (uid) => {
    try {
        const { data } = await axios({
            method: 'GET',
            url: `https://b2b-api.spectrumdata.ru/b2b/api/v1/user/reports/${uid}?_content=true`,
            headers: {
                "Authorization": `AR-REST ${generateToken()}`,
            }
        })
        return data
    } catch(e) {
        console.log(JSON.stringify(e.response.data))
        return false
    }
}


const createVehicleReport = async (type, number) => {
    const createdReport = await createReport(type, number)

    if (createdReport.result) {
        await sleep(1000)
        const report = await getVehicleReport(createdReport.msg.data[0].uid)
        
        if (report) {
            return { result: true, msg: report }
        }
    }

    return createdReport
}


const createReport = async (type, number) => {
    try {
        const { data } = await axios({
            method: 'POST',
            url: `https://b2b-api.spectrumdata.ru/b2b/api/v1/user/reports/${process.env.AUTOCODE_API_REPORT_TYPE}/_make`,
            headers: {
                "Authorization": `AR-REST ${generateToken()}`,
                "Content-Type": "application/json"
            },
            data: {
                "queryType": type,
                "query": number
            }
        })
        return { result: true, msg: data }
    } catch(e) {
        console.log(JSON.stringify(e.response.data))
        return { result: false, msg: e.response.data.state }
    }
}


function generateToken(age = 60 * 60 * 24) {
    const timestamp = Math.floor((Date.now() / 1000) - 1000)

    const passwordHash = crypto.createHash('md5').update(process.env.PASS).digest('base64')

    const hashWithSalt = `${timestamp}:${age}:${passwordHash}`
    const saltedHashB64 = crypto.createHash('md5').update(hashWithSalt).digest('base64')

    const token = `${process.env.USER}:${timestamp}:${age}:${saltedHashB64}`
    const tokenB64 = Buffer.from(token).toString('base64')

    return tokenB64;
}

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))