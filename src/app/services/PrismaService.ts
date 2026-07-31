import { PrismaClient } from '@prisma/client';

let dbUrl = process.env.DATABASE_URL || 'file:./prisma/dev.db';
if (!dbUrl.startsWith('file:')) {
    dbUrl = `file:${dbUrl}`;
}
process.env.DATABASE_URL = dbUrl;

class PrismaService {
    public client: PrismaClient;

    constructor() {
        this.client = new PrismaClient({
            datasources: {
                db: {
                    url: dbUrl
                }
            }
        });
    }
}

export default new PrismaService().client;
