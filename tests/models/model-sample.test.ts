import { Pool } from 'pg';
import {
    getTimeModel,
    sampleTransactionModel,
} from '../../src/models/model-sample';

// mock pg/Pool in in utils/dbUtil
jest.mock('pg', () => {
    const result = {
        command: 'string',
        rowCount: 0,
    };
    const client = {
        query: () => {
            return result;
        },
        release: jest.fn(),
    };
    const methods = {
        connect: () => client,
        on: jest.fn(),
        query: jest.fn(),
    };
    return { Pool: jest.fn(() => methods) };
});

describe('getTimeModel', () => {
    let pool: any;
    beforeEach(() => {
        pool = new Pool();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should success', async () => {
        pool.query.mockResolvedValueOnce({ rows: [], rowCount: 0 });
        const res = await getTimeModel();
        expect(pool.query).toBeCalledWith('SELECT NOW() as now;', undefined);
        expect(res).toEqual({ rows: [], rowCount: 0 });
    });
});

describe('sampleTransactionModel', () => {
    let pool: any;
    beforeEach(() => {
        pool = new Pool();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should success', async () => {
        pool.query.mockResolvedValueOnce({ rows: [], rowCount: 0 });
        const res = await sampleTransactionModel();
        expect(res).toEqual('transaction success');
    });
});
