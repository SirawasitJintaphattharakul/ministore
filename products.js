const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createProduct = async (req, res) => {
    const { product_id, name, description , price, category, image_url } = req.body;
    try {
        const prod = await prisma.products.create({
            data: {
                product_id,
                name,
                description,
                price,
                category,
                image_url
            }
        });
        res.status(200).json({
            status: "ok",
            message: `User with ID = ${prod.product_id} is created` // ส่ง ID ที่ถูกสร้างกลับไป
          });
        } catch (err) {
          // จัดการข้อผิดพลาด
          res.status(500).json({
            status: "error",
            message: "Failed to create user",
            error: err.message
          });
        }
      };

      const updateProduct = async (req, res) => {
        const { name, description , price, category, image_url } = req.body;
        const { id } = req.params; // Get the customer ID from the URL parameter
    
        // Build the data object for the update
        const data = {};
        if (name) data.name = name;
        if (description) data.description = description;
        if (price) data.price = price;
        if (category) data.category = category;
        if (image_url) data.image_url = image_url;
    
        // Check if there's any data to update
        if (Object.keys(data).length === 0) {
            return res.status(400).json({ 
                status: 'error',
                message: 'No data provided for update.'
            });
        }
    
        try {
            const cust = await prisma.products.update({
                data,
                where: { product_id: Number(id) } // Use the ID from the URL
            });
            res.status(200).json({
                status: 'ok',
                message: `User with ID = ${id} is updated`,
                user: cust
            });
        } catch (err) {
            // Handle known Prisma errors
            if (err.code === 'P2002') {
                // Unique constraint violation (e.g., email already exists)
                res.status(400).json({ 
                    status: 'error',
                    message: 'Email already exists.' 
                });
            } else if (err.code === 'P2025') {
                // Record not found
                res.status(404).json({ 
                    status: 'error',
                    message: `User with ID = ${id} not found.` 
                });
            } else {
                // Handle other unexpected errors
                console.error('Update product error: ', err);
                res.status(500).json({ 
                    status: 'error',
                    message: 'An unexpected error occurred.' 
                });
            }
        }
    };
    
    const deleteProduct = async (req, res) => {
        const id = req.params.id;
      
        try {
          // ตรวจสอบว่าลูกค้ามีอยู่หรือไม่
          const existingProduct = await prisma.products.findUnique({
            where: {
              product_id: Number(id),  // ตรวจสอบว่า customer_id เป็นตัวเลข
            },
          });
      
          // ถ้าไม่พบลูกค้า
          if (!existingProduct) {
            return res.status(404).json({ message: 'Product not found' });
          }
      
          // ลบลูกค้า
          await prisma.products.delete({
            where: {
              product_id: Number(id),
            },
          });
      
          // ส่งข้อความเมื่อทำการลบสำเร็จ
          res.status(200).json({
            status: "ok",
            message: `User with ID = ${id} is deleted`  // แสดง ID ที่ถูกลบ
          });
        } catch (err) {
          console.error('Delete product error: ', err);  // แสดงข้อผิดพลาดใน console
          res.status(500).json({ error: err.message });  // ส่งข้อความข้อผิดพลาดกลับไปที่ client
        }
      };
      
      const getProducts = async (req, res) => {
        const prods = await prisma.products.findMany()
        res.json(prods)
    };
    // get only one customer by customer_id
    const getProduct = async (req, res) => {
        const id = req.params.id;
        try {
            const prods = await prisma.products.findUnique({
                where: { product_id: Number(id) },
            });
            if (!prods) {
                res.status(404).json({ 'message': 'Product not found!' });
            } else {
                res.status(200).json(prods);
            }
        } catch (err) {
            res.status(500).json(err);
        }
    };
    // search any customer by name
    const getProductsByTerm = async (req, res) => {
        const searchString = req.params.term;
        try {
            const prods = await prisma.products.findMany({
                where: {
                    OR: [
                        {
                            name: {
                                contains: searchString
                            }
                        },
                    ]
                },
            });
            if (!prods || prods.length == 0) {
                res.status(404).json({ 'message': 'Product not found!' });
            } else {
                res.status(200).json(prods);
            }
        } catch (err) {
            res.status(500).json(err);
        }
    };

module.exports = { createProduct , getProduct, getProducts,
    updateProduct, deleteProduct, getProductsByTerm};
