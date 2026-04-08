import { PrismaClient } from '@prisma/client';

class PrismaService {
    public client: PrismaClient;

    constructor() {
        this.client = new PrismaClient();
    }
}

export default new PrismaService().client;
