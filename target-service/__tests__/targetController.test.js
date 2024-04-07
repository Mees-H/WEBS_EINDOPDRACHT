const Target = require('../models/target');

// Mocking external modules
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
Target.findByIdAndUpdate = jest.fn().mockResolvedValue(true);
Target.findByIdAndDelete = jest.fn().mockResolvedValue(true);

jest.mock('../common-modules/messageQueueService', () => ({
    sendMessageToQueue: jest.fn(),
}));

jest.mock('../common-modules/imageService', () => ({
    uploadImage: jest.fn().mockResolvedValue('http://example.com/image.jpg'),
}));

// Assuming express' request and response objects are needed
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


const { createTarget } = require('../controllers/targetController');
const { sendMessageToQueue } = require('../common-modules/messageQueueService');

describe('createTarget', () => {
    it('should create a target successfully', async () => {
        const req = mockRequest(
            { userId: '123' },
            { latitude: 45.0, longitude: -75.0, deadline: '2024-01-01', targetId: '123' }
        );
        req.file = {
            path: 'path/to/file.jpg',
            originalname: 'file.jpg'
        };
        const res = mockResponse();

        await createTarget(req, res);

        if (res.status.mock.calls[0][0] !== 201) {
            console.error('Error creating target:', res.json.mock.calls[0][0]);
        }

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(
            {
                target: expect.objectContaining({ ownerId: '123' }),
                message: 'Successfully created target'
            }
        );
        expect(sendMessageToQueue).toHaveBeenCalledWith(expect.any(String), expect.any(Object));
    });

    it ('should fail to create a target if image is missing', async () => {
        const req = mockRequest(
            { userId: '123' },
            { latitude: 45.0, longitude: -75.0, deadline: '2024-01-01' }
        );
        const res = mockResponse();

        await createTarget(req, res);

        if (res.status.mock.calls[0][0] !== 400) {
            console.error('Error creating target:', res.json.mock.calls[0][0]);
        }

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(
            {
                error: 'Image is required'
            }
        );
    });
});

const { updateTarget } = require('../controllers/targetController');

describe('updateTarget', () => {
    it('should update a target successfully', async () => {
        const req = mockRequest(
            { userId: '123' }, 
            { latitude: 45.0, longitude: -75.0, imageUrl: 'http://example.com/image.jpg', deadline: '2024-01-01' },
            { id: '123' }
        );
        req.file = {
            path: 'path/to/file.jpg',
            originalname: 'file.jpg'
        };
        const res = mockResponse();

        await updateTarget(req, res);

        if (res.status.mock.calls[0][0] !== 200) {
            console.error('Error updating target:', res.json.mock.calls[0][0]);
        }

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.anything());
    });

    it ('should fail to update if not owner', async () => {
        const req = mockRequest(
            { userId: '456' },
            { latitude: 45.0, longitude: -75.0, imageUrl: 'http://example.com/image.jpg', deadline: '2024-01-01' },
            { id: '123' }
        );
        req.file = {
            path: 'path/to/file.jpg',
            originalname: 'file.jpg'
        };
        const res = mockResponse();

        await updateTarget(req, res);

        if (res.status.mock.calls[0][0] !== 403) {
            console.error('Error updating target:', res.json.mock.calls[0][0]);
        }

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith(
            {
                error: 'You are not the owner of this target'
            }
        );
    });
    
});

const { deleteTarget } = require('../controllers/targetController');

describe('deleteTarget', () => {
    it('should delete a target successfully', async () => {
        const req = mockRequest(
            { userId: '123' },
            {},
            { id: '123' }
        );
        const res = mockResponse();

        await deleteTarget(req, res);

        if (res.status.mock.calls[0][0] !== 200) {
            console.error('Error deleting target:', res.json.mock.calls[0][0]);
        }

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.anything());
    });

    it ('should fail to delete if not owner', async () => {
        const req = mockRequest(
            { userId: '456' },
            {},
            { id: '123' }
        );
        const res = mockResponse();

        await deleteTarget(req, res);

        if (res.status.mock.calls[0][0] !== 403) {
            console.error('Error deleting target:', res.json.mock.calls[0][0]);
        }

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith(
            {
                error: 'You are not the owner of this target'
            }
        );
    });
});