import { AppDataSource } from "../config/data-source";
import { Payment } from "../entities/Payment";

const paymentRepository = () => AppDataSource.getRepository(Payment);

export const getMyPaymentsService = async (userId: number) => {
  return paymentRepository().find({
    where: { user: { id: userId } },
    relations: { document: true },
    order: { createdAt: "DESC" },
  });
};

export const getAllPaymentsService = async () => {
  return paymentRepository().find({
    relations: { user: true, document: true },
    order: { createdAt: "DESC" },
  });
};
