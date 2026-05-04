import { AppDataSource } from "../config/data-source";
import { Document } from "../entities/Document";
import { Payment } from "../entities/Payment";
import { Purchase } from "../entities/Purchase";
import { User } from "../entities/User";
import { DocumentStatus } from "../enums/DocumentStatus";
import { PaymentStatus } from "../enums/PaymentStatus";
import { AppError } from "../utils/AppError";

interface BuyDocumentBody {
  provider?: string;
  reference?: string;
}

const documentRepository = () => AppDataSource.getRepository(Document);
const userRepository = () => AppDataSource.getRepository(User);
const paymentRepository = () => AppDataSource.getRepository(Payment);
const purchaseRepository = () => AppDataSource.getRepository(Purchase);

export const buyDocumentService = async (documentId: number, userId: number, body: BuyDocumentBody) => {
  const document = await documentRepository().findOne({
    where: { id: documentId, status: DocumentStatus.ACTIVE },
    relations: { owner: true },
  });

  if (!document) throw new AppError("Document introuvable", 404);

  if (document.isFree) {
    return {
      statusCode: 200,
      message: "Ce document est gratuit, achat non necessaire",
      payment: null,
      purchase: null,
    };
  }

  if (document.owner.id === userId) {
    throw new AppError("Vous etes deja proprietaire de ce document", 400);
  }

  const existingPurchase = await purchaseRepository().findOne({
    where: { user: { id: userId }, document: { id: document.id } },
  });

  if (existingPurchase) {
    return {
      statusCode: 200,
      message: "Document deja achete",
      payment: null,
      purchase: existingPurchase,
    };
  }

  const user = await userRepository().findOne({ where: { id: userId } });
  if (!user) throw new AppError("Utilisateur introuvable", 404);

  const payment = paymentRepository().create({
    amount: document.price,
    status: PaymentStatus.SUCCESS,
    provider: body.provider || "manual",
    reference: body.reference || `PAY-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
    user,
    document,
  });

  await paymentRepository().save(payment);

  const purchase = purchaseRepository().create({
    user,
    document,
    payment,
  });

  await purchaseRepository().save(purchase);

  return {
    statusCode: 201,
    message: "Achat effectue avec succes",
    payment,
    purchase,
  };
};

export const getMyPurchasesService = async (userId: number) => {
  return purchaseRepository().find({
    where: { user: { id: userId } },
    relations: { document: { category: true, owner: true }, payment: true },
    order: { createdAt: "DESC" },
  });
};

export const getAllPurchasesService = async () => {
  return purchaseRepository().find({
    relations: { user: true, document: true, payment: true },
    order: { createdAt: "DESC" },
  });
};
