import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const prisma = new PrismaClient();


router.post('/', authMiddleware, async (req: Request, res: Response) => {
    try {
        const { role, id } = req.user!;

        if (role !== 'seller') {
            res.status(403).json({ message: 'Unauthorized - Only sellers can create products' });
            return;
        }
        const { name, description, price, stock } = req.body;

        if (!name || !price || !stock) {
            res.status(400).json({ message: 'Missing required information' });
            return;
        }

        const product = await prisma.product.create({
            data: {
                name,
                description,
                price,
                stock,
                userId: id,
            },
        });
        res.status(201).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
}
);

router.get('/', async (req: Request, res: Response) => {
    try {
        const products = await prisma.product.findMany();
        res.status(200).json(products);
        return;

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
});

router.get("/:id", authMiddleware, async (req: Request, res: Response) => {

    try {
        const { id: userId, role } = req.user!;
        const { id } = req.params;


        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            res.status(400).json({ message: "ID inválido" });
            return
        }

        const product = await prisma.product.findUnique({ where: { id } });
        if (!product) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }

        res.json(product);
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating product' });
        return;
    }
}
);

router.put("/:id", authMiddleware, async (req: Request, res: Response) => {

    try {
        const { id: userId, role } = req.user!;
        const { id } = req.params;


        const product = await prisma.product.findUnique({ where: { id } });
        if (!product) {
            res.status(404).json({ message: 'Product not found' });
            return;

        }

        if (product.userId !== userId && role !== 'admin') {
            res.status(403).json({ message: 'Unauthorized - You can only update your own products' });
            return;
        }

        const { name, description, price, stock } = req.body;

        const updatedProduct = await prisma.product.update({
            where: { id },
            data: { name, description, price, stock },
        });
        res.json(updatedProduct);
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating product' });
        return;
    }
}
);

router.delete("/:id", authMiddleware, async (req: Request, res: Response) => {
    try {
        const { id: userId, role } = req.user!;
        const { id } = req.params;

        const product = await prisma.product.findUnique({ where: { id } });
        if (!product) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }

        if (product.userId !== userId && role !== 'admin') {
            res.status(403).json({ message: 'Unauthorized - You can only delete your own products' });
            return;
        }

        await prisma.product.delete({ where: { id } });
        res.json({ message: 'Product deleted' });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting product' });
        return;
    }
}
);

export default router;