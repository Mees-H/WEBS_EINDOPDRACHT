const Target = require('../models/target');

jest.mock('../models/target', () => {
    const mTarget = {
        save: jest.fn().mockResolvedValue(true),
        validate: jest.fn().mockResolvedValue(true),
        toObject: jest.fn().mockReturnValue({}),
    };
    return function () {
        return mTarget;
    };
});

Target.findById = jest.fn().mockImplementation(() => ({
    ownerId: '123',
    toObject: () => ({ ownerId: '123' }),
}));

Target.find = jest.fn().mockImplementation(() => ({
    ownerId: '123',
    toObject: () => ({ ownerId: '123' }),
}));

Target.findByIdAndUpdate = jest.fn().mockResolvedValue(true);
Target.findByIdAndDelete = jest.fn().mockResolvedValue(true);

jest.mock('../common-modules/messageQueueService', () => ({
    sendMessageToQueue: jest.fn(),
}));

function mockRequest(user, body, params) {
    return {
        user,
        body,
        params,
    };
}

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};


const { getTarget } = require('../controllers/targetController');

describe('getTarget', () => {
    it('should get a target successfully', async () => {
        const req = mockRequest(
            { userId: '123' },
            { targetId: '123' },
            { id: '123' }
        );
        req.file = {
            path: 'path/to/file.jpg',
            originalname: 'file.jpg'
        };
        const res = mockResponse();

        await getTarget(req, res);

        if (res.status.mock.calls[0][0] !== 200) {
            console.log('Error getting target:', res.json.mock.calls[0][0]);
        }

        expect(res.status).toHaveBeenCalledWith(200);
    });
});

const { getTargets } = require('../controllers/targetController');

describe('getTargets', () => {
    it('should get all targets successfully', async () => {
        const req = mockRequest(
            { userId: '123' },
            { targetId: '123' }
        );
        req.file = {
            path: 'path/to/file.jpg',
            originalname: 'file.jpg'
        };
        const res = mockResponse();

        await getTargets(req, res);

        if (res.status.mock.calls[0][0] !== 200) {
            console.log('Error getting targets:', res.json.mock.calls[0][0]);
        }

        expect(res.status).toHaveBeenCalledWith(200);
    });
});
