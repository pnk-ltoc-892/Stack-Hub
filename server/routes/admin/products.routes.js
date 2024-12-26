import { Router } from 'express'
import { upload } from "../../middleware/multer.middleware.js"
import { addNewProduct, deleteProduct, editProduct, fetchAllProducts, handleImageUpload } from '../../controllers/admin/products.controller.js'

const router = Router()

// ! Admin/User Verification Not Done -> ??

router.post('/upload-image', upload.single('imageFile') , handleImageUpload)

router.post('/add', addNewProduct)

router.put('/edit/:id', editProduct)

router.delete('/delete/:id', deleteProduct)

router.get('/', fetchAllProducts)



export default router

