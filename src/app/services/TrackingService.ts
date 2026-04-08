import prisma from './PrismaService';

class TrackingService {
    async save(chatId: string, code: string, userName?: string, description?: string, lastEventDate?: string) {
        return await prisma.tracking.upsert({
            where: {
                chatId_code: {
                    chatId,
                    code
                }
            },
            update: {
                description,
                lastEventDate,
                userName
            },
            create: {
                chatId,
                code,
                userName,
                description,
                lastEventDate
            }
        });
    }

    async getAll() {
        return await prisma.tracking.findMany();
    }

    async getByUser(chatId: string) {
        return await prisma.tracking.findMany({
            where: { chatId }
        });
    }

    async delete(chatId: string, code: string) {
        return await prisma.tracking.delete({
            where: {
                chatId_code: {
                    chatId,
                    code
                }
            }
        });
    }
}

export default new TrackingService();
