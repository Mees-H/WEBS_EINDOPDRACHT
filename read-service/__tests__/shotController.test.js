
const Shot = require('../models/shot');

jest.mock('../models/shot', () => {
    const mShot = {
        save: jest.fn().mockResolvedValue(true),
        validate: jest.fn().mockResolvedValue(true),
        toObject: jest.fn().mockReturnValue({}),
    };
    return function () {
        return mShot;
    };
});

Shot.findById = jest.fn().mockImplementation(() => ({
    shooterId: '123',
    toObject: () => ({ ownerId: '123' }),
}));

Shot.find = jest.fn().mockResolvedValue([{
    shooterId: '123',
    toObject: () => ({ ownerId: '123' }),
}]);

Shot.findByIdAndUpdate = jest.fn().mockResolvedValue(true);

Shot.findByIdAndDelete = jest.fn().mockResolvedValue(true);

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


const { getShot } = require('../controllers/shotController');

describe('getShot', () => {
    it('should get a shot successfully', async () => {
        const req = mockRequest(
            { userId: '123' },
            { },
            { id: '123' }
        );
        req.file = {
            path: 'path/to/file.jpg',
            originalname: 'file.jpg'
        };
        const res = mockResponse();

        await getShot(req, res);

        if (res.status.mock.calls[0][0] !== 200) {
            console.log('res.status.mock.calls[0][0]:', res.status.mock.calls[0][0]);
        }

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ shot: expect.any(Object), message: 'Successfully retrieved shot' });
    });
});

const { getShots } = require('../controllers/shotController');

describe('getShots', () => {
    it('should get shots successfully', async () => {
        const req = mockRequest(
            { userId: '123' },
            { },
            { id: '123' }
        );
        req.file = {
            path: 'path/to/file.jpg',
            originalname: 'file.jpg'
        };
        const res = mockResponse();

        await getShots(req, res);

        if (res.status.mock.calls[0][0] !== 200) {
            console.log('res.status.mock.calls[0][0]:', res.status.mock.calls[0][0]);
        }

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ shots: expect.any(Array), message: 'Successfully retrieved shots' });
    });
});