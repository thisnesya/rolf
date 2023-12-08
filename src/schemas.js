export const getReportSchema = {
    querystring: {
        type: 'object',
        required: ['type', 'number'],
        properties: {
            type: { type: 'string' },
            number: { type: 'string' }
        }
    }
}

const communicationSchema = {
    type: 'object',
    required: ['mobilePhone', 'messenger', 'sms'],
    properties: {
        mobilePhone: { type: 'string' },
        messenger: { type: 'string' },
        sms: { type: 'string' }
    }
}

const formSchema = {
    type: 'object',
    required: [
        'clientName', 'clientSurname', 'email',
        'phoneNum',' ptDc', 'prsnData', 'markType',
        'modelType', 'vin', 'regNum', 'communication'
    ],
    properties: {
        clientName: { type: 'string' },
        clientSurname: { type: 'string' },
        email: { type: 'string' },
        phoneNum: { type: 'string' },
        ptDc: { type: 'number' },
        prsnData: { type: 'string', maxLength: 1 },
        markType: { type: 'string' },
        modelType: { type: 'string' },
        vin: { type: 'string' },
        regNum: { type: 'string' },
        communication: communicationSchema
    }
}

export const sendFormSchema = {
    body: formSchema
}